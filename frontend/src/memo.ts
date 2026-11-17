import {
  address, appendTransactionMessageInstruction, compileTransaction, createSolanaRpc,
  createTransactionMessage, getBase58Encoder, getBase64Decoder, getBase64EncodedWireTransaction,
  getPublicKeyFromAddress, getSignatureFromTransaction, getTransactionDecoder, getTransactionEncoder,
  pipe, setTransactionMessageFeePayer, setTransactionMessageLifetimeUsingBlockhash, signature, verifySignature,
} from '@solana/kit';
import type { Blockhash, TransactionMessageBytesBase64 } from '@solana/kit';
import { getWallets } from '@wallet-standard/app';
import { checkDevnet, getPhantom } from './preparation';
import { savePending } from './memo-record';
import type { MemoRecord } from './memo-record';

export const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
export const MEMO_PREFIX = 'propertychain:v1:sha256:';
export function buildMemo(hash: string, payer: string, lifetime: { blockhash: Blockhash; lastValidBlockHeight: bigint }) {
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Calcule uma impressão digital válida antes de registrar.');
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayer(address(payer), tx),
    tx => setTransactionMessageLifetimeUsingBlockhash(lifetime, tx),
    tx => appendTransactionMessageInstruction({ programAddress: address(MEMO_PROGRAM), data: new TextEncoder().encode(MEMO_PREFIX + hash) }, tx),
  );
  return compileTransaction(message);
}
function rpc() { return createSolanaRpc(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com'); }
const callSignal = (signal: AbortSignal) => AbortSignal.any([signal, AbortSignal.timeout(15000)]);
export interface MemoDraft {
  hash: string; payer: string; fee: bigint; lastValidBlockHeight: bigint;
  transaction: ReturnType<typeof buildMemo>;
}
export async function prepareMemo(hash: string, payer: string, signal: AbortSignal): Promise<MemoDraft> {
  await checkDevnet(callSignal(signal));
  const client = rpc();
  const lifetime = (await client.getLatestBlockhash({ commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) })).value;
  const transaction = buildMemo(hash, payer, lifetime);
  const fee = (await client.getFeeForMessage(getBase64Decoder().decode(transaction.messageBytes) as TransactionMessageBytesBase64, { commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) })).value;
  if (fee === null) throw new Error('A preparação expirou. Prepare o registro novamente.');
  const balance = (await client.getBalance(address(payer), { commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) })).value;
  if (balance < fee) throw new Error('Saldo insuficiente na Devnet. Obtenha SOL de teste em um faucet e tente novamente. Não compre moedas.');
  const simulation = await client.simulateTransaction(getBase64EncodedWireTransaction(transaction), { encoding: 'base64', sigVerify: false, replaceRecentBlockhash: true, commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) });
  if (simulation.value.err !== null) throw new Error('A simulação do registro falhou. Nenhuma assinatura foi solicitada. Confira o saldo de teste e tente preparar novamente.');
  return { hash, payer, fee, lastValidBlockHeight: lifetime.lastValidBlockHeight, transaction };
}

/** Reject wallet modifications, extra instructions and signatures for another payer. */
export async function validateSigned(draft: MemoDraft, bytes: Uint8Array) {
  const signed = getTransactionDecoder().decode(bytes);
  if (signed.messageBytes.length !== draft.transaction.messageBytes.length || signed.messageBytes.some((byte, i) => byte !== draft.transaction.messageBytes[i])) throw new Error('A carteira alterou o conteúdo da transação. Nenhum envio foi realizado.');
  const sig = signed.signatures[address(draft.payer)];
  if (!sig || !await verifySignature(await getPublicKeyFromAddress(address(draft.payer)), sig, signed.messageBytes)) throw new Error('A assinatura da carteira não corresponde ao registro preparado. Nenhum envio foi realizado.');
  return { signed, record: { hash: draft.hash, payer: draft.payer, signature: getSignatureFromTransaction(signed) } satisfies MemoRecord };
}
export async function signAndSubmit(draft: MemoDraft, signal: AbortSignal, stillCurrent: () => boolean, onSignature: (record: MemoRecord) => void): Promise<MemoRecord> {
  const assertCurrent = () => {
    signal.throwIfAborted();
    if (!stillCurrent() || getPhantom()?.publicKey?.toString() !== draft.payer) throw new Error('A conta ou o arquivo mudou. Prepare novamente antes de aprovar.');
  };
  assertCurrent();
  await checkDevnet(callSignal(signal));
  if (await rpc().getBlockHeight({ commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) }) > draft.lastValidBlockHeight) throw new Error('A preparação expirou. Prepare o registro novamente antes de aprovar.');
  const wallet = getWallets().get().find(w => w.name === 'Phantom' && w.accounts.some(a => a.address === draft.payer));
  const account = wallet?.accounts.find(a => a.address === draft.payer && a.chains.includes('solana:devnet'));
  const feature = wallet?.features['solana:signTransaction'] as {
    supportedTransactionVersions: readonly (number | string)[];
    signTransaction(input: { account: unknown; chain: string; transaction: Uint8Array }): Promise<readonly { signedTransaction: Uint8Array }[]>;
  } | undefined;
  if (!account || !feature?.supportedTransactionVersions.includes(0)) throw new Error('A Phantom não disponibilizou assinatura Wallet Standard para Devnet/v0. Atualize a extensão e conecte novamente.');
  assertCurrent();
  const result = await feature.signTransaction({ account, chain: 'solana:devnet', transaction: new Uint8Array(getTransactionEncoder().encode(draft.transaction)) });
  assertCurrent();
  if (result.length !== 1) throw new Error('Resposta inesperada da carteira. Nenhum envio foi realizado.');
  const { signed, record } = await validateSigned(draft, result[0].signedTransaction);
  if ((await rpc().getBlockHeight({ commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) })) > draft.lastValidBlockHeight) throw new Error('A preparação expirou enquanto aguardava aprovação. Nenhum envio foi realizado. Prepare novamente.');
  assertCurrent();
  // Persist receipt before broadcast so uncertain sends survive reload without automatic resubmission.
  savePending(record); onSignature(record);
  try {
    const returned = await rpc().sendTransaction(getBase64EncodedWireTransaction(signed), { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 0n }).send({ abortSignal: callSignal(signal) });
    if (returned !== record.signature) throw new Error('Resposta de envio divergente.');
  } catch {
    // Submission may have reached the network. Never rebuild or resend automatically.
  }
  return record;
}

export function validateRecordedTransaction(value: unknown, expected: MemoRecord): boolean {
  if (!value || typeof value !== 'object') return false;
  const tx = value as { meta?: { err?: unknown }; transaction?: { signatures?: string[]; message?: { header?: { numRequiredSignatures?: number }; accountKeys?: string[]; instructions?: { programIdIndex?: number; accounts?: number[]; data?: string }[] } } };
  const message = tx.transaction?.message;
  if (tx.meta?.err !== null || tx.transaction?.signatures?.[0] !== expected.signature || message?.header?.numRequiredSignatures !== 1 || message?.accountKeys?.length !== 2 || message.accountKeys[0] !== expected.payer || message.accountKeys[1] !== MEMO_PROGRAM || message.instructions?.length !== 1) return false;
  const ix = message.instructions[0];
  if (ix.programIdIndex !== 1 || ix.accounts?.length !== 0 || typeof ix.data !== 'string') return false;
  try { return new TextDecoder('utf-8', { fatal: true }).decode(getBase58Encoder().encode(ix.data)) === MEMO_PREFIX + expected.hash; }
  catch { return false; }
}
export async function confirmMemo(record: MemoRecord, signal: AbortSignal, timeoutMs = 45000): Promise<'confirmed' | 'pending' | 'failed'> {
  await checkDevnet(callSignal(signal));
  const end = Date.now() + timeoutMs;
  do {
    signal.throwIfAborted();
    const status = (await rpc().getSignatureStatuses([signature(record.signature)], { searchTransactionHistory: true }).send({ abortSignal: callSignal(signal) })).value[0];
    if (status?.err) return 'failed';
    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
      const tx = await rpc().getTransaction(signature(record.signature), { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }).send({ abortSignal: callSignal(signal) });
      if (tx) {
        if (!validateRecordedTransaction(tx, record)) throw new Error('A transação encontrada não corresponde ao hash e ao registro preparados. Não considere o cadastro concluído.');
        return 'confirmed';
      }
    }
    if (Date.now() >= end) break;
    await new Promise<void>((resolve, reject) => {
      const cancel = () => { clearTimeout(timer); reject(signal.reason); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, 1500);
      signal.addEventListener('abort', cancel, { once: true });
    });
  } while (Date.now() < end);
  return 'pending';
}

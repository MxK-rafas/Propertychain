import {
  address, appendTransactionMessageInstruction, compileTransaction, createSolanaRpc,
  createTransactionMessage, getBase58Decoder, getBase58Encoder, getBase64Decoder, getBase64EncodedWireTransaction, getCompiledTransactionMessageDecoder,
  getPublicKeyFromAddress, getSignatureFromTransaction, getTransactionDecoder, getTransactionEncoder,
  pipe, setTransactionMessageFeePayer, setTransactionMessageLifetimeUsingBlockhash, signature, verifySignature,
} from '@solana/kit';
import type { Blockhash, TransactionMessageBytes, TransactionMessageBytesBase64 } from '@solana/kit';
import { getWallets } from '@wallet-standard/app';
import { checkDevnet, getPhantom } from './preparation';
import { savePending } from './memo-record';
import type { MemoRecord } from './memo-record';
import { MemoStageError, memoStage } from './memo-errors';

export const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
export const MEMO_PREFIX = 'propertychain:v1:sha256:';
const COMPUTE_BUDGET_PROGRAM = address('ComputeBudget111111111111111111111111111111');
// SetComputeUnitPrice (3), followed by a zero u64 in micro-lamports per compute unit.
const ZERO_PRIORITY_FEE_DATA = Uint8Array.of(3, 0, 0, 0, 0, 0, 0, 0, 0);
const ZERO_PRIORITY_FEE_BASE58 = getBase58Decoder().decode(ZERO_PRIORITY_FEE_DATA);

export function buildMemo(hash: string, payer: string, lifetime: { blockhash: Blockhash; lastValidBlockHeight: bigint }) {
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Calcule uma impressão digital válida antes de registrar.');
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayer(address(payer), tx),
    tx => setTransactionMessageLifetimeUsingBlockhash(lifetime, tx),
    tx => appendTransactionMessageInstruction({ programAddress: COMPUTE_BUDGET_PROGRAM, data: ZERO_PRIORITY_FEE_DATA.slice() }, tx),
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

function describeMessageChanges(expectedBytes: TransactionMessageBytes, returnedBytes: TransactionMessageBytes): string {
  const decoder = getCompiledTransactionMessageDecoder();
  try {
    const expected = decoder.decode(expectedBytes);
    const returned = decoder.decode(returnedBytes);
    const fields: [string, unknown, unknown][] = [
      ['versão da mensagem', expected.version, returned.version],
      ['conta pagadora', expected.staticAccounts[0], returned.staticAccounts[0]],
      ['blockhash da transação', expected.lifetimeToken, returned.lifetimeToken],
      ['permissões das contas', expected.header, returned.header],
      ['demais contas', expected.staticAccounts.slice(1), returned.staticAccounts.slice(1)],
      ['instruções', 'instructions' in expected ? expected.instructions : undefined, 'instructions' in returned ? returned.instructions : undefined],
      ['tabelas de endereços', expected.version === 0 ? expected.addressTableLookups : undefined,
        returned.version === 0 ? returned.addressTableLookups : undefined],
    ];
    const changes = fields.filter(([, before, after]) => JSON.stringify(before) !== JSON.stringify(after));
    return changes.length
      ? `Campos divergentes (${changes.map(([label]) => label).join(', ')}).`
      : 'Os bytes da mensagem diferem, mas os campos comparados coincidem.';
  } catch {
    return 'A mensagem devolvida não pôde ser interpretada para identificar os campos divergentes.';
  }
}

/** Reject wallet modifications, extra instructions and signatures for another payer. */
export async function validateSigned(draft: MemoDraft, bytes: Uint8Array) {
  const signed = getTransactionDecoder().decode(bytes);
  const expectedBytes = draft.transaction.messageBytes;
  if (signed.messageBytes.length !== expectedBytes.length || signed.messageBytes.some((byte, i) => byte !== expectedBytes[i])) {
    const changes = describeMessageChanges(expectedBytes, signed.messageBytes);
    throw new MemoStageError('PC_WALLET_MESSAGE', `A carteira alterou o conteúdo da transação. ${changes} Nenhum envio foi realizado.`, undefined);
  }
  const sig = signed.signatures[address(draft.payer)];
  if (!sig || !await memoStage('PC_CRYPTO', 'Este navegador não conseguiu conferir a assinatura da Phantom. Atualize o navegador e a extensão Phantom. Nenhum envio foi realizado.', async () => verifySignature(await getPublicKeyFromAddress(address(draft.payer)), sig, signed.messageBytes))) throw new Error('A assinatura da carteira não corresponde ao registro preparado. Nenhum envio foi realizado.');
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
  const result = await memoStage('PC_WALLET', 'A Phantom não devolveu uma transação assinada ao app. Confira a conexão e atualize a extensão Phantom. Nenhum envio foi realizado pelo app.', () => feature.signTransaction({ account, chain: 'solana:devnet', transaction: new Uint8Array(getTransactionEncoder().encode(draft.transaction)) }));
  assertCurrent();
  if (result.length !== 1) throw new Error('Resposta inesperada da carteira. Nenhum envio foi realizado.');
  const { signed, record } = await validateSigned(draft, result[0].signedTransaction);
  const height = await memoStage('PC_LIFETIME', 'A assinatura foi recebida, mas não foi possível consultar a Devnet para conferir o prazo da transação. Nenhum envio foi realizado. Confira sua internet e prepare novamente.', () => rpc().getBlockHeight({ commitment: 'confirmed' }).send({ abortSignal: callSignal(signal) }));
  if (height > draft.lastValidBlockHeight) throw new Error('A preparação expirou enquanto aguardava aprovação. Nenhum envio foi realizado. Prepare novamente.');
  assertCurrent();
  // Persist receipt before broadcast so uncertain sends survive reload without automatic resubmission.
  await memoStage('PC_RECEIPT', 'Não foi possível guardar o comprovante público nesta aba. Permita o armazenamento de sessão no navegador antes de tentar novamente. Nenhum envio foi realizado.', async () => savePending(record));
  onSignature(record);
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
  if (tx.meta?.err !== null || tx.transaction?.signatures?.[0] !== expected.signature || message?.header?.numRequiredSignatures !== 1) return false;
  const { accountKeys, instructions } = message;
  if (!Array.isArray(accountKeys) || !Array.isArray(instructions) || accountKeys[0] !== expected.payer) return false;

  const memoIndex = accountKeys.indexOf(MEMO_PROGRAM, 1);
  const memo = instructions.at(-1);
  if (memoIndex < 1 || memo?.programIdIndex !== memoIndex || memo.accounts?.length !== 0 || typeof memo.data !== 'string') return false;

  if (instructions.length === 2) {
    const budget = instructions[0];
    const budgetIndex = accountKeys.indexOf(COMPUTE_BUDGET_PROGRAM, 1);
    if (accountKeys.length !== 3 || budgetIndex < 1 || budget?.programIdIndex !== budgetIndex ||
        budget.accounts?.length !== 0 || budget.data !== ZERO_PRIORITY_FEE_BASE58) return false;
  } else if (instructions.length !== 1 || accountKeys.length !== 2) {
    return false;
  }

  try { return new TextDecoder('utf-8', { fatal: true }).decode(getBase58Encoder().encode(memo.data)) === MEMO_PREFIX + expected.hash; }
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

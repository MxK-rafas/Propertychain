// @vitest-environment node
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { generateKeyPairSigner, getBase58Decoder, getCompiledTransactionMessageDecoder, getTransactionEncoder, signTransaction } from '@solana/kit';
import type { Blockhash } from '@solana/kit';
const state = vi.hoisted(() => ({ calls: [] as { method: string; args: unknown[] }[], replies: {} as Record<string, unknown>, wallets: [] as any[] }));
vi.mock('@wallet-standard/app', () => ({ getWallets: () => ({ get: () => state.wallets }) }));
vi.mock('@solana/kit', async original => ({ ...await original<typeof import('@solana/kit')>(), createSolanaRpc: () => new Proxy({}, { get: (_target, method: string) => (...args: unknown[]) => ({ send: async () => { state.calls.push({ method, args }); const value = state.replies[method]; if (value instanceof Error) throw value; if (value === undefined) throw new Error(`RPC inesperado: ${method}`); return value; } }) }) }));
import { buildMemo, prepareMemo, signAndSubmit, confirmMemo, validateSigned, validateRecordedTransaction, MEMO_PROGRAM, MEMO_PREFIX } from './memo';
import { clearPending, readPending, savePending, PENDING_KEY } from './memo-record';
import { DEVNET_GENESIS } from './preparation';
const hash = 'a'.repeat(64);
const signal = () => new AbortController().signal;
let signer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
let approve: ReturnType<typeof vi.fn>;
let store: Map<string, string>;
beforeEach(async () => {
  vi.stubEnv('VITE_SOLANA_CLUSTER', 'devnet');
  store = new Map();
  vi.stubGlobal('sessionStorage', { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value), removeItem: (key: string) => store.delete(key) });
  signer = await generateKeyPairSigner();
  vi.stubGlobal('window', { phantom: { solana: { publicKey: { toString: () => signer.address } } } });
  state.calls = [];
  state.replies = { getGenesisHash: DEVNET_GENESIS, getLatestBlockhash: { value: { blockhash: '11111111111111111111111111111111' as Blockhash, lastValidBlockHeight: 100n } }, getBlockHeight: 10n, getFeeForMessage: { value: 5000n }, getBalance: { value: 20000n }, simulateTransaction: { value: { err: null } } };
  approve = vi.fn(async (input: { transaction: Uint8Array; chain: string }) => {
    expect(input.chain).toBe('solana:devnet');
    const draft = await prepareMemo(hash, signer.address, signal());
    const signed = await signTransaction([signer.keyPair], draft.transaction);
    return [{ signedTransaction: new Uint8Array(getTransactionEncoder().encode(signed)) }];
  });
  state.wallets = [{ name: 'Phantom', accounts: [{ address: signer.address, chains: ['solana:devnet'] }], features: { 'solana:signTransaction': { supportedTransactionVersions: [0], signTransaction: approve } } }];
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function txResponse(record: { hash: string; payer: string; signature: string }) {
  return { meta: { err: null }, transaction: { signatures: [record.signature], message: { header: { numRequiredSignatures: 1 }, accountKeys: [record.payer, MEMO_PROGRAM], instructions: [{ programIdIndex: 1, accounts: [] as number[], data: getBase58Decoder().decode(new TextEncoder().encode(MEMO_PREFIX + record.hash)) }] } } };
}
describe('Registro Memo sem carteira ou rede reais nos testes', () => {
  it('compila só um Memo, sem transferência', () => {
    const tx = buildMemo(hash, signer.address, { blockhash: '11111111111111111111111111111111' as Blockhash, lastValidBlockHeight: 100n });
    const message = getCompiledTransactionMessageDecoder().decode(tx.messageBytes);
    if (message.version !== 0) throw new Error('Esperada transação v0');
    expect(message.staticAccounts).toEqual([signer.address, MEMO_PROGRAM]);
    expect(message.instructions).toHaveLength(1);
    expect(new TextDecoder().decode(message.instructions[0].data)).toBe(MEMO_PREFIX + hash);
  });
  it('prepara taxa e simulação sem pedir assinatura', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    expect(draft.fee).toBe(5000n);
    expect(approve).not.toHaveBeenCalled();
  });
  it('recusa saldo insuficiente antes da assinatura', async () => {
    state.replies.getBalance = { value: 1n };
    await expect(prepareMemo(hash, signer.address, signal())).rejects.toThrow('Saldo insuficiente');
    expect(approve).not.toHaveBeenCalled();
  });
  it('recusa simulação falha e preparação expirada', async () => {
    state.replies.simulateTransaction = { value: { err: { InstructionError: [0, 'error'] } } };
    await expect(prepareMemo(hash, signer.address, signal())).rejects.toThrow('simulação');
    state.replies.getFeeForMessage = { value: null };
    await expect(prepareMemo(hash, signer.address, signal())).rejects.toThrow('expirou');
  });
  it('mantém recibo antes do único envio incerto e confirmação não reenvia', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    state.replies.sendTransaction = new Error('rede interrompida após receber bytes');
    const published = vi.fn(record => expect(readPending()).toEqual(record));
    const record = await signAndSubmit(draft, signal(), () => true, published);
    expect(published).toHaveBeenCalledOnce();
    expect(readPending()).toEqual(record);
    expect(state.calls.filter(c => c.method === 'sendTransaction')).toHaveLength(1);
    state.replies.getSignatureStatuses = { value: [null] };
    expect(await confirmMemo(record, signal(), 0)).toBe('pending');
    expect(state.calls.filter(c => c.method === 'sendTransaction')).toHaveLength(1);
  });
  it('cancelamento não persiste nem envia', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    approve.mockRejectedValue({ code: 4001 });
    await expect(signAndSubmit(draft, signal(), () => true, vi.fn())).rejects.toMatchObject({ code: 4001 });
    expect(readPending()).toBeNull();
    expect(state.calls.some(c => c.method === 'sendTransaction')).toBe(false);
  });
  it('recusa wallet ausente, arquivo alterado e prazo vencido', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    await expect(signAndSubmit(draft, signal(), () => false, vi.fn())).rejects.toThrow('mudou');
    state.replies.getBlockHeight = 101n;
    await expect(signAndSubmit(draft, signal(), () => true, vi.fn())).rejects.toThrow('expirou');
    state.replies.getBlockHeight = 10n; state.wallets = [];
    await expect(signAndSubmit(draft, signal(), () => true, vi.fn())).rejects.toThrow('Wallet Standard');
    expect(approve).not.toHaveBeenCalled();
  });
  it('recusa alteração do conteúdo mesmo com assinatura válida', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    const other = buildMemo('b'.repeat(64), signer.address, { blockhash: '11111111111111111111111111111111' as Blockhash, lastValidBlockHeight: 100n });
    const signed = await signTransaction([signer.keyPair], other);
    await expect(validateSigned(draft, new Uint8Array(getTransactionEncoder().encode(signed)))).rejects.toThrow('alterou');
  });
  it('recusa ausência de assinatura', async () => {
    const draft = await prepareMemo(hash, signer.address, signal());
    await expect(validateSigned(draft, new Uint8Array(getTransactionEncoder().encode(draft.transaction)))).rejects.toThrow('assinatura');
  });
  it('só confirma com status e conteúdo corretos', async () => {
    const record = { hash, payer: signer.address, signature: '1'.repeat(64) };
    state.replies.getSignatureStatuses = { value: [{ err: null, confirmationStatus: 'confirmed' }] };
    state.replies.getTransaction = txResponse(record);
    expect(await confirmMemo(record, signal(), 0)).toBe('confirmed');
    state.replies.getTransaction = txResponse({ ...record, hash: 'b'.repeat(64) });
    await expect(confirmMemo(record, signal(), 0)).rejects.toThrow('não corresponde');
    state.replies.getSignatureStatuses = { value: [{ err: { InstructionError: [] }, confirmationStatus: 'confirmed' }] };
    expect(await confirmMemo(record, signal(), 0)).toBe('failed');
  });
  it('recusa programa errado e instruções extras', () => {
    const record = { hash, payer: signer.address, signature: '1'.repeat(64) };
    const tx = txResponse(record);
    expect(validateRecordedTransaction(tx, record)).toBe(true);
    tx.transaction.message.instructions.push(tx.transaction.message.instructions[0]);
    expect(validateRecordedTransaction(tx, record)).toBe(false);
    tx.transaction.message.instructions.pop(); tx.transaction.message.accountKeys[1] = signer.address;
    expect(validateRecordedTransaction(tx, record)).toBe(false);
  });
  it('conserva somente recibo público e ignora JSON inválido', () => {
    const record = { hash, payer: signer.address, signature: '1'.repeat(64) };
    savePending(record); expect(readPending()).toEqual(record);
    expect(Object.keys(JSON.parse(store.get(PENDING_KEY)!))).toEqual(['hash', 'payer', 'signature']);
    store.set(PENDING_KEY, '{inválido'); expect(readPending()).toBeNull();
    clearPending(); expect(readPending()).toBeNull();
  });
});

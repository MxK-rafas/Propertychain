export interface MemoRecord { hash: string; payer: string; signature: string }
export const PENDING_KEY = 'propertychain.pending.devnet.v1';
export const explorerUrl = (signature: string) => `https://explorer.solana.com/tx/${encodeURIComponent(signature)}?cluster=devnet`;
export function validRecord(value: unknown): value is MemoRecord {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<MemoRecord>;
  return typeof r.hash === 'string' && /^[a-f0-9]{64}$/.test(r.hash) && typeof r.payer === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(r.payer) && typeof r.signature === 'string' && /^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(r.signature);
}
export function readPending(): MemoRecord | null {
  try { const value: unknown = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null'); return validRecord(value) ? value : null; }
  catch { return null; }
}
export function savePending(record: MemoRecord) {
  if (!validRecord(record)) throw new Error('Comprovante de transação inválido. Nenhum envio foi realizado.');
  // Only public receipt fields. Never file names, contents, images, keys or signed bytes.
  sessionStorage.setItem(PENDING_KEY, JSON.stringify({ hash: record.hash, payer: record.payer, signature: record.signature }));
}
export function clearPending() { sessionStorage.removeItem(PENDING_KEY); }
export function formatTestSol(fee: bigint) {
  return `${fee / 1_000_000_000n}.${(fee % 1_000_000_000n).toString().padStart(9, '0')} SOL de teste`;
}

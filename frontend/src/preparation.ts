/** Only local bytes enter this function. No network, persistence or logging. */
export async function sha256(bytes: ArrayBuffer): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error('Abra o app em localhost ou HTTPS para calcular a impressão digital.');
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on(event: 'disconnect' | 'accountChanged', callback: (key?: { toString(): string } | null) => void): void;
  removeListener(event: 'disconnect' | 'accountChanged', callback: (key?: { toString(): string } | null) => void): void;
}
export function getPhantom(): PhantomProvider | undefined {
  return (window as Window & { phantom?: { solana?: PhantomProvider } }).phantom?.solana;
}

export const DEVNET_GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export async function checkDevnet(signal: AbortSignal): Promise<void> {
  if ((import.meta.env.VITE_SOLANA_CLUSTER || 'devnet') !== 'devnet') throw new Error('Configure somente a rede Solana Devnet.');
  const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use um endereço RPC público HTTPS da Devnet, sem credenciais.');
  const { createSolanaRpc } = await import('@solana/kit');
  const genesis = await createSolanaRpc(endpoint).getGenesisHash().send({ abortSignal: signal });
  if (genesis !== DEVNET_GENESIS) throw new Error('O servidor configurado não é da Solana Devnet. Nenhuma transação foi enviada.');
}
export async function validatePublicAddress(value: string) {
  const { address } = await import('@solana/kit');
  return address(value);
}

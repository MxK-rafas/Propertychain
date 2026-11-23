export const OFFICIAL_APP_URL = 'https://propertychain-theta.vercel.app/';

export function lookupFragment(signature: string, page: 'consulta' | 'resultado' = 'consulta') {
  return `#${page}?${new URLSearchParams({ tx: signature })}`;
}

export function publicLookupUrl(signature: string) {
  return OFFICIAL_APP_URL + lookupFragment(signature);
}

/** Extract a reference locally; never visit or fetch a pasted URL. */
export function transactionFromReference(input: string): string | null {
  const value = input.trim();
  const looksLikeSignature = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(s);
  if (looksLikeSignature(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (url.hostname === 'explorer.solana.com') {
      if (url.searchParams.get('cluster') !== 'devnet') return null;
      const tx = /^\/tx\/([^/]+)\/?$/.exec(url.pathname)?.[1];
      return tx && looksLikeSignature(tx) ? tx : null;
    }
    const official = new URL(OFFICIAL_APP_URL).hostname;
    if (url.hostname !== official && !/^propertychain-[a-z0-9-]+\.vercel\.app$/.test(url.hostname)) return null;
    const [page, query] = url.hash.split('?', 2);
    if (page !== '#consulta' && page !== '#resultado') return null;
    const values = new URLSearchParams(query).getAll('tx');
    return values.length === 1 && looksLikeSignature(values[0]) ? values[0] : null;
  } catch { return null; }
}

// @vitest-environment node
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { sha256, validatePublicAddress, checkDevnet, DEVNET_GENESIS } from './preparation';
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('SHA-256 local', () => {
  it('calcula o vetor conhecido sem modificar os bytes', async () => {
    vi.stubGlobal('crypto', webcrypto);
    expect(await sha256(new TextEncoder().encode('abc').buffer)).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('confere o PDF canônico e detecta um byte diferente', async () => {
    vi.stubGlobal('crypto', webcrypto);
    const bytes = new Uint8Array(readFileSync('../fixtures/documento-ficticio.pdf'));
    const fixture = JSON.parse(readFileSync('../fixtures/documento-ficticio.json', 'utf8'));
    expect(await sha256(bytes.buffer)).toBe(fixture.sha256);
    bytes[0] ^= 1;
    expect(await sha256(bytes.buffer)).not.toBe(fixture.sha256);
  });
  it('explica contexto inseguro em vez de inventar um hash', async () => {
    vi.stubGlobal('crypto', {});
    await expect(sha256(new ArrayBuffer(1))).rejects.toThrow('localhost ou HTTPS');
  });
  it('valida endereços com @solana/kit sem aceitar texto arbitrário', async () => {
    expect(await validatePublicAddress('11111111111111111111111111111111')).toBe('11111111111111111111111111111111');
    await expect(validatePublicAddress('endereço inválido')).rejects.toThrow();
  });
});

describe('Rede configurada no app', () => {
  it('confere genesis no RPC usando @solana/kit', async () => {
    vi.stubEnv('VITE_SOLANA_CLUSTER', 'devnet');
    const fetch = vi.fn(async (_input: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.method).toBe('getGenesisHash');
      return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id, result: DEVNET_GENESIS }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    vi.stubGlobal('fetch', fetch);
    await expect(checkDevnet(new AbortController().signal)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('recusa outro genesis, ainda que a variável diga devnet', async () => {
    vi.stubEnv('VITE_SOLANA_CLUSTER', 'devnet');
    vi.stubGlobal('fetch', vi.fn(async (_input: unknown, init?: RequestInit) => new Response(JSON.stringify({ jsonrpc: '2.0', id: JSON.parse(String(init?.body)).id, result: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    await expect(checkDevnet(new AbortController().signal)).rejects.toThrow();
  });
  it('recusa configuração mainnet antes de acessar a rede', async () => {
    vi.stubEnv('VITE_SOLANA_CLUSTER', 'mainnet');
    const network = vi.fn(); vi.stubGlobal('fetch', network);
    await expect(checkDevnet(new AbortController().signal)).rejects.toThrow('somente a rede Solana Devnet');
    expect(network).not.toHaveBeenCalled();
  });
});

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { webcrypto } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PreparationPanel } from './PreparationPanel';
import * as preparation from './preparation';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); delete (window as any).phantom; });
function phantom() {
  const handlers = new Map<string, Function>();
  const p = {
    isPhantom: true,
    connect: vi.fn().mockResolvedValue({ publicKey: { toString: () => '11111111111111111111111111111111' } }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    on: vi.fn((event, callback) => handlers.set(event, callback)),
    removeListener: vi.fn((event) => handlers.delete(event)),
  };
  (window as any).phantom = { solana: p };
  return { p, handlers };
}
describe('Preparação sem transações', () => {
  it('calcula arquivo local sem nenhuma requisição e limpa hash quando arquivo muda', async () => {
    vi.stubGlobal('crypto', webcrypto);
    const network = vi.fn(); vi.stubGlobal('fetch', network);
    const f = new File(['abc'], 'teste.pdf', { type: 'application/pdf' });
    Object.defineProperty(f, 'arrayBuffer', { value: async () => new TextEncoder().encode('abc').buffer });
    const { rerender } = render(<PreparationPanel file={f} />);
    await userEvent.click(screen.getByRole('button', { name: 'Calcular impressão digital' }));
    const digest = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    expect(await screen.findByText(digest)).toBeVisible();
    expect(network).not.toHaveBeenCalled();
    rerender(<PreparationPanel file={null} />);
    expect(screen.queryByText(digest)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Phantom/ })).not.toBeInTheDocument();
  });
  it('ignora conclusão antiga quando o arquivo muda durante leitura', async () => {
    vi.stubGlobal('crypto', webcrypto);
    let resolve!: (b: ArrayBuffer) => void;
    const f = new File(['a'], 'lento.pdf', { type: 'application/pdf' });
    Object.defineProperty(f, 'arrayBuffer', { value: () => new Promise<ArrayBuffer>(r => { resolve = r; }) });
    const { rerender } = render(<PreparationPanel file={f} />);
    await userEvent.click(screen.getByRole('button', { name: 'Calcular impressão digital' }));
    rerender(<PreparationPanel file={null} />);
    await act(async () => { resolve(new TextEncoder().encode('abc').buffer); await new Promise(r => setTimeout(r, 10)); });
    expect(screen.queryByText('SHA-256 calculado localmente')).not.toBeInTheDocument();
  });
  it('explica Phantom ausente', async () => {
    render(<PreparationPanel file={null} wallet />);
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Phantom não encontrada');
  });
  it('trata recusa sem acessar RPC nem mostrar carteira conectada', async () => {
    const { p } = phantom(); p.connect.mockRejectedValue({ code: 4001 });
    const check = vi.spyOn(preparation, 'checkDevnet').mockResolvedValue();
    render(<PreparationPanel file={null} wallet />);
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Conexão cancelada');
    expect(check).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('conecta somente após checar Devnet e invalida troca de conta', async () => {
    const { p, handlers } = phantom();
    vi.spyOn(preparation, 'checkDevnet').mockResolvedValue();
    render(<PreparationPanel file={null} wallet />);
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    expect(await screen.findByText('Carteira conectada · RPC Solana Devnet confirmado')).toBeVisible();
    act(() => handlers.get('accountChanged')?.({ toString: () => 'outro endereço' }));
    expect(screen.queryByText('Carteira conectada · RPC Solana Devnet confirmado')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('trocou de conta');
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    await screen.findByText('Carteira conectada · RPC Solana Devnet confirmado');
    await userEvent.click(screen.getByRole('button', { name: 'Desconectar Phantom' }));
    await waitFor(() => expect(p.disconnect).toHaveBeenCalledOnce());
  });
  it('não consulta RPC quando a conexão termina após sair do painel', async () => {
    const { p } = phantom();
    let finish!: (value: { publicKey: { toString(): string } }) => void;
    p.connect.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const check = vi.spyOn(preparation, 'checkDevnet').mockResolvedValue();
    const { unmount } = render(<PreparationPanel file={null} wallet />);
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    unmount();
    await act(async () => { finish({ publicKey: { toString: () => '11111111111111111111111111111111' } }); });
    expect(check).not.toHaveBeenCalled();
  });
  it('não anuncia sucesso quando rede é incompatível', async () => {
    phantom(); vi.spyOn(preparation, 'checkDevnet').mockRejectedValue(new Error('O servidor configurado não é da Solana Devnet.'));
    render(<PreparationPanel file={null} wallet />);
    await userEvent.click(screen.getByRole('button', { name: 'Conectar Phantom de teste' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('não é da Solana Devnet');
    expect(screen.queryByText('Carteira conectada · RPC Solana Devnet confirmado')).not.toBeInTheDocument();
  });
});

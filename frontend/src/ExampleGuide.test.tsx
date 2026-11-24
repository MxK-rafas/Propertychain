import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { ExampleGuide, EXAMPLE_SIGNATURE } from './ExampleGuide';
import { lookupMemo } from './memo';
import { PhantomHelp } from './NetworkHelp';
import sample from '../../fixtures/documento-ficticio.json';

vi.mock('./memo', () => ({ lookupMemo: vi.fn() }));
const pdf = new Uint8Array(readFileSync('../fixtures/documento-ficticio.pdf'));
const confirmed = { status: 'confirmed' as const, record: { signature: EXAMPLE_SIGNATURE, payer: '1'.repeat(32), hash: sample.sha256 }, elapsedMs: 700 };
let readPdf: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
  readPdf = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new Uint8Array(pdf).buffer });
  vi.stubGlobal('fetch', readPdf);
  vi.mocked(lookupMemo).mockResolvedValue(confirmed);
});
afterEach(() => vi.unstubAllGlobals());

describe('Aprender sem carteira com uma consulta real', () => {
  it('parte da entrada padrão, compara os bytes originais e alterados e consulta sem arquivo', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Experimentar com um exemplo' }));
    await screen.findByRole('heading', { name: 'Conheça o arquivo de exemplo.' });
    expect(screen.getByText(/PASSO 1 DE 4/)).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Verificar o exemplo' }));
    expect(await screen.findByRole('heading', { name: 'Mesmo arquivo' })).toBeVisible();
    expect(screen.getByText(/PASSO 2 DE 4/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ver comprovante público' })).toHaveAttribute('href', `https://explorer.solana.com/tx/${EXAMPLE_SIGNATURE}?cluster=devnet`);
    expect(screen.getByText(sample.sha256)).not.toBeVisible();
    await userEvent.click(screen.getByText('Ver detalhes do registro'));
    expect(screen.getByText(sample.sha256)).toBeVisible();
    expect(document.querySelectorAll('button.primary')).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: 'Testar uma cópia alterada' }));
    expect(await screen.findByRole('heading', { name: 'Arquivo diferente' })).toBeVisible();
    expect(screen.getByText(/PASSO 3 DE 4/)).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Consultar sem arquivo' }));
    expect(await screen.findByRole('heading', { name: 'Arquivo não comparado' })).toBeVisible();
    expect(screen.getByText(/PASSO 4 DE 4/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Baixar relatório em PDF' })).toBeVisible();
    expect(lookupMemo).toHaveBeenCalledTimes(3);
    expect(lookupMemo).toHaveBeenLastCalledWith(EXAMPLE_SIGNATURE, expect.any(AbortSignal));
    expect(readPdf).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /Conectar Phantom/ })).not.toBeInTheDocument();
    expect(sessionStorage.length).toBe(0);
    await userEvent.click(screen.getByRole('button', { name: 'Concluir exemplo' }));
    expect(await screen.findByRole('heading', { name: /O arquivo é o mesmo/ })).toBeVisible();
  });

  it.each(['missing', 'invalid'] as const)('não inventa resultado quando o registro está %s e permite tentar novamente', async status => {
    vi.mocked(lookupMemo).mockResolvedValueOnce({ status });
    render(<ExampleGuide />);
    await userEvent.click(screen.getByRole('button', { name: 'Verificar o exemplo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('O registro de exemplo não está disponível');
    expect(screen.queryByRole('link', { name: 'Ver comprovante público' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tentar esta etapa novamente' }));
    expect(await screen.findByRole('heading', { name: 'Mesmo arquivo' })).toBeVisible();
  });

  it('rejeita um hash de rede que não corresponde ao PDF preparado', async () => {
    vi.mocked(lookupMemo).mockResolvedValueOnce({ ...confirmed, record: { ...confirmed.record, hash: 'a'.repeat(64) } });
    render(<ExampleGuide />);
    await userEvent.click(screen.getByRole('button', { name: 'Verificar o exemplo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('não corresponde ao PDF');
    expect(screen.queryByRole('heading', { name: 'Mesmo arquivo' })).not.toBeInTheDocument();
  });

  it('recusa PDF de exemplo alterado antes de consultar a rede e relê no retry', async () => {
    readPdf.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new TextEncoder().encode('outro PDF').buffer });
    render(<ExampleGuide />);
    await userEvent.click(screen.getByRole('button', { name: 'Verificar o exemplo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('O PDF de exemplo não corresponde');
    expect(lookupMemo).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Tentar esta etapa novamente' }));
    expect(await screen.findByRole('heading', { name: 'Mesmo arquivo' })).toBeVisible();
    expect(readPdf).toHaveBeenCalledTimes(2);
  });

  it('explica indisponibilidade sem oferecer relatório ou avançar', async () => {
    vi.mocked(lookupMemo).mockRejectedValueOnce(new Error('RPC unavailable'));
    render(<ExampleGuide />);
    await userEvent.click(screen.getByRole('button', { name: 'Verificar o exemplo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Sua etapa não foi concluída');
    expect(screen.queryByRole('button', { name: 'Testar uma cópia alterada' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
  });

  it('evita consultas duplicadas e cancela a leitura ao sair', async () => {
    let resolve!: (value: typeof confirmed) => void;
    vi.mocked(lookupMemo).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const { unmount } = render(<ExampleGuide />);
    const button = screen.getByRole('button', { name: 'Verificar o exemplo' });
    fireEvent.click(button); fireEvent.click(button);
    await waitFor(() => expect(lookupMemo).toHaveBeenCalledOnce());
    const signal = vi.mocked(lookupMemo).mock.calls[0][1]!;
    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
    resolve(confirmed);
    expect(screen.queryByRole('heading', { name: 'Mesmo arquivo' })).not.toBeInTheDocument();
  });

  it('explica a carteira e oferece instalação oficial ou exemplo sem pedir segredos', async () => {
    render(<PhantomHelp />);
    expect(screen.getByText(/só envia o registro depois da sua aprovação/)).toBeVisible();
    expect(screen.getByText(/Para consultar ou experimentar, você não precisa de carteira/)).toBeVisible();
    await userEvent.click(screen.getByText('Ainda não tenho a Phantom'));
    expect(screen.getByRole('link', { name: 'site oficial da Phantom' })).toHaveAttribute('href', 'https://phantom.com/download');
    expect(screen.getByRole('link', { name: 'Prefiro experimentar sem carteira' })).toHaveAttribute('href', '#exemplo');
    expect(document.querySelectorAll('input, textarea')).toHaveLength(0);
  });
});

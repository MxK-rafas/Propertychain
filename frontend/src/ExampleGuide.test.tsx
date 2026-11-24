import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { ExampleGuide, EXAMPLE_SIGNATURE } from './ExampleGuide';
import { lookupMemo } from './memo';
import { PhantomHelp } from './NetworkHelp';
import { PENDING_KEY } from './memo-record';
import sample from '../../fixtures/documento-ficticio.json';

vi.mock('./memo', () => ({ lookupMemo: vi.fn() }));
const pdf = new Uint8Array(readFileSync('../fixtures/documento-ficticio.pdf'));
const confirmed = { status: 'confirmed' as const, record: { signature: EXAMPLE_SIGNATURE, payer: '1'.repeat(32), hash: sample.sha256 }, elapsedMs: 700 };
let readPdf: ReturnType<typeof vi.fn>;
let connect: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
  readPdf = vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new Uint8Array(pdf).buffer });
  vi.stubGlobal('fetch', readPdf);
  connect = vi.fn();
  Object.defineProperty(window, 'phantom', { configurable: true, value: { solana: { isPhantom: true, connect } } });
  vi.mocked(lookupMemo).mockResolvedValue(confirmed);
});
afterEach(() => { vi.unstubAllGlobals(); delete (window as { phantom?: unknown }).phantom; });
const click = async (name: string) => userEvent.click(await screen.findByRole('button', { name }));
async function prepare() {
  await click('Anexar documento fictício');
  await click('Calcular hash do documento');
  await click('Simular conexão com a Phantom');
}
async function toVerification() {
  await prepare();
  await click('Simular aprovação e publicação');
  await click('Ir para o cartório');
  await click('Simular análise do cartório');
  await click('Ir para verificação');
}

describe('Exemplo completo sem carteira pessoal', () => {
  it('ensina cadastro, cartório, consulta e resultado com três comparações reais e relatório só no final', async () => {
    render(<App />);
    await click('Experimentar com um exemplo');
    await screen.findByRole('heading', { name: 'Cadastro de exemplo.' });
    expect(screen.getByText('Documento que será anexado')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Para que serve a Phantom?' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Por que usar blockchain?' })).toBeVisible();
    expect(readPdf).not.toHaveBeenCalled();
    await click('Anexar documento fictício');
    expect(screen.getByText('Documento fictício anexado')).toBeVisible();
    expect(screen.queryByText(sample.sha256)).not.toBeInTheDocument();
    await click('Calcular hash do documento');
    expect(screen.getByText(sample.sha256)).toBeVisible();
    expect(lookupMemo).not.toHaveBeenCalled();
    await click('Simular conexão com a Phantom');
    expect(screen.getByText('Carteira de exemplo conectada — simulação')).toBeVisible();
    expect(connect).not.toHaveBeenCalled();
    await click('Simular aprovação e publicação');
    await screen.findByRole('button', { name: 'Ir para o cartório' });
    expect(screen.getByRole('link', { name: 'Ver registro de exemplo na Solana Devnet' })).toHaveAttribute('href', `https://explorer.solana.com/tx/${EXAMPLE_SIGNATURE}?cluster=devnet`);
    expect(screen.getByText(/A publicação deste percurso foi simulada/)).toBeVisible();
    await click('Ir para o cartório');
    expect(screen.getByText('ETAPA 2 DE 4 · EXEMPLO GUIADO')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Ir para verificação' })).not.toBeInTheDocument();
    await click('Simular análise do cartório');
    expect(screen.getByRole('heading', { name: 'Documento fictício validado — simulação' })).toBeVisible();
    expect(screen.getByText(/Nenhum cartório real recebeu ou analisou/)).toBeVisible();
    expect(lookupMemo).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
    await click('Ir para verificação');
    for (const [choice, outcome] of [
      ['Com o mesmo arquivo', 'Mesmo arquivo'],
      ['Com um arquivo diferente', 'Arquivo diferente'],
      ['Sem arquivo', 'Arquivo não comparado'],
    ]) {
      expect(screen.getByText('ETAPA 3 DE 4 · EXEMPLO GUIADO')).toBeVisible();
      await userEvent.click(screen.getByRole('radio', { name: new RegExp(`^${choice}`) }));
      await click('Verificar documento');
      expect(await screen.findByRole('heading', { name: outcome })).toBeVisible();
      expect(screen.getByText('ETAPA 4 DE 4 · EXEMPLO GUIADO')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Baixar relatório em PDF' })).toBeVisible();
      expect(screen.getByText(sample.sha256)).not.toBeVisible();
      expect(document.querySelectorAll('button.primary')).toHaveLength(1);
      await click('Testar outro caso');
      expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
    }
    expect(lookupMemo).toHaveBeenCalledTimes(4);
    expect(readPdf).toHaveBeenCalledOnce();
    expect(connect).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it.each(['missing', 'invalid'] as const)('não finge publicação quando o registro está %s e permite retry', async status => {
    vi.mocked(lookupMemo).mockResolvedValueOnce({ status });
    render(<ExampleGuide />); await prepare();
    await click('Simular aprovação e publicação');
    expect(await screen.findByRole('alert')).toHaveTextContent('O registro de exemplo não está disponível');
    expect(screen.queryByRole('button', { name: 'Ir para o cartório' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
    await click('Tentar novamente');
    expect(await screen.findByRole('button', { name: 'Ir para o cartório' })).toBeEnabled();
  });

  it('rejeita um registro existente com hash diferente do PDF', async () => {
    vi.mocked(lookupMemo).mockResolvedValueOnce({ ...confirmed, record: { ...confirmed.record, hash: 'a'.repeat(64) } });
    render(<ExampleGuide />); await prepare();
    await click('Simular aprovação e publicação');
    expect(await screen.findByRole('alert')).toHaveTextContent('não corresponde ao PDF');
    expect(screen.queryByRole('button', { name: 'Ir para o cartório' })).not.toBeInTheDocument();
  });

  it('recusa fixture alterada no cálculo e permite anexar a cópia correta', async () => {
    readPdf.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new TextEncoder().encode('outro PDF').buffer });
    render(<ExampleGuide />);
    await click('Anexar documento fictício'); await click('Calcular hash do documento');
    expect(await screen.findByRole('alert')).toHaveTextContent('O PDF de exemplo não corresponde');
    expect(lookupMemo).not.toHaveBeenCalled();
    await click('Tentar novamente'); await click('Calcular hash do documento');
    expect(screen.getByText(sample.sha256)).toBeVisible();
    expect(readPdf).toHaveBeenCalledTimes(2);
  });

  it('não reutiliza confirmação anterior para fingir consulta quando a rede falha', async () => {
    render(<ExampleGuide />); await toVerification();
    vi.mocked(lookupMemo).mockRejectedValueOnce(new Error('RPC unavailable'));
    await click('Verificar documento');
    expect(await screen.findByRole('alert')).toHaveTextContent('Não conseguimos concluir esta etapa');
    expect(screen.getByText('ETAPA 3 DE 4 · EXEMPLO GUIADO')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Baixar relatório em PDF' })).not.toBeInTheDocument();
    await click('Tentar novamente');
    expect(await screen.findByRole('heading', { name: 'Mesmo arquivo' })).toBeVisible();
  });

  it('bloqueia clique duplicado e cancela leitura sem alterar comprovante real pendente', async () => {
    const pending = JSON.stringify({ signature: '1'.repeat(64), payer: '1'.repeat(32), hash: 'a'.repeat(64) });
    sessionStorage.setItem(PENDING_KEY, pending);
    let resolve!: (value: typeof confirmed) => void;
    vi.mocked(lookupMemo).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const { unmount } = render(<ExampleGuide />); await prepare();
    const button = screen.getByRole('button', { name: 'Simular aprovação e publicação' });
    fireEvent.click(button); fireEvent.click(button);
    await waitFor(() => expect(lookupMemo).toHaveBeenCalledOnce());
    const signal = vi.mocked(lookupMemo).mock.calls[0][1]!;
    unmount(); expect(signal.aborted).toBe(true); resolve(confirmed);
    expect(sessionStorage.getItem(PENDING_KEY)).toBe(pending);
  });

  it('volta entre etapas e recomeça limpando hash, carteira fictícia e validação', async () => {
    render(<ExampleGuide />); await toVerification();
    await click('Voltar à etapa anterior');
    expect(screen.getByText('ETAPA 2 DE 4 · EXEMPLO GUIADO')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Documento fictício validado — simulação' })).toBeVisible();
    await click('Recomeçar exemplo');
    expect(screen.getByText('Documento que será anexado')).toBeVisible();
    expect(screen.queryByText(sample.sha256)).not.toBeInTheDocument();
    expect(screen.queryByText('Carteira de exemplo conectada — simulação')).not.toBeInTheDocument();
  });

  it('mantém orientação oficial no cadastro real sem pedir segredos', async () => {
    render(<PhantomHelp />);
    expect(screen.getByText(/só envia o registro depois da sua aprovação/)).toBeVisible();
    await userEvent.click(screen.getByText('Ainda não tenho a Phantom'));
    expect(screen.getByRole('link', { name: 'site oficial da Phantom' })).toHaveAttribute('href', 'https://phantom.com/download');
    expect(document.querySelectorAll('input, textarea')).toHaveLength(0);
  });
});

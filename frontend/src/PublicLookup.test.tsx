import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { App } from './App';
import { lookupMemo } from './memo';
import { lookupFragment } from './PublicLookup';

vi.mock('./memo', () => ({ lookupMemo: vi.fn() }));

const tx = '2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G';
const record = {
  signature: tx,
  payer: '8UNXCHsZMAeq6NALJKax7tTHmX6V3b5d4gbJ3s46xZPE',
  hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
};

afterEach(() => vi.unstubAllGlobals());

function openLink(signature = tx) {
  window.history.replaceState(null, '', '/?origem=teste' + lookupFragment(signature));
  render(<App />);
}

describe('Consulta pública aberta por assinatura, sem carteira', () => {
  it.each([
    [null, /Arquivo não comparado/],
    ['abc', /impressão digital do arquivo coincide/],
    ['abd', /impressão digital do arquivo é diferente/],
  ])('consulta com arquivo %s', async (content, outcome) => {
    vi.stubGlobal('crypto', webcrypto);
    vi.mocked(lookupMemo).mockResolvedValue({ status: 'confirmed', record, elapsedMs: 750 });
    openLink();
    if (content !== null) {
      const file = new File([content], 'arquivo-local.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'arrayBuffer', { value: async () => new TextEncoder().encode(content).buffer });
      await userEvent.upload(screen.getByLabelText(/Escolher arquivo para comparar/), file);
    }
    expect(screen.queryByText(/Conectar Phantom/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Verificar documento' }));
    expect(await screen.findByText(outcome)).toBeVisible();
    expect(screen.getByText(record.hash)).toBeVisible();
    expect(screen.getByText('Tipo de documento')).toBeVisible();
    expect(screen.getByText('Não identificado pelo app.')).toBeVisible();
    expect(screen.getByText('Validado por')).toBeVisible();
    expect(screen.getByText(/Nenhum cartório analisou/)).toBeVisible();
    expect(screen.getByText(/não comprova a autenticidade/)).toBeVisible();
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(window.location.hash).toBe(lookupFragment(tx, 'resultado'));
    expect(screen.getByText('ETAPA 4 DE 4')).toBeVisible();
    expect(screen.getByRole('link', { name: /Resultado da verificação/ })).toHaveAttribute('aria-current', 'step');
    expect(lookupMemo).toHaveBeenCalledExactlyOnceWith(tx, expect.any(AbortSignal));

    await userEvent.click(screen.getByRole('button', { name: 'Fazer nova consulta' }));
    expect(await screen.findByRole('heading', { name: 'Verificar documento' })).toBeVisible();
    expect(window.location.hash).toBe(lookupFragment(tx));
    expect(screen.getByText('ETAPA 3 DE 4')).toBeVisible();
    expect(screen.getByLabelText(/Escolher arquivo para comparar/)).toHaveValue('');
  });

  it.each([true, false])('oferece o link da consulta com clipboard disponível: %s', async clipboardAvailable => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    if (!clipboardAvailable) writeText.mockRejectedValueOnce(new Error('clipboard indisponível'));
    vi.mocked(lookupMemo).mockResolvedValue({ status: 'confirmed', record, elapsedMs: 750 });
    openLink();
    const url = window.location.origin + '/' + lookupFragment(tx);

    await user.click(screen.getByRole('button', { name: 'Verificar documento' }));
    await user.click(await screen.findByRole('button', { name: 'Copiar link da consulta' }));
    expect(writeText).toHaveBeenCalledWith(url);
    if (clipboardAvailable) {
      expect(await screen.findByText('Link copiado.')).toBeVisible();
    } else {
      expect(await screen.findByLabelText('Copie o endereço abaixo')).toHaveValue(url);
    }
    writeText.mockRestore();
  });

  it('reabre na consulta se o resultado ainda não existir nesta aba', async () => {
    window.history.replaceState(null, '', '/' + lookupFragment(tx, 'resultado'));
    render(<App />);
    await screen.findByRole('heading', { name: 'Verificar documento' });
    await vi.waitFor(() => expect(window.location.hash).toBe(lookupFragment(tx)));
    expect(lookupMemo).not.toHaveBeenCalled();
  });

  it('mantém resultado e assinatura ao voltar pelas etapas, sem consultar de novo', async () => {
    vi.mocked(lookupMemo).mockResolvedValue({ status: 'confirmed', record, elapsedMs: 750 });
    openLink();
    await userEvent.click(screen.getByRole('button', { name: 'Verificar documento' }));
    await screen.findByRole('heading', { name: 'Resultado da verificação' });
    await userEvent.click(screen.getByRole('button', { name: 'Voltar à tela anterior' }));
    expect(await screen.findByRole('heading', { name: 'Verificar documento' })).toBeVisible();
    expect(window.location.hash).toBe(lookupFragment(tx));
    await userEvent.click(screen.getByRole('link', { name: /Resultado da verificação/ }));
    expect(await screen.findByRole('heading', { name: 'Resultado da verificação' })).toBeVisible();
    expect(screen.getByText(record.hash)).toBeVisible();
    expect(lookupMemo).toHaveBeenCalledOnce();
  });

  it('não apresenta resultado anterior como comparação de outro arquivo', async () => {
    vi.mocked(lookupMemo).mockResolvedValue({ status: 'confirmed', record, elapsedMs: 750 });
    openLink();
    await userEvent.click(screen.getByRole('button', { name: 'Verificar documento' }));
    await screen.findByRole('heading', { name: 'Resultado da verificação' });
    await userEvent.click(screen.getByRole('button', { name: 'Voltar à tela anterior' }));
    await userEvent.upload(await screen.findByLabelText(/Escolher arquivo para comparar/), new File(['novo'], 'novo.pdf', { type: 'application/pdf' }));
    await userEvent.click(screen.getByRole('link', { name: /Resultado da verificação/ }));
    await vi.waitFor(() => expect(window.location.hash).toBe(lookupFragment(tx)));
    expect(screen.queryByRole('heading', { name: 'Resultado da verificação' })).not.toBeInTheDocument();
    expect(lookupMemo).toHaveBeenCalledOnce();
  });

  it.each([
    ['missing', /Nenhuma transação confirmada/],
    ['invalid', /não contém um registro PropertyChain válido/],
    ['invalid-signature', /assinatura de transação inválida/],
  ] as const)('exibe erro conclusivo para %s', async (status, message) => {
    vi.mocked(lookupMemo).mockResolvedValue({ status });
    openLink();
    await userEvent.click(screen.getByRole('button', { name: 'Verificar documento' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.queryByRole('heading', { name: 'Resultado da verificação' })).not.toBeInTheDocument();
  });
});

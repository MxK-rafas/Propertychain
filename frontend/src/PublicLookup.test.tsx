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
    expect(screen.getByRole('link', { name: 'Link desta consulta' }).getAttribute('href'))
      .toBe(window.location.origin + '/' + lookupFragment(tx));
    expect(lookupMemo).toHaveBeenCalledExactlyOnceWith(tx, expect.any(AbortSignal));

    await userEvent.click(screen.getByRole('button', { name: 'Fazer nova consulta' }));
    expect(screen.getByRole('heading', { name: 'Verificar documento' })).toBeVisible();
    expect(screen.getByLabelText(/Escolher arquivo para comparar/)).toHaveValue('');
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

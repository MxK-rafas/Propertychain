import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReportDownload } from './ReportDownload';
import type { VerificationResult } from './verification-result';
import { createVerificationReport } from './verification-report';

vi.mock('./verification-report', () => ({ createVerificationReport: vi.fn() }));
const result: VerificationResult = {
  status: 'confirmed', comparison: 'none', checkedAt: '2026-11-23T15:00:00Z', elapsedMs: 500,
  record: { hash: 'a'.repeat(64), payer: '1'.repeat(32), signature: '1'.repeat(64) },
};
const createUrl = vi.fn((_blob: Blob) => 'blob:http://localhost/relatorio');
const revokeUrl = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createVerificationReport).mockResolvedValue(new Uint8Array([37, 80, 68, 70]));
  const RealURL = URL;
  vi.stubGlobal('URL', class extends RealURL { static createObjectURL = createUrl; static revokeObjectURL = revokeUrl; });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Download local do relatório', () => {
  it('gera PDF sob demanda, oferece download e abertura e libera o URL ao sair', async () => {
    const { unmount } = render(<ReportDownload result={result} />);
    expect(createVerificationReport).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Baixar relatório em PDF' }));
    expect(await screen.findByRole('link', { name: 'Abrir PDF' })).toHaveAttribute('href', 'blob:http://localhost/relatorio');
    expect(screen.getByRole('link', { name: 'Baixar PDF novamente' })).toHaveAttribute('download', 'propertychain-relatorio-devnet.pdf');
    expect(screen.getByRole('status')).toHaveTextContent('Se não baixou');
    expect(createVerificationReport).toHaveBeenCalledExactlyOnceWith(result);
    expect(createUrl.mock.calls[0][0]).toHaveProperty('type', 'application/pdf');
    unmount();
    expect(revokeUrl).toHaveBeenCalledWith('blob:http://localhost/relatorio');
  });

  it('explica falha de geração sem apagar a consulta e permite tentar de novo', async () => {
    vi.mocked(createVerificationReport).mockRejectedValueOnce(new Error('falha local'));
    render(<ReportDownload result={result} />);
    await userEvent.click(screen.getByRole('button', { name: 'Baixar relatório em PDF' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('O resultado da consulta continua disponível');
    expect(createUrl).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Baixar relatório em PDF' }));
    expect(await screen.findByRole('link', { name: 'Abrir PDF' })).toBeVisible();
  });

  it('não duplica geração nem mantém PDF de uma consulta abandonada', async () => {
    let finish!: (bytes: Uint8Array) => void;
    vi.mocked(createVerificationReport).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const { unmount } = render(<ReportDownload result={result} />);
    await userEvent.dblClick(screen.getByRole('button', { name: 'Baixar relatório em PDF' }));
    await waitFor(() => expect(createVerificationReport).toHaveBeenCalledOnce());
    unmount();
    await act(async () => finish(new Uint8Array([37, 80, 68, 70])));
    expect(createUrl).not.toHaveBeenCalled();
  });
});

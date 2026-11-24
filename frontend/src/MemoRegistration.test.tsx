import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoRegistration } from './MemoRegistration';
import { readPending, savePending } from './memo-record';
import type { MemoRecord } from './memo-record';
import type { MemoDraft } from './memo';
import { MemoStageError } from './memo-errors';
const service = vi.hoisted(() => ({ prepareMemo: vi.fn(), signAndSubmit: vi.fn(), confirmMemo: vi.fn() }));
vi.mock('./memo', () => service);
const record: MemoRecord = { hash: 'a'.repeat(64), payer: '1'.repeat(32), signature: '1'.repeat(64) };
const draft = { hash: record.hash, payer: record.payer, fee: 5000n, lastValidBlockHeight: 100n } as MemoDraft;
beforeEach(() => {
  vi.resetAllMocks();
  service.prepareMemo.mockResolvedValue(draft);
  service.signAndSubmit.mockImplementation(async (_draft, _signal, _current, onSignature) => { savePending(record); onSignature(record); return record; });
  service.confirmMemo.mockResolvedValue('pending');
});
async function prepare() {
  await userEvent.click(screen.getByRole('button', { name: 'Revisar registro' }));
  await screen.findByRole('button', { name: 'Aprovar registro na Phantom' });
}
describe('Interface de registro e recuperação', () => {
  it('mostra a causa quando a carteira altera a transação e não avança', async () => {
    service.signAndSubmit.mockRejectedValue(new Error('A carteira alterou o conteúdo da transação. Nenhum envio foi realizado.'));
    const completed = vi.fn();
    render(<MemoRegistration hash={record.hash} account={record.payer} onRegistered={completed} />);
    await prepare();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('A carteira alterou');
    expect(service.confirmMemo).not.toHaveBeenCalled();
    expect(completed).not.toHaveBeenCalled();
  });
  it('mostra diagnóstico seguro após aprovação sem expor resposta interna', async () => {
    service.signAndSubmit.mockRejectedValue(new MemoStageError('PC_LIFETIME', 'A assinatura foi recebida, mas não foi possível consultar a Devnet. Nenhum envio foi realizado.', new Error('payload interno que não deve aparecer')));
    render(<MemoRegistration hash={record.hash} account={record.payer} />);
    await prepare();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('PC_LIFETIME');
    expect(screen.getByRole('alert')).not.toHaveTextContent('payload interno');
  });
  it('falha de consulta preserva link e permite apenas reconferir sem outra assinatura', async () => {
    service.confirmMemo.mockRejectedValue(new Error('RPC indisponível'));
    const completed = vi.fn();
    render(<MemoRegistration hash={record.hash} account={record.payer} onRegistered={completed} />);
    await prepare();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('PC_CONFIRM');
    expect(screen.getByRole('link', { name: /Acompanhar transação/ })).toBeVisible();
    expect(readPending()).toEqual(record);
    await userEvent.click(screen.getByRole('button', { name: 'Conferir registro existente' }));
    await waitFor(() => expect(service.confirmMemo).toHaveBeenCalledTimes(2));
    expect(service.signAndSubmit).toHaveBeenCalledOnce();
    expect(completed).not.toHaveBeenCalled();
  });
  it('exige hash e carteira antes de preparar', () => {
    render(<MemoRegistration hash="" account="" />);
    expect(screen.getByRole('button', { name: 'Revisar registro' })).toBeDisabled();
  });
  it('mostra revisão sem assinatura e link antes de concluir', async () => {
    let finish!: (value: string) => void;
    service.confirmMemo.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const completed = vi.fn();
    render(<MemoRegistration hash={record.hash} account={record.payer} onRegistered={completed} />);
    await prepare();
    expect(screen.getByText('0.000005000 SOL de teste')).toBeVisible();
    expect(service.signAndSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    const link = await screen.findByRole('link', { name: /Acompanhar transação/ });
    expect(link).toHaveAttribute('href', `https://explorer.solana.com/tx/${record.signature}?cluster=devnet`);
    expect(completed).not.toHaveBeenCalled();
    await act(async () => finish('confirmed'));
    await waitFor(() => expect(completed).toHaveBeenCalledWith(record));
    expect(readPending()).toBeNull();
  });
  it('reconfere resultado incerto sem assinar ou enviar de novo', async () => {
    render(<MemoRegistration hash={record.hash} account={record.payer} />);
    await prepare();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    await screen.findByRole('button', { name: 'Conferir registro existente' });
    expect(readPending()).toEqual(record);
    await userEvent.click(screen.getByRole('button', { name: 'Conferir registro existente' }));
    await waitFor(() => expect(service.confirmMemo).toHaveBeenCalledTimes(2));
    expect(service.signAndSubmit).toHaveBeenCalledOnce();
    expect(service.prepareMemo).toHaveBeenCalledOnce();
  });
  it('retoma recibo ao reabrir sem pedir carteira nem preparar outro', async () => {
    savePending(record);
    render(<MemoRegistration hash="" account="" />);
    expect(screen.getByRole('link', { name: /Acompanhar transação/ })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Conferir registro existente' }));
    await waitFor(() => expect(service.confirmMemo).toHaveBeenCalledOnce());
    expect(service.prepareMemo).not.toHaveBeenCalled();
    expect(service.signAndSubmit).not.toHaveBeenCalled();
  });
  it('cancelamento não avança nem anuncia cadastro concluído', async () => {
    service.signAndSubmit.mockRejectedValue({ code: 4001 });
    const completed = vi.fn();
    render(<MemoRegistration hash={record.hash} account={record.payer} onRegistered={completed} />);
    await prepare();
    await userEvent.click(screen.getByRole('button', { name: 'Aprovar registro na Phantom' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Assinatura cancelada');
    expect(completed).not.toHaveBeenCalled();
    expect(service.confirmMemo).not.toHaveBeenCalled();
  });
  it('não duplica preparação enquanto aguarda RPC e invalida mudança de arquivo', async () => {
    let resolve!: (value: MemoDraft) => void;
    service.prepareMemo.mockImplementation(() => new Promise(r => { resolve = r; }));
    const { rerender } = render(<MemoRegistration hash={record.hash} account={record.payer} />);
    await userEvent.dblClick(screen.getByRole('button', { name: 'Revisar registro' }));
    expect(service.prepareMemo).toHaveBeenCalledOnce();
    rerender(<MemoRegistration hash="" account={record.payer} />);
    await act(async () => resolve(draft));
    expect(screen.queryByRole('button', { name: 'Aprovar registro na Phantom' })).not.toBeInTheDocument();
  });
});

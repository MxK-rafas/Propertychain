import { useEffect, useRef, useState } from 'react';
import type { MemoDraft } from './memo';
import { clearPending, explorerUrl, formatTestSol, readPending } from './memo-record';
import type { MemoRecord } from './memo-record';

export function MemoRegistration({ hash, account, onRegistered, onBusy, onPendingHash }: {
  hash: string; account: string; onRegistered?: (record: MemoRecord) => void;
  onBusy?: (value: boolean) => void; onPendingHash?: (hash: string | null) => void;
}) {
  const [draft, setDraft] = useState<MemoDraft | null>(null);
  const [pending, setPending] = useState(readPending);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('');
  const [error, setError] = useState('');
  const running = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const current = useRef({ hash, account }); current.current = { hash, account };
  useEffect(() => { setDraft(null); setError(''); }, [hash, account]);
  useEffect(() => { onBusy?.(busy); return () => onBusy?.(false); }, [busy, onBusy]);
  useEffect(() => { onPendingHash?.(pending?.hash || null); }, [pending, onPendingHash]);
  useEffect(() => () => controller.current?.abort(), []);
  async function run() {
    if (running.current) return;
    running.current = true; setBusy(true); setError('');
    const abort = new AbortController(); controller.current = abort;
    try {
      const service = await import('./memo');
      if (!pending && !draft) {
        setPhase('Conferindo rede, saldo, taxa e simulação…');
        const prepared = await service.prepareMemo(hash, account, abort.signal);
        if (current.current.hash !== hash || current.current.account !== account) return;
        setDraft(prepared); setPhase('Preparado. Confira o resumo antes de aprovar na Phantom.');
        return;
      }
      let record = pending;
      if (!record && draft) {
        setPhase('Aguardando sua aprovação na Phantom…');
        record = await service.signAndSubmit(draft, abort.signal, () => current.current.hash === draft.hash && current.current.account === draft.payer, value => { setPending(value); setDraft(null); });
      }
      if (!record) return;
      setPhase('Aguardando confirmação do registro na Devnet…');
      const status = await service.confirmMemo(record, abort.signal);
      abort.signal.throwIfAborted();
      if (status === 'confirmed') {
        clearPending(); setPending(null); setPhase('Registro confirmado: hash e transação conferidos na Devnet.');
        onRegistered?.(record);
      } else if (status === 'failed') {
        clearPending(); setPending(null); setDraft(null);
        setPhase('A rede confirmou que a transação falhou. O documento não foi registrado.');
      } else setPhase('O resultado ainda está pendente. Confira o link e consulte novamente. Não envie outro registro.');
    } catch (e) {
      if (abort.signal.aborted) return;
      const rejected = (e as { code?: number })?.code === 4001;
      const known = e instanceof Error && /^(Calcule|Configure|Use um|O servidor|A preparação|Saldo insuficiente|A simulação|A Phantom|A assinatura|A conta|Resposta inesperada|A transação encontrada|Comprovante)/.test(e.message);
      setError(rejected ? 'Assinatura cancelada na Phantom. Nenhum envio foi realizado.' : known ? (e as Error).message : 'Não foi possível concluir esta operação. Se houver um link de transação, consulte o registro existente antes de tentar outro envio.');
      setPhase(''); setDraft(null);
    } finally { running.current = false; setBusy(false); }
  }
  return <section className="registration" aria-label="Registro na Solana Devnet">
    <h3>Registrar na rede de testes</h3>
    <p>A preparação envia apenas o hash ao RPC para simular. A publicação na blockchain depende da sua aprovação na Phantom.</p>
    <p>Somente a impressão digital será publicada. O arquivo fica neste dispositivo. Não há transferência de SOL para terceiros; a carteira paga apenas a taxa da rede Devnet.</p>
    {!hash && !pending && <p>Calcule a impressão digital do arquivo para preparar o registro.</p>}
    {!account && !pending && <p>Conecte a Phantom de teste antes de preparar.</p>}
    {draft && <dl className="facts"><div><dt>Rede</dt><dd>Solana Devnet</dd></div><div><dt>Operação</dt><dd>Um Memo com o hash; nenhuma transferência para terceiros.</dd></div><div><dt>Carteira que paga a taxa</dt><dd className="digest">{draft.payer}</dd></div><div><dt>Hash a registrar</dt><dd className="digest">{draft.hash}</dd></div><div><dt>Taxa estimada</dt><dd>{formatTestSol(draft.fee)}</dd></div></dl>}
    {pending && <><p>Comprovante público da tentativa. O resultado pode estar pendente; este link não significa sucesso.</p><a className="text-link" href={explorerUrl(pending.signature)} target="_blank" rel="noreferrer">Acompanhar transação no explorador Devnet</a><output className="digest">{pending.signature}</output><span className="field-label">Hash desta tentativa</span><output className="digest">{pending.hash}</output></>}
    <p role="status">{phase}</p>
    {error && <p role="alert" className="error-message">{error}</p>}
    <button className="primary" disabled={busy || (!pending && (!hash || !account))} onClick={run}>{busy ? 'Aguarde…' : pending ? 'Conferir registro existente' : draft ? 'Aprovar registro na Phantom' : 'Preparar registro na Devnet'}</button>
    {draft && !busy && <button className="text-button" onClick={() => { setDraft(null); setPhase('Preparação cancelada. Nenhuma assinatura solicitada.'); }}>Cancelar preparação</button>}
  </section>;
}

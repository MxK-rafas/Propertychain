import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { sha256 } from './preparation';
import { lookupFragment, transactionFromReference } from './consultation-link';
import { VerificationOutcome } from './VerificationOutcome';
import { NetworkHelp } from './NetworkHelp';
import type { VerificationResult } from './verification-result';

export { lookupFragment } from './consultation-link';

export function PublicLookup({ signature, showResult }: { signature: string; showResult: boolean }) {
  const [reference, setReference] = useState(signature);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const previousSignature = useRef(signature);
  const resultForRoute = result?.record.signature === signature ? result : null;

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setReference(signature);
    if (result?.record.signature === signature) return;
    active.current?.abort(); active.current = null;
    setBusy(false); setFile(null); setResult(null); setError('');
    if (fileInput.current) fileInput.current.value = '';
  }, [signature, result]);
  useEffect(() => {
    if (showResult && !resultForRoute) window.location.replace(signature ? lookupFragment(signature) : '#consulta');
  }, [resultForRoute, showResult, signature]);
  useEffect(() => { heading.current?.focus(); }, [showResult]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    setError('');
    const selectedSignature = transactionFromReference(reference);
    if (!selectedSignature) {
      setError('Cole o link completo que você recebeu, ou um código de transação válido. O código do arquivo não é um link de registro.');
      return;
    }
    const request = new AbortController();
    active.current = request;
    setBusy(true);
    let failure = 'Não foi possível consultar a Devnet. Tente novamente.';
    try {
      const { lookupMemo } = await import('./memo');
      request.signal.throwIfAborted();
      const found = await lookupMemo(selectedSignature, request.signal);
      request.signal.throwIfAborted();
      if (found.status !== 'confirmed') {
        setError({
          missing: 'Nenhuma transação confirmada foi encontrada na Devnet para este link.',
          invalid: 'A transação tem erro ou não contém um registro PropertyChain válido.',
          'invalid-signature': 'O link tem uma assinatura de transação inválida.',
        }[found.status]);
        return;
      }
      failure = 'Não foi possível ler o arquivo neste aparelho. Selecione o arquivo novamente ou faça a consulta sem ele.';
      const hash = file ? await sha256(await file.arrayBuffer()) : null;
      if (request.signal.aborted) return;

      setResult({ ...found, comparison: hash === null ? 'none' : hash === found.record.hash ? 'match' : 'different', checkedAt: new Date().toISOString() });
      window.location.hash = lookupFragment(selectedSignature, 'resultado');
    } catch {
      if (!request.signal.aborted) setError(failure);
    } finally {
      if (active.current === request) {
        active.current = null;
        if (!request.signal.aborted) setBusy(false);
      }
    }
  }

  return <section className="screen-enter public-lookup-content" aria-label="Consulta pública PropertyChain">
          <h1 className="screen-title" ref={heading} tabIndex={-1}>{showResult && resultForRoute ? 'Resultado da verificação' : 'Verificar documento'}</h1>
          {showResult && resultForRoute ? <VerificationOutcome result={resultForRoute} actionLabel="Fazer nova consulta" onAction={() => {
            setFile(null); setResult(null); window.location.hash = lookupFragment(signature);
          }} /> : <form onSubmit={verify}>
            <p className="screen-description">Cole o link de um registro e escolha sua cópia, se quiser comparar. Você não precisa de carteira para consultar.</p>
            <div className="reference-controls">
              <label htmlFor="lookup-reference">Cole o link do registro</label>
              <textarea id="lookup-reference" className="reference-input" rows={3} value={reference} disabled={busy} spellCheck={false} autoCapitalize="none" autoCorrect="off" aria-describedby="reference-help" onChange={event => {
                setReference(event.target.value); setResult(null); setError('');
              }} />
              <p id="reference-help" className="file-help">Use o link enviado por quem registrou o arquivo. Você também pode informar o código da transação.</p>
            </div>
            <div className="file-controls">
              <label className="file-label" htmlFor="lookup-file">Escolher arquivo para comparar (opcional)</label>
              <input id="lookup-file" ref={fileInput} className="file-input" type="file" disabled={busy} onChange={event => {
                setFile(event.target.files?.[0] ?? null);
                setResult(null);
                setError('');
              }} />
              {file && <button className="text-button" type="button" disabled={busy} onClick={() => {
                setFile(null);
                setResult(null);
                if (fileInput.current) fileInput.current.value = '';
              }}>Remover arquivo</button>}
              <span className="file-help">O arquivo fica neste aparelho.</span>
            </div>
            <NetworkHelp />
            {error && <p className="error-message" role="alert">{error}</p>}
            <button className="primary" disabled={busy}>{busy ? 'Consultando…' : 'Verificar documento'}</button>
          </form>}
  </section>;
}

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { explorerUrl } from './memo-record';
import { sha256 } from './preparation';
import { lookupFragment, publicLookupUrl, transactionFromReference } from './consultation-link';
import { ReportDownload } from './ReportDownload';
import { comparisonText } from './verification-result';
import type { VerificationResult } from './verification-result';

export { lookupFragment } from './consultation-link';

export function PublicLookup({ signature, showResult }: { signature: string; showResult: boolean }) {
  const [reference, setReference] = useState(signature);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const active = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const previousSignature = useRef(signature);
  const shareLink = publicLookupUrl(result?.record.signature ?? signature);
  const resultForRoute = result?.record.signature === signature ? result : null;

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setReference(signature);
    if (result?.record.signature === signature) return;
    active.current?.abort(); active.current = null;
    setBusy(false); setFile(null); setResult(null); setError(''); setCopyStatus('idle');
    if (fileInput.current) fileInput.current.value = '';
  }, [signature, result]);
  useEffect(() => {
    if (showResult && !resultForRoute) window.location.replace(signature ? lookupFragment(signature) : '#consulta');
  }, [resultForRoute, showResult, signature]);
  useEffect(() => { heading.current?.focus(); }, [showResult]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('manual');
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    setError('');
    const selectedSignature = transactionFromReference(reference);
    if (!selectedSignature) {
      setError('Cole o link completo do registro ou um código de transação válido da Devnet. Não use o hash SHA-256 do arquivo.');
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
      setCopyStatus('idle');
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
          {showResult && resultForRoute ? <>
            <p role="status">Registro confirmado na Devnet.</p>
            <dl className="facts">
              <div><dt>Comparação do arquivo</dt><dd>{comparisonText[resultForRoute.comparison]}</dd></div>
              <div><dt>SHA-256 registrado</dt><dd className="digest">{resultForRoute.record.hash}</dd></div>
              <div><dt>Tempo de consulta à Devnet</dt><dd>{(resultForRoute.elapsedMs / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s</dd></div>
            </dl>
            <p><a className="text-link" href={explorerUrl(signature)} target="_blank" rel="noreferrer">Ver transação no explorador Devnet</a></p>
            <button className="text-button" onClick={copyLink}>Copiar link da consulta</button>
            {copyStatus === 'copied' && <p role="status">Link copiado.</p>}
            {copyStatus === 'manual' && <div className="file-controls">
              <label htmlFor="consultation-link">Copie o endereço abaixo</label>
              <textarea id="consultation-link" className="reference-input" readOnly value={shareLink} onFocus={event => event.target.select()} />
            </div>}
            <dl className="facts">
              <div><dt>Tipo de documento</dt><dd>Não identificado pelo app.</dd></div>
              <div><dt>Validado por</dt><dd>Nenhum cartório analisou este documento. O cartório e o histórico exibidos na demonstração são fictícios.</dd></div>
            </dl>
            <p>O registro do hash não comprova a autenticidade do documento, a identidade do titular ou a propriedade do imóvel.</p>
            <ReportDownload key={`${resultForRoute.record.signature}:${resultForRoute.checkedAt}`} result={resultForRoute} />
            <button className="primary" onClick={() => {
              setFile(null);
              setResult(null);
              window.location.hash = lookupFragment(signature);
            }}>Fazer nova consulta</button>
          </> : <form onSubmit={verify}>
            <p className="screen-description">Consulte o registro na Solana Devnet sem conectar carteira. Se tiver uma cópia do arquivo, você pode compará-la neste aparelho.</p>
            <div className="reference-controls">
              <label htmlFor="lookup-reference">Link do registro ou código da transação</label>
              <textarea id="lookup-reference" className="reference-input" rows={3} value={reference} disabled={busy} spellCheck={false} autoCapitalize="none" autoCorrect="off" aria-describedby="reference-help" onChange={event => {
                setReference(event.target.value); setResult(null); setError('');
              }} />
              <p id="reference-help" className="file-help">Cole o link compartilhado pelo proprietário. Nenhuma carteira é necessária para consultar.</p>
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
            {error && <p className="error-message" role="alert">{error}</p>}
            <button className="primary" disabled={busy}>{busy ? 'Consultando…' : 'Verificar documento'}</button>
          </form>}
  </section>;
}

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { explorerUrl } from './memo-record';
import type { MemoLookup } from './memo';
import { sha256 } from './preparation';

export function lookupFragment(signature: string) {
  return `#consulta?${new URLSearchParams({ tx: signature })}`;
}

type Result = Extract<MemoLookup, { status: 'confirmed' }> & {
  comparison: 'none' | 'match' | 'different';
};

export function PublicLookup({ signature }: { signature: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const shareLink = new URL(window.location.href);
  shareLink.search = '';
  shareLink.hash = lookupFragment(signature);

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => { heading.current?.focus(); }, [result]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    setError('');
    const request = new AbortController();
    active.current = request;
    setBusy(true);
    let failure = 'Não foi possível consultar a Devnet. Tente novamente.';
    try {
      const { lookupMemo } = await import('./memo');
      request.signal.throwIfAborted();
      const found = await lookupMemo(signature, request.signal);
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
      setResult({ ...found, comparison: hash === null ? 'none' : hash === found.record.hash ? 'match' : 'different' });
    } catch {
      if (!request.signal.aborted) setError(failure);
    } finally {
      active.current = null;
      if (!request.signal.aborted) setBusy(false);
    }
  }

  return <div className="preview-area public-lookup">
    <main className="phone" aria-label="Consulta pública PropertyChain">
      <header className="app-header"><strong>PropertyChain</strong></header>
      <div className="screen-scroll">
        <section className="screen-enter">
          <h1 className="screen-title" ref={heading} tabIndex={-1}>{result ? 'Resultado da verificação' : 'Verificar documento'}</h1>
          {result ? <>
            <p role="status">Registro confirmado na Devnet.</p>
            <dl className="facts">
              <div><dt>Comparação do arquivo</dt><dd>{{
              none: 'Arquivo não comparado. Nenhum arquivo foi selecionado.',
              match: 'A impressão digital do arquivo coincide com a do registro.',
              different: 'A impressão digital do arquivo é diferente da que consta no registro.',
              }[result.comparison]}</dd></div>
              <div><dt>SHA-256 registrado</dt><dd className="digest">{result.record.hash}</dd></div>
              <div><dt>Tempo de consulta à Devnet</dt><dd>{(result.elapsedMs / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s</dd></div>
            </dl>
            <p><a className="text-link" href={explorerUrl(signature)} target="_blank" rel="noreferrer">Ver transação no explorador Devnet</a></p>
            <p><a className="text-link" href={shareLink.href}>Link desta consulta</a></p>
            <dl className="facts">
              <div><dt>Tipo de documento</dt><dd>Não identificado pelo app.</dd></div>
              <div><dt>Validado por</dt><dd>Nenhum cartório analisou este documento. O cartório e o histórico exibidos na demonstração são fictícios.</dd></div>
            </dl>
            <p>O registro do hash não comprova a autenticidade do documento, a identidade do titular ou a propriedade do imóvel.</p>
            <button className="primary" onClick={() => { setFile(null); setResult(null); }}>Fazer nova consulta</button>
          </> : <form onSubmit={verify}>
            <p className="screen-description">Consulte o registro na Solana Devnet sem conectar carteira. Se tiver uma cópia do arquivo, você pode compará-la neste aparelho.</p>
            <div className="file-controls">
              <label className="file-label" htmlFor="lookup-file">Escolher arquivo para comparar (opcional)</label>
              <input id="lookup-file" ref={fileInput} className="file-input" type="file" disabled={busy} onChange={event => {
                setFile(event.target.files?.[0] ?? null);
                setError('');
              }} />
              {file && <button className="text-button" type="button" disabled={busy} onClick={() => {
                setFile(null);
                if (fileInput.current) fileInput.current.value = '';
              }}>Remover arquivo</button>}
              <span className="file-help">O arquivo fica neste aparelho.</span>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
            <button className="primary" disabled={busy}>{busy ? 'Consultando…' : 'Verificar documento'}</button>
          </form>}
        </section>
      </div>
    </main>
  </div>;
}

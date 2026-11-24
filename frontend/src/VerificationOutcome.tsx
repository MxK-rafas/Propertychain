import { useState } from 'react';
import { explorerUrl } from './memo-record';
import { publicLookupUrl } from './consultation-link';
import { ReportDownload } from './ReportDownload';
import { comparisonText, comparisonTitle } from './verification-result';
import type { VerificationResult } from './verification-result';

export function VerificationOutcome({ result, actionLabel, onAction }: {
  result: VerificationResult; actionLabel: string; onAction: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const shareLink = publicLookupUrl(result.record.signature);
  async function copyLink() {
    try { await navigator.clipboard.writeText(shareLink); setCopyStatus('copied'); }
    catch { setCopyStatus('manual'); }
  }
  return <>
    <p role="status">Registro encontrado na rede de testes.</p>
    <div className={`comparison-card comparison-${result.comparison}`}>
      <h2>{comparisonTitle[result.comparison]}</h2>
      <p>{comparisonText[result.comparison]}</p>
    </div>
    <button className="primary" onClick={onAction}>{actionLabel}</button>
    <p><a className="text-link" href={explorerUrl(result.record.signature)} target="_blank" rel="noreferrer">Ver comprovante público</a></p>
    <button className="text-button" onClick={copyLink}>Copiar link da consulta</button>
    {copyStatus === 'copied' && <p role="status">Link copiado.</p>}
    {copyStatus === 'manual' && <div className="file-controls"><label htmlFor="consultation-link">Copie o endereço abaixo</label><textarea id="consultation-link" className="reference-input" readOnly value={shareLink} onFocus={event => event.target.select()} /></div>}
    <details className="learning-help technical-details">
      <summary>Ver detalhes do registro</summary>
      <dl className="facts">
        <div><dt>Código registrado (SHA-256)</dt><dd className="digest">{result.record.hash}</dd></div>
        <div><dt>Código da transação</dt><dd className="digest">{result.record.signature}</dd></div>
        <div><dt>Tempo para consultar a rede de testes</dt><dd>{(result.elapsedMs / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s</dd></div>
        <div><dt>Tipo de documento</dt><dd>Não identificado pelo app.</dd></div>
      </dl>
    </details>
    <p className="result-limits">Nenhum cartório real analisou este documento. A comparação não comprova a autenticidade do conteúdo nem a propriedade do imóvel.</p>
    <ReportDownload key={`${result.record.signature}:${result.checkedAt}`} result={result} />
  </>;
}

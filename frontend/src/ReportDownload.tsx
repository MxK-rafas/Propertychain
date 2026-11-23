import { useEffect, useRef, useState } from 'react';
import type { VerificationResult } from './verification-result';

export function ReportDownload({ result }: { result: VerificationResult }) {
  const [ready, setReady] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);
  const generation = useRef(0);
  const url = useRef<string | null>(null);
  useEffect(() => () => {
    generation.current++;
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);

  async function generate() {
    if (running.current) return;
    running.current = true; setBusy(true); setError('');
    const id = generation.current;
    try {
      const { createVerificationReport } = await import('./verification-report');
      if (id !== generation.current) return;
      const bytes = await createVerificationReport(result);
      if (id !== generation.current) return;
      const blob = new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' });
      const address = URL.createObjectURL(blob);
      url.current = address; setReady(address);
      // Keep explicit links available: an in-app browser may ignore automatic downloads.
      const download = document.createElement('a');
      download.href = address; download.download = 'propertychain-relatorio-devnet.pdf';
      document.body.appendChild(download);
      try { download.click(); } catch { /* The prepared PDF remains available below. */ }
      finally { download.remove(); }
    } catch {
      if (id === generation.current) setError('Não foi possível gerar o PDF neste aparelho. Tente novamente. O resultado da consulta continua disponível.');
    } finally {
      if (id === generation.current) { running.current = false; setBusy(false); }
    }
  }

  return <section className="report-download" aria-label="Relatório da consulta">
    {ready ? <>
      <p role="status">PDF pronto neste aparelho. Se o download não aparecer, toque em Abrir PDF.</p>
      <a className="text-link" href={ready} download="propertychain-relatorio-devnet.pdf">Baixar PDF novamente</a>
      <a className="text-link" href={ready} target="_blank" rel="noopener noreferrer">Abrir PDF</a>
    </> : <button className="text-button" disabled={busy} onClick={generate}>{busy ? 'Gerando PDF…' : 'Baixar relatório em PDF'}</button>}
    {error && <p className="error-message" role="alert">{error}</p>}
  </section>;
}

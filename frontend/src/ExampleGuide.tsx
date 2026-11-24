import { useEffect, useRef, useState } from 'react';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';
import { sha256 } from './preparation';
import { NetworkHelp } from './NetworkHelp';
import { VerificationOutcome } from './VerificationOutcome';
import type { VerificationResult } from './verification-result';

export const EXAMPLE_SIGNATURE = '2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G';
const titles = ['Conheça o arquivo de exemplo.', 'Vamos conferir a cópia original.', 'Agora, uma cópia alterada.', 'E se eu não tiver o arquivo?'];
const explanations = [
  'Vamos usar um PDF fictício que já foi registrado na rede de testes. Você verá o resultado sem instalar carteira, criar conta ou pagar.',
  'Vamos calcular o código do PDF neste aparelho e comparar com o código lido no registro público.',
  'Vamos fazer uma pequena alteração em uma cópia do PDF, apenas neste aparelho. Ela pode parecer igual, mas seu código muda. O original e o registro continuam intactos.',
  'Desta vez, vamos consultar somente o registro público. Sem selecionar uma cópia, não podemos dizer se o arquivo que você recebeu é o mesmo.',
];
const actionLabels = ['Verificar o exemplo', 'Testar uma cópia alterada', 'Consultar sem arquivo', 'Concluir exemplo'];

export function ExampleGuide() {
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [activity, setActivity] = useState('');
  const [error, setError] = useState('');
  const original = useRef<Uint8Array | null>(null);
  const active = useRef<AbortController | null>(null);
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    const scroller = root.current?.closest('.screen-scroll');
    if (scroller) scroller.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, [phase]);

  async function run(next: number) {
    if (active.current) return;
    const request = new AbortController(); active.current = request;
    setPhase(next); setResult(null); setBusy(true); setError('');
    try {
      let localHash: string | null = null;
      if (next !== 3) {
        setActivity('1. Abrindo o PDF fictício neste aparelho.');
        if (!original.current) {
          const response = await fetch(samplePdf, { signal: request.signal });
          if (!response.ok) throw new Error('Não foi possível abrir o PDF de exemplo. Recarregue a página e tente novamente.');
          const loaded = new Uint8Array(await response.arrayBuffer());
          if (await sha256(new Uint8Array(loaded).buffer) !== sample.sha256) throw new Error('O PDF de exemplo não corresponde à versão preparada. Recarregue a página.');
          original.current = loaded;
        }
        request.signal.throwIfAborted();
        setActivity(next === 1 ? '2. Calculando o código da cópia original. O arquivo não será enviado.' : '2. Alterando uma cópia e calculando seu novo código, sem enviar o arquivo.');
        const bytes = next === 1 ? new Uint8Array(original.current) : new Uint8Array(original.current.length + 1);
        if (next === 2) { bytes.set(original.current); bytes[bytes.length - 1] = 10; }
        localHash = await sha256(bytes.buffer);
      } else setActivity('1. Sem arquivo para comparar: vamos apenas localizar o registro público.');
      request.signal.throwIfAborted();
      setActivity(next === 3 ? '2. Conferindo se o registro existe na rede de testes.' : '3. Lendo o registro público e comparando os dois códigos.');
      const { lookupMemo } = await import('./memo');
      request.signal.throwIfAborted();
      const found = await lookupMemo(EXAMPLE_SIGNATURE, request.signal);
      request.signal.throwIfAborted();
      if (found.status !== 'confirmed' || found.record.hash !== sample.sha256) throw new Error('O registro de exemplo não está disponível ou não corresponde ao PDF. Não foi possível concluir esta etapa. Tente novamente mais tarde ou consulte outro link.');
      const comparison = localHash === null ? 'none' : localHash === found.record.hash ? 'match' : 'different';
      if ((next === 1 && comparison !== 'match') || (next === 2 && comparison !== 'different')) throw new Error('Não foi possível conferir a comparação do exemplo. Recarregue a página e tente novamente.');
      setResult({ ...found, comparison, checkedAt: new Date().toISOString() });
      setActivity('');
    } catch (e) {
      if (!request.signal.aborted) {
        const known = e instanceof Error && /^(Não foi possível|O PDF de exemplo|O registro de exemplo)/.test(e.message);
        setError(known ? e.message : 'Não conseguimos consultar a rede de testes agora. Sua etapa não foi concluída. Tente novamente.');
        setActivity('');
      }
    } finally {
      if (active.current === request) { active.current = null; if (!request.signal.aborted) setBusy(false); }
    }
  }
  const advance = () => phase === 3 ? window.location.hash = 'entrada' : run(phase + 1);
  return <section ref={root} className="screen-enter example-guide" aria-label="Exemplo guiado sem carteira">
    <span className="role">PASSO {phase + 1} DE 4 · EXEMPLO SEM CARTEIRA</span>
    <h1 className="screen-title" ref={heading} tabIndex={-1}>{titles[phase]}</h1>
    <p className="screen-description">{explanations[phase]}</p>
    {result && !busy ? <VerificationOutcome key={`${phase}:${result.checkedAt}`} result={result} actionLabel={actionLabels[phase]} onAction={advance} /> : <button className="primary" disabled={busy} onClick={() => run(phase === 0 ? 1 : phase)}>{busy ? 'Conferindo o exemplo…' : error ? 'Tentar esta etapa novamente' : actionLabels[phase]}</button>}
    {phase === 0 && <>
      <div className="learning-card"><strong>O que você vai experimentar</strong><ol><li>Comparar uma cópia igual ao arquivo registrado.</li><li>Conferir o que acontece quando o arquivo muda.</li><li>Entender o limite de uma consulta sem arquivo.</li></ol><a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir o PDF fictício</a></div>
      <NetworkHelp />
    </>}
    {busy && <div className="learning-card"><p role="status">{activity}</p><p>Estamos lendo um registro existente. Nenhuma carteira, pagamento ou novo cadastro será solicitado.</p></div>}
    {error && <><p role="alert" className="error-message">{error}</p><a className="text-link" href="#consulta">Consultar outro registro</a></>}
    {phase > 0 && !busy && <button className="text-button" onClick={() => { setPhase(0); setResult(null); setError(''); setActivity(''); }}>Recomeçar exemplo</button>}
  </section>;
}

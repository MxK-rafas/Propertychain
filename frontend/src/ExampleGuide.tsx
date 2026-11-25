import { useEffect, useRef, useState } from 'react';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';
import { sha256 } from './preparation';
import { explorerUrl } from './memo-record';
import { NetworkHelp } from './NetworkHelp';
import { VerificationOutcome } from './VerificationOutcome';
import type { MemoRecord } from './memo-record';
import type { VerificationResult } from './verification-result';

export const EXAMPLE_SIGNATURE = '2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G';
type Stage = 1 | 2 | 3 | 4;
type RegistrationStep = 0 | 1 | 2 | 3 | 4;
type Comparison = VerificationResult['comparison'];
const stages = ['Cadastro', 'Cartório', 'Verificação', 'Resultado'];
const titles = ['Cadastro de exemplo.', 'O papel do cartório.', 'Verificar documento', 'Resultado da verificação'];
const registrationActions = ['Anexar documento fictício', 'Calcular código do arquivo', 'Simular conexão com a Phantom', 'Simular aprovação e publicação', 'Ir para o cartório'];
const registrationText = [
  'Veja como conferir se uma cópia é igual ao arquivo registrado. Comece anexando o PDF de exemplo.',
  'PDF anexado. Calcule seu código (hash) para comparar outras cópias depois.',
  'Código pronto. A Phantom autoriza o cadastro real. Aqui, vamos apenas simular a conexão.',
  'Conexão simulada. Agora, simule a autorização para registrar o código na Solana.',
  'Exemplo de publicação concluído. Usamos um registro existente; você não enviou uma transação.',
];
const cases: { id: Comparison; name: string; description: string }[] = [
  { id: 'match', name: 'Com o mesmo arquivo', description: 'Comparar o PDF original.' },
  { id: 'different', name: 'Com um arquivo diferente', description: 'Comparar uma cópia alterada.' },
  { id: 'none', name: 'Sem arquivo', description: 'Consultar apenas o registro.' },
];

export function ExampleGuide() {
  const [stage, setStage] = useState<Stage>(1);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(0);
  const [digest, setDigest] = useState('');
  const [registered, setRegistered] = useState<MemoRecord | null>(null);
  const [validated, setValidated] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Comparison>('match');
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
  }, [stage, registrationStep, validated]);

  async function perform(work: (signal: AbortSignal) => Promise<void>) {
    if (active.current) return;
    const request = new AbortController(); active.current = request;
    setBusy(true); setError('');
    try { await work(request.signal); }
    catch (e) {
      if (!request.signal.aborted) {
        const known = e instanceof Error && /^(Não foi possível|O PDF de exemplo|O registro de exemplo)/.test(e.message);
        setError(known ? e.message : 'Não conseguimos concluir esta etapa. Confira sua conexão e tente novamente. Nenhum registro novo foi enviado.');
      }
    } finally {
      if (active.current === request) {
        active.current = null;
        if (!request.signal.aborted) { setBusy(false); setActivity(''); }
      }
    }
  }

  async function readExample(signal: AbortSignal) {
    const { lookupMemo } = await import('./memo');
    signal.throwIfAborted();
    const found = await lookupMemo(EXAMPLE_SIGNATURE, signal);
    signal.throwIfAborted();
    if (found.status !== 'confirmed' || found.record.hash !== sample.sha256) {
      throw new Error('O registro de exemplo não está disponível ou não corresponde ao PDF. Tente novamente mais tarde ou consulte outro registro.');
    }
    return found;
  }

  function registrationAction() {
    if (registrationStep === 4) { setStage(2); setError(''); return; }
    void perform(async signal => {
      if (registrationStep === 0) {
        setActivity('Abrindo o PDF fictício para anexá-lo ao exemplo. Nenhum arquivo seu será solicitado.');
        const response = await fetch(samplePdf, { signal });
        if (!response.ok) throw new Error('Não foi possível abrir o PDF de exemplo. Tente novamente.');
        const loaded = new Uint8Array(await response.arrayBuffer());
        signal.throwIfAborted();
        original.current = loaded;
        setRegistrationStep(1);
      } else if (registrationStep === 1) {
        setActivity('Calculando o hash SHA-256 do PDF neste aparelho, sem enviar o arquivo.');
        const hash = await sha256(new Uint8Array(original.current!).buffer);
        signal.throwIfAborted();
        if (hash !== sample.sha256) {
          original.current = null; setRegistrationStep(0);
          throw new Error('O PDF de exemplo não corresponde à versão preparada. Anexe novamente o exemplo.');
        }
        setDigest(hash); setRegistrationStep(2);
      } else if (registrationStep === 2) {
        // Didactic connection only: never access a wallet provider or request an account.
        setRegistrationStep(3);
      } else {
        setActivity('Conferindo o registro que já existe na Solana Devnet. A aprovação e a publicação são apenas ilustradas.');
        const found = await readExample(signal);
        signal.throwIfAborted();
        setRegistered(found.record); setRegistrationStep(4);
      }
    });
  }

  function verify() {
    setResult(null);
    void perform(async signal => {
      let localHash: string | null = null;
      if (selectedCase !== 'none') {
        setActivity(selectedCase === 'match' ? 'Calculando o hash da mesma cópia do PDF, sem enviar o arquivo.' : 'Alterando uma cópia em memória e calculando seu novo hash. O original continua intacto.');
        const bytes = selectedCase === 'match' ? new Uint8Array(original.current!) : new Uint8Array(original.current!.length + 1);
        if (selectedCase === 'different') { bytes.set(original.current!); bytes[bytes.length - 1] = 10; }
        localHash = await sha256(bytes.buffer);
      }
      signal.throwIfAborted();
      setActivity('Lendo o registro real da Solana Devnet e conferindo o código registrado.');
      const found = await readExample(signal);
      signal.throwIfAborted();
      const comparison = localHash === null ? 'none' : localHash === found.record.hash ? 'match' : 'different';
      if (comparison !== selectedCase) throw new Error('Não foi possível conferir a comparação do exemplo. Recomece o exemplo e tente novamente.');
      setResult({ ...found, comparison, checkedAt: new Date().toISOString() });
      setStage(4);
    });
  }

  function restart() {
    if (active.current) return;
    original.current = null; setStage(1); setRegistrationStep(0); setDigest(''); setRegistered(null);
    setValidated(false); setSelectedCase('match'); setResult(null); setError(''); setActivity('');
  }
  function anotherCase() { setResult(null); setStage(3); setError(''); }
  const primaryLabel = stage === 1 ? registrationActions[registrationStep] : stage === 2 ? validated ? 'Ir para verificação' : 'Simular análise do cartório' : 'Verificar documento';
  function primaryAction() {
    if (stage === 1) registrationAction();
    else if (stage === 2) { setError(''); if (validated) setStage(3); else setValidated(true); }
    else verify();
  }

  return <section ref={root} className="screen-enter example-guide" aria-label="Exemplo guiado sem carteira">
    <span className="role">ETAPA {stage} DE 4 · EXEMPLO GUIADO</span><p className="example-scope">Carteira e cartório simulados · comparação real</p>
    <ol className="example-stages" aria-label="Etapas do exemplo">{stages.map((name, i) => <li key={name} aria-current={stage === i + 1 ? 'step' : undefined}><span>{i + 1}</span>{name}</li>)}</ol>
    <h1 className="screen-title" ref={heading} tabIndex={-1}>{titles[stage - 1]}</h1>
    <p className="screen-description">{stage === 1 ? registrationText[registrationStep] : stage === 2
      ? 'O cartório analisaria o documento antes de validá-lo. Aqui, essa análise é simulada.'
      : stage === 3 ? 'Escolha uma cópia para comparar com o registro existente. Não precisa de carteira.'
      : 'Confira a comparação e baixe o relatório.'}</p>

    {stage !== 4 && stage !== 3 && <button className="primary" disabled={busy} onClick={primaryAction}>{busy ? 'Aguarde…' : error ? 'Tentar novamente' : primaryLabel}</button>}
    {busy && <div className="learning-card"><p role="status">{activity}</p></div>}
    {error && <><p role="alert" className="error-message">{error}</p><a className="text-link" href="#consulta">Consultar outro registro</a></>}

    {stage === 1 && <>
      {digest && <details className="learning-help"><summary>Ver código calculado (hash)</summary><output className="digest">{digest}</output><p>Outra foto do mesmo papel pode gerar um código diferente.</p></details>}
      {registrationStep >= 3 && <p className="status-chip">Carteira de exemplo conectada — simulação</p>}
      {registered && <div className="learning-card"><a className="text-link" href={explorerUrl(registered.signature)} target="_blank" rel="noreferrer">Ver registro de exemplo na Solana Devnet</a><p role="status">Registro existente conferido. Publicação simulada, sem novo envio.</p></div>}
      <div className="learning-card example-document">
        <strong>{registrationStep === 0 ? 'Documento que será anexado' : 'Documento fictício anexado'}</strong>
        <p>documento-ficticio.pdf · sem dados reais</p>
        <a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir o PDF fictício</a>
      </div>
      <details className="learning-help"><summary>Ver passos do cadastro</summary><ol className="example-process" aria-label="Ações do cadastro de exemplo">
        {['Anexar o documento fictício', 'Calcular o hash no aparelho', 'Conectar a carteira de exemplo', 'Aprovar e publicar na Solana'].map((text, i) => <li key={text} className={registrationStep > i ? 'complete' : registrationStep === i ? 'current' : ''}><span>{i + 1}</span><div><strong>{text}</strong><small>{i < 2 ? registrationStep > i ? 'Feito neste aparelho' : 'Ação local' : registrationStep > i ? 'Simulação concluída' : 'Será apenas simulado'}</small></div></li>)}
      </ol></details>
      <details className="learning-help"><summary>Saiba mais: Phantom e simulação</summary><p>A Phantom é a carteira que autoriza o cadastro real. Conectar não publica nada: é preciso revisar e aprovar a operação.</p><p>Aqui, conexão e publicação são simuladas. Consultamos um registro existente, sem instalar carteira ou pagar.</p><p>No cadastro real, a taxa usa SOL de teste. Nunca pedimos frase de recuperação ou chave privada.</p></details>
      <NetworkHelp />
    </>}

    {stage === 2 && <>
      <div className="comparison-card"><h2>{validated ? 'Documento fictício validado — simulação' : 'Aguardando análise de exemplo'}</h2><p>{validated ? 'Aprovação ilustrativa, sem valor legal.' : 'Toque no botão para simular a análise.'}</p></div>
      <details className="learning-help"><summary>Saiba mais: papel do cartório</summary><p>No fluxo proposto, o cartório examinaria o documento e sua origem antes de decidir pela validação. Registrar um código não substitui essa análise.</p></details>
      <p className="result-limits">Nenhum cartório real recebeu ou analisou este PDF.</p>
    </>}

    {stage === 3 && <>
      <fieldset className="profile-options example-cases" disabled={busy}><legend>Qual caso você quer verificar?</legend>{cases.map(item => <label className="profile-option" key={item.id}><input type="radio" name="example-case" value={item.id} checked={selectedCase === item.id} onChange={() => { setSelectedCase(item.id); setResult(null); setError(''); }} /><span><strong>{item.name}</strong><small>{item.description}</small></span></label>)}</fieldset>
      <button className="primary" disabled={busy} onClick={verify}>{busy ? 'Consultando…' : error ? 'Tentar novamente' : 'Verificar documento'}</button>

      <details className="learning-help"><summary>Ver registro usado no exemplo</summary><a className="text-link" href={explorerUrl(EXAMPLE_SIGNATURE)} target="_blank" rel="noreferrer">Ver registro de exemplo na Solana Devnet</a></details>
      <NetworkHelp />
    </>}

    {stage === 4 && result && <>
      <VerificationOutcome key={`${result.comparison}:${result.checkedAt}`} result={result} actionLabel="Testar outro caso" onAction={anotherCase} />
      <p className="result-limits">O relatório descreve a comparação real, sem aprovação de cartório.</p>
      <a className="text-link" href="#entrada">Concluir exemplo</a>
    </>}
    {(stage === 2 || stage === 3) && <button className="text-button" disabled={busy} onClick={() => { setStage(stage === 2 ? 1 : 2); setError(''); }}>Voltar à etapa anterior</button>}
    {(stage > 1 || registrationStep > 0) && <button className="text-button" disabled={busy} onClick={restart}>Recomeçar exemplo</button>}
  </section>;
}

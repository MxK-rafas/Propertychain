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
const registrationActions = ['Anexar documento fictício', 'Calcular hash do documento', 'Simular conexão com a Phantom', 'Simular aprovação e publicação', 'Ir para o cartório'];
const registrationText = [
  'Primeiro, vamos anexar um PDF fictício ao exemplo. Depois, calcularemos seu código, conectaremos uma carteira de exemplo e mostraremos como seria a publicação na Solana.',
  'O PDF foi anexado ao exemplo. Agora, vamos calcular seu hash: um código que identifica exatamente este arquivo. O cálculo acontece neste aparelho.',
  'O hash está pronto. No cadastro real, o próximo passo é conectar a carteira digital Phantom. Aqui, a conexão será apenas simulada, sem abrir ou instalar carteira.',
  'A carteira de exemplo está conectada por simulação. Revise o hash abaixo. Vamos representar sua aprovação e a publicação na blockchain Solana, sem assinar ou enviar nada.',
  'A publicação foi representada com um registro fictício que já existe na Solana Devnet. Conferimos esse registro de verdade; nenhum novo cadastro foi enviado por você.',
];
const cases: { id: Comparison; name: string; description: string }[] = [
  { id: 'match', name: 'Com o mesmo arquivo', description: 'Usar a cópia exata do PDF anexado no cadastro.' },
  { id: 'different', name: 'Com um arquivo diferente', description: 'Fazer uma pequena alteração em uma cópia do PDF, apenas na memória deste aparelho.' },
  { id: 'none', name: 'Sem arquivo', description: 'Localizar o registro, sem comparar uma cópia digital.' },
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
    <span className="role">ETAPA {stage} DE 4 · EXEMPLO GUIADO</span>
    <ol className="example-stages" aria-label="Etapas do exemplo">{stages.map((name, i) => <li key={name} aria-current={stage === i + 1 ? 'step' : undefined}><span>{i + 1}</span>{name}</li>)}</ol>
    <h1 className="screen-title" ref={heading} tabIndex={-1}>{titles[stage - 1]}</h1>
    <p className="screen-description">{stage === 1 ? registrationText[registrationStep] : stage === 2
      ? 'Em um serviço real, o cartório avaliaria a veracidade do documento e, após a análise, poderia validá-lo. Vamos representar essa avaliação com o documento fictício.'
      : stage === 3 ? 'Agora você vai consultar um registro já publicado na Solana e comparar uma cópia. Escolha um dos três casos abaixo, sem conectar carteira.'
      : 'Veja o que a consulta encontrou e baixe o relatório desta verificação. O resultado abaixo vem da leitura real do registro de exemplo na rede de testes.'}</p>

    {stage !== 4 && stage !== 3 && <button className="primary" disabled={busy} onClick={primaryAction}>{busy ? 'Aguarde…' : error ? 'Tentar novamente' : primaryLabel}</button>}
    {busy && <div className="learning-card"><p role="status">{activity}</p><p>Você não precisa instalar carteira, obter créditos de teste ou aprovar uma transação.</p></div>}
    {error && <><p role="alert" className="error-message">{error}</p><a className="text-link" href="#consulta">Consultar outro registro</a></>}

    {stage === 1 && <>
      {digest && <div className="learning-card"><strong>Hash calculado neste aparelho (SHA-256)</strong><output className="digest">{digest}</output><p>O mesmo arquivo produz o mesmo código. Duas fotos diferentes do mesmo papel normalmente não.</p></div>}
      {registrationStep >= 3 && <p className="status-chip">Carteira de exemplo conectada — simulação</p>}
      {registered && <div className="learning-card"><a className="text-link" href={explorerUrl(registered.signature)} target="_blank" rel="noreferrer">Ver registro de exemplo na Solana Devnet</a><p role="status">Registro existente conferido. A publicação deste percurso foi simulada; nenhuma transação nova foi enviada.</p></div>}
      <div className="learning-card example-document">
        <strong>{registrationStep === 0 ? 'Documento que será anexado' : 'Documento fictício anexado'}</strong>
        <p>documento-ficticio.pdf · PDF de exemplo</p><p>Dados inteiramente fictícios. Seu documento pessoal não será solicitado.</p>
        <a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir o PDF fictício</a>
      </div>
      <ol className="example-process" aria-label="Ações do cadastro de exemplo">
        {['Anexar o documento fictício', 'Calcular o hash no aparelho', 'Conectar a carteira de exemplo', 'Aprovar e publicar na Solana'].map((text, i) => <li key={text} className={registrationStep > i ? 'complete' : registrationStep === i ? 'current' : ''}><span>{i + 1}</span><div><strong>{text}</strong><small>{i < 2 ? registrationStep > i ? 'Feito neste aparelho' : 'Ação local' : registrationStep > i ? 'Simulação concluída' : 'Será apenas simulado'}</small></div></li>)}
      </ol>
      <div className="learning-card"><h2>Para que serve a Phantom?</h2><p>A Phantom é uma carteira digital. No cadastro real, você a conecta para identificar a carteira que autorizará o registro. Depois, revisa o hash e a taxa e aprova a operação na própria Phantom. Conectar a carteira, por si só, não publica nada.</p><p>A publicação real usa SOL de teste para pagar a taxa da Solana Devnet, sem dinheiro real. Neste exemplo, a carteira e sua aprovação são simuladas: não é preciso instalar a Phantom nem ter saldo.</p><p>O PropertyChain nunca pede sua frase de recuperação ou chave privada.</p></div>
      <div className="learning-card"><h2>Por que usar blockchain?</h2><p>A blockchain Solana permite que outras pessoas consultem o código registrado. Publicamos o hash, e não o PDF. Depois, esse código pode ser comparado com o de outra cópia do arquivo.</p><p>Para este exemplo, usaremos um registro que já existe na Solana Devnet, a rede de testes. O cadastro real só envia um novo registro após sua aprovação na Phantom.</p></div>
      <NetworkHelp />
    </>}

    {stage === 2 && <>
      <div className="comparison-card"><h2>{validated ? 'Documento fictício validado — simulação' : 'Aguardando análise de exemplo'}</h2><p>{validated ? 'Esta aprovação mostra apenas como seria a etapa do cartório no fluxo proposto.' : 'Use o botão para representar a análise e a validação do documento de exemplo.'}</p></div>
      <div className="learning-card"><strong>Documento em avaliação: PDF fictício do exemplo</strong><p>Em uma análise real, o cartório precisaria conferir os dados, a origem e a veracidade do documento antes de decidir pela validação.</p><ol><li>Receber e examinar o documento.</li><li>Avaliar a veracidade das informações.</li><li>Decidir se pode validar o documento.</li></ol></div>
      <p className="result-limits">Nenhum cartório real recebeu ou analisou este PDF. A análise e a validação são somente visuais; não criam uma aprovação na blockchain nem comprovam propriedade.</p>
    </>}

    {stage === 3 && <>
      <fieldset className="profile-options example-cases" disabled={busy}><legend>Qual caso você quer verificar?</legend>{cases.map(item => <label className="profile-option" key={item.id}><input type="radio" name="example-case" value={item.id} checked={selectedCase === item.id} onChange={() => { setSelectedCase(item.id); setResult(null); setError(''); }} /><span><strong>{item.name}</strong><small>{item.description}</small></span></label>)}</fieldset>
      <button className="primary" disabled={busy} onClick={verify}>{busy ? 'Consultando…' : error ? 'Tentar novamente' : 'Verificar documento'}</button>
      <p className="file-help">{selectedCase === 'none' ? 'Nenhum arquivo será comparado. Encontrar o registro não confirma uma cópia que você tenha recebido.' : selectedCase === 'different' ? 'Uma cópia alterada será preparada somente na memória. O PDF original e o registro não mudam.' : 'O PDF anexado na etapa 1 será comparado com o hash lido na Solana Devnet.'}</p>
      <div className="learning-card"><strong>Registro já publicado</strong><p>Usaremos o registro existente do PDF fictício. A etapa de cadastro apenas mostrou como ele seria criado.</p><a className="text-link" href={explorerUrl(EXAMPLE_SIGNATURE)} target="_blank" rel="noreferrer">Ver registro de exemplo na Solana Devnet</a></div>
      <NetworkHelp />
    </>}

    {stage === 4 && result && <>
      <VerificationOutcome key={`${result.comparison}:${result.checkedAt}`} result={result} actionLabel="Testar outro caso" onAction={anotherCase} />
      <p className="result-limits">A conexão da carteira, a nova publicação e a validação do cartório foram simuladas. O relatório descreve somente a consulta real ao registro de exemplo e a comparação escolhida.</p>
      <a className="text-link" href="#entrada">Concluir exemplo</a>
    </>}
    {(stage === 2 || stage === 3) && <button className="text-button" disabled={busy} onClick={() => { setStage(stage === 2 ? 1 : 2); setError(''); }}>Voltar à etapa anterior</button>}
    {(stage > 1 || registrationStep > 0) && <button className="text-button" disabled={busy} onClick={restart}>Recomeçar exemplo</button>}
  </section>;
}

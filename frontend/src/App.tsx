import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { explorerUrl, readPending } from './memo-record';
import type { MemoRecord } from './memo-record';
import { lookupFragment, PublicLookup } from './PublicLookup';
import { PreparationPanel } from './PreparationPanel';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';

const steps = [
  { id: 'cadastro', name: 'Cadastrar documento', subtitle: 'O ponto de partida', action: 'Continuar demonstração' },
  { id: 'validacao', name: 'Validação pelo cartório', subtitle: 'Uma etapa de confiança', action: 'Ver validação simulada' },
  { id: 'consulta', name: 'Verificar documento', subtitle: 'A consulta de quem precisa saber', action: 'Ver resultado de exemplo' },
  { id: 'resultado', name: 'Resultado da verificação', subtitle: 'Registro e comparação do arquivo', action: 'Fazer nova consulta' },
];
function currentStep(route: string) {
  const index = steps.findIndex(step => `#${step.id}` === route);
  return index;
}
type IconName = 'house' | 'doc' | 'shield' | 'check' | 'arrow' | 'back' | 'info';
function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, string> = {
    house: 'm3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7',
    doc: 'M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h6',
    shield: 'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM8 12l3 3 5-6',
    check: 'm5 12 4 4L19 6', arrow: 'M4 12h15m-6-6 6 6-6 6',
    back: 'M20 12H5m6-6-6 6 6 6', info: 'M12 11v6M12 7v.5',
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>{name === 'info' && <circle cx="12" cy="12" r="9" />}<path d={paths[name]} /></svg>;
}
function Note({ children }: { children: React.ReactNode }) {
  return <div className="helper"><Icon name="info" /><p>{children}</p></div>;
}
export function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [fragment, params] = route.split('?', 2);
  const step = currentStep(fragment);
  const publicResult = fragment === '#resultado';
  const publicSignature = params !== undefined && (fragment === '#consulta' || publicResult)
    ? new URLSearchParams(params).get('tx') ?? ''
    : null;
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [pendingHash, setPendingHash] = useState<string | null>(() => readPending()?.hash || null);
  const [receipt, setReceipt] = useState<MemoRecord | null>(null);
  const registered = useCallback((record: MemoRecord) => { setReceipt(record); window.location.hash = 'validacao'; }, []);
  const [profile, setProfile] = useState('proprietario');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const routeChanged = useRef(false);
  useEffect(() => {
    const change = () => { routeChanged.current = true; setRoute(window.location.hash); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    document.title = `${publicSignature !== null ? steps[publicResult ? 3 : 2].name : step < 0 ? 'Escolher perfil' : steps[step].name} · PropertyChain`;
    if (scroll.current) scroll.current.scrollTop = 0;
    if (routeChanged.current) heading.current?.focus({ preventScroll: true });
  }, [step, publicSignature, publicResult]);
  const navigate = (index: number) => { window.location.hash = index < 0 ? 'entrada' : steps[index].id; };
  const enter = () => navigate(profile === 'verificador' ? 2 : profile === 'cartorio' ? 1 : 0);
  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    event.target.value = '';
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(selected.type)) {
      setError('Escolha um arquivo PDF, JPEG ou PNG. O arquivo anterior foi mantido.');
      return;
    }
    if (selected.size === 0) {
      setError('Este arquivo está vazio. Escolha outro PDF ou imagem.');
      return;
    }
    if (registrationBusy) return;
    setReceipt(null);
    setFile(selected);
    setError('');
  }
  const sourceHash = receipt?.hash || pendingHash;
  const isExample = !file && (!sourceHash || sourceHash === sample.sha256);
  const fileName = file ? file.name : isExample ? sample.tipo : 'Arquivo do registro';
  const facts = isExample && <dl className="facts"><div><dt>Imóvel fictício</dt><dd>{sample.endereco}</dd></div><div><dt>Titular apresentado na demonstração</dt><dd>{sample.titular}</dd></div></dl>;
  const compact = <div className="compact-doc"><span className="doc-icon"><Icon name="doc" /></span><div><strong className="file-name">{fileName}</strong><small>{file ? 'Arquivo local · conteúdo não analisado' : `${sample.endereco} · Exemplo fictício`}</small></div></div>;
  const title = (children: React.ReactNode) => <h2 className="screen-title" ref={heading} tabIndex={-1}>{children}</h2>;
  return <div className="studio" onClickCapture={event => { if (registrationBusy && (event.target as HTMLElement).closest('a[href^="#"]')) event.preventDefault(); }}>
    <aside className="guide" aria-label="Navegação da demonstração">
      <a className="studio-brand" href="#entrada"><span className="brand-mark"><Icon name="house" /></span>PropertyChain</a>
      <div className="guide-content"><span className="eyebrow">DEMONSTRAÇÃO INTERATIVA</span><h1>A história do imóvel, <br /><em>mais clara.</em></h1><p className="guide-intro">Do cadastro à consulta, um caminho simples para verificar a origem de um documento.</p>
        <nav className="steps" aria-label="Etapas"><a href="#entrada" className={step < 0 ? 'active' : ''} aria-current={step < 0 ? 'page' : undefined}><span className="step-number"><Icon name="house" /></span><span><strong>Escolher perfil</strong><small>Como deseja entrar?</small></span></a>{steps.map((item, index) => <a key={item.id} href={publicSignature !== null && (index === 2 || index === 3) ? lookupFragment(publicSignature, index === 3 ? 'resultado' : 'consulta') : `#${item.id}`} className={step === index ? 'active' : ''} aria-current={step === index ? 'step' : undefined}><span className="step-number">0{index + 1}</span><span><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="step-current" aria-hidden="true">↗</span></a>)}</nav>
        <div className="guide-note"><Icon name="info" /><p>Cadastro de hash na Devnet disponível após aprovação na Phantom. Cartório simulado. Registros confirmados podem ser consultados por link.</p></div>
      </div><span className="guide-footer">PROPERTYCHAIN <span>•</span> REGISTRO E CONSULTA NA DEVNET</span>
    </aside>
    <div className="preview-area"><div className="preview-label"><span className="live-dot" />VISUALIZAÇÃO DO APP<span className="preview-mobile">CELULAR</span></div>
      <main className="phone" aria-label="Aplicativo PropertyChain">
        <header className="app-header"><span className="app-logo"><Icon name="house" /></span><span>Documentos<br /><strong>do imóvel</strong></span><span className="prototype-tag">DEMONSTRAÇÃO</span></header>
        <div className="demo-banner"><span className="demo-dot" />Cartório simulado</div>
        <div className="screen-scroll" ref={scroll}>
          <div className="screen-top">{step >= 0 && <button className="back-button" disabled={registrationBusy} aria-label="Voltar à tela anterior" onClick={() => { if (publicSignature !== null) window.location.hash = publicResult ? lookupFragment(publicSignature) : '#entrada'; else navigate(step === (profile === 'verificador' ? 2 : profile === 'cartorio' ? 1 : 0) ? -1 : step - 1); }}><Icon name="back" /></button>}<span>{step < 0 ? 'BOAS-VINDAS' : `ETAPA ${step + 1} DE 4`}</span><div className="progress-bars" aria-hidden="true">{steps.map((item, index) => <i key={item.id} className={index <= step ? 'done' : ''} />)}</div></div>
          {publicSignature !== null ? <PublicLookup key={publicSignature} signature={publicSignature} showResult={publicResult} /> : <section key={step} className="screen-enter">
            {step < 0 && <>
              <span className="role">BEM-VINDO AO PROPERTYCHAIN</span>{title(<>Como deseja <br />entrar?</>)}
              <p className="screen-description">Escolha um perfil para conhecer seu caminho no aplicativo.</p>
              <fieldset className="profile-options"><legend className="sr-only">Perfil de entrada</legend>
                {[
                  { id: 'proprietario', name: 'Proprietário', description: 'Quero cadastrar um documento.', icon: 'house' as const },
                  { id: 'verificador', name: 'Comprador / verificador', description: 'Quero consultar um documento.', icon: 'doc' as const },
                  { id: 'cartorio', name: 'Cartório', description: 'Quero conhecer a validação simulada.', icon: 'shield' as const },
                ].map(item => <label className="profile-option" key={item.id}><input type="radio" name="profile" value={item.id} checked={profile === item.id} onChange={() => setProfile(item.id)} /><Icon name={item.icon} /><span><strong>{item.name}</strong><small>{item.description}</small></span></label>)}
              </fieldset>
              <Note>Entrada demonstrativa, sem conta ou senha. Os perfis organizam a apresentação; não concedem permissões reais.</Note>
            </>}

            {step === 0 && <>
              <span className="role">PROPRIETÁRIO OU HERDEIRO</span>{title(<>Cadastre seu <br />documento.</>)}
              <p className="screen-description">{file ? 'Seu arquivo será lido apenas neste dispositivo. Somente sua impressão digital será registrada na Devnet após sua aprovação.' : 'Vamos usar um documento fictício para você conhecer o caminho do cadastro à verificação.'}</p>
              {!isExample ? compact : <div className="document-card"><div className="document-preview"><div className="paper"><Icon name="house" className="paper-house" /><div className="paper-line" /><div className="paper-line" /><div className="paper-line short" /><span className="paper-stamp"><Icon name="house" /></span></div><span className="sample-label">DOCUMENTO DE EXEMPLO</span></div><div className="document-info"><div className="document-name"><Icon name="doc" />{sample.tipo}</div><a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir PDF fictício</a></div></div>}
              <div className="file-controls"><label className="file-label" htmlFor="document-file">{file ? 'Trocar arquivo local' : 'Escolher foto ou PDF local'}</label><input ref={input} id="document-file" disabled={registrationBusy || !!pendingHash} className="file-input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={chooseFile} /><span className="file-help">PDF, JPEG ou PNG · sem envio</span>{file && <button className="text-button" disabled={registrationBusy || !!pendingHash} onClick={() => { setReceipt(null); setFile(null); setError(''); if (input.current) input.current.value = ''; }}>Usar exemplo fictício</button>}</div>
              {error && <p className="error-message" role="alert">{error}</p>}
              {facts}
              <PreparationPanel file={file} wallet onRegistered={registered} onBusy={setRegistrationBusy} onPendingHash={setPendingHash} />
              <Note>{file ? 'A impressão digital é calculada neste dispositivo. O conteúdo do arquivo não é analisado nem enviado.' : 'Você pode usar o exemplo ou escolher um arquivo do seu dispositivo, sem enviá-lo a um servidor.'}</Note>
            </>}
            {step === 1 && <><span className="role">ETAPA DO CARTÓRIO</span>{title(<>Validação pelo <br />cartório.</>)}<p className="screen-description">No serviço, esta etapa será realizada pelo cartório. Aqui, a validação institucional é apenas simulada.</p>{compact}{receipt && <div className="registration-receipt"><a className="text-link" href={explorerUrl(receipt.signature)} target="_blank" rel="noreferrer">Ver transação no explorador Devnet</a><p role="status">Registro confirmado na Devnet: o hash gravado foi conferido.</p><output className="digest">{receipt.hash}</output><p><a className="text-link" href={lookupFragment(receipt.signature)}>Abrir consulta pública</a></p></div>}<span className="status-chip pending">Aguardando validação · simulação</span><div className="validation-card"><div className="validation-symbol"><Icon name="shield" /></div><h3>Uma etapa de confiança</h3><p>Aqui, vamos demonstrar o resultado dessa validação. Depois, você verá a consulta como comprador ou corretor.</p><span className="field-label">Entidade apresentada na demonstração</span><strong>Cartório de exemplo — simulação</strong></div><Note>Nenhum cartório real analisou este documento. A confirmação do registro do hash não equivale à validação do cartório.</Note></>}
            {step === 2 && <><div className="success-notice"><Icon name="info" />Validação pelo cartório apenas simulada.</div><span className="role">COMPRADOR OU CORRETOR</span>{title(<>Conheça a origem <br />do documento.</>)}<p className="screen-description">Esta tela usa um exemplo. Para verificar na Devnet, abra o link do registro que o proprietário compartilhou.</p><span className="selection-label">Documento selecionado para a demonstração</span><div className="selected-doc"><div className="selected-doc-top"><Icon name="doc" /><strong className="file-name">{fileName}</strong></div><span className="status-chip">Consulta demonstrativa</span>{facts}</div><PreparationPanel file={file} /><div className="consult-list"><p>O que será apresentado</p><ul><li><Icon name="check" />Exemplo de resultado da consulta</li><li><Icon name="check" />Tipo de documento e cartório simulado</li>{isExample && <li><Icon name="check" />Titular e histórico inteiramente fictícios</li>}</ul></div><Note>Esta demonstração não confirma autenticidade, correspondência do arquivo ou propriedade.</Note></>}
            {step === 3 && <><div className="result-heading"><span className="result-symbol"><Icon name="info" /></span><div><span className="role">RESULTADO SIMULADO</span>{title(<>Exemplo de <br />resultado.</>)}</div></div><p className="screen-description">Este é um exemplo de resultado. Para consultar na Devnet, abra o link de um registro confirmado.</p><span className="status-chip">Arquivo não comparado · simulação</span><div className="result-card">{!isExample ? <><h3>ARQUIVO LOCAL</h3><p className="local-file-name">{fileName}</p><p className="property-address">Conteúdo não analisado. Titular e imóvel não identificados pelo app.</p></> : <><h3>TITULAR APRESENTADO NA DEMONSTRAÇÃO</h3><p className="owner">{sample.titular}</p><p className="property-address">{sample.endereco}<br />Imóvel fictício</p></>}
              <div className="result-origin"><Icon name="doc" /><div><span>Tipo de documento</span><strong>{!isExample ? 'Não identificado pelo app' : sample.tipo}</strong></div></div><div className="result-origin"><Icon name="shield" /><div><span>Validado por</span><strong>Cartório de exemplo — simulação</strong><small>Nenhum cartório real analisou este documento.</small></div></div></div>
              {isExample && <section className="history" aria-label="Histórico fictício"><h3>HISTÓRICO FICTÍCIO</h3><ol className="timeline">{[...sample.historico].reverse().map(item => <li key={item.ano}><i className="timeline-point" aria-hidden="true" /><div><strong>{item.titular}</strong><span>{item.ano} · {item.descricao}</span></div></li>)}</ol></section>}
              <Note>O cartório e o histórico do exemplo são fictícios. O registro de um hash na Devnet não comprova a autenticidade do documento ou a propriedade do imóvel.</Note>
            </>}
          </section>}
        </div>
        <footer className="app-footer">{step >= 0 && <button className="text-button switch-profile" disabled={registrationBusy} onClick={() => navigate(-1)}>Trocar perfil</button>}{publicSignature === null && step !== 0 && <button className="primary" onClick={() => step < 0 ? enter() : step === 1 && receipt ? window.location.hash = lookupFragment(receipt.signature) : navigate(step === 3 ? 2 : step + 1)}><span>{step < 0 ? 'Entrar na demonstração' : steps[step].action}</span><Icon name="arrow" /></button>}<p>Solana Devnet · cartório simulado · arquivo somente local.</p><div className="home-indicator" aria-hidden="true" /></footer>
      </main><p className="preview-caption">Toque no botão verde para percorrer a demonstração.</p>
    </div>
  </div>;
}

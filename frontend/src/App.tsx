import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { explorerUrl, readPending } from './memo-record';
import type { MemoRecord } from './memo-record';
import { lookupFragment, PublicLookup } from './PublicLookup';
import { PreparationPanel } from './PreparationPanel';
import { ExampleGuide } from './ExampleGuide';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';

const steps = [
  { id: 'cadastro', name: 'Cadastrar documento', subtitle: 'O ponto de partida', action: 'Continuar demonstração' },
  { id: 'validacao', name: 'Validação pelo cartório', subtitle: 'Análise simulada', action: 'Ver validação simulada' },
  { id: 'consulta', name: 'Verificar documento', subtitle: 'A consulta de quem precisa saber', action: 'Verificar documento' },
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
  const exampleMode = fragment === '#exemplo';
  const step = exampleMode ? 2 : currentStep(fragment);
  const publicResult = fragment === '#resultado';
  const publicSignature = fragment === '#consulta' || publicResult
    ? new URLSearchParams(params ?? '').get('tx') ?? ''
    : null;
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [pendingHash, setPendingHash] = useState<string | null>(() => readPending()?.hash || null);
  const [receipt, setReceipt] = useState<MemoRecord | null>(null);
  const registered = useCallback((record: MemoRecord) => { setReceipt(record); window.location.hash = 'validacao'; }, []);
  const [profile, setProfile] = useState('exemplo');
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
    document.title = `${exampleMode ? 'Exemplo guiado' : publicSignature !== null ? steps[publicResult ? 3 : 2].name : step < 0 ? 'Escolher perfil' : steps[step].name} · PropertyChain`;
    if (scroll.current) scroll.current.scrollTop = 0;
    if (routeChanged.current) heading.current?.focus({ preventScroll: true });
  }, [step, publicSignature, publicResult, exampleMode]);
  const navigate = (index: number) => { window.location.hash = index < 0 ? 'entrada' : steps[index].id; };
  const enter = () => profile === 'exemplo' ? window.location.hash = 'exemplo' : navigate(profile === 'verificador' ? 2 : profile === 'cartorio' ? 1 : 0);
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
  const compact = <div className="compact-doc"><span className="doc-icon"><Icon name="doc" /></span><div><strong className="file-name">{fileName}</strong><small>{file ? 'Arquivo local · conteúdo não analisado' : isExample ? `${sample.endereco} · Exemplo fictício` : 'Comprovante do registro · arquivo não selecionado'}</small></div></div>;
  const title = (children: React.ReactNode) => <h2 className="screen-title" ref={heading} tabIndex={-1}>{children}</h2>;
  return <div className="studio" onClickCapture={event => { if (registrationBusy && (event.target as HTMLElement).closest('a[href^="#"]')) event.preventDefault(); }}>
    <aside className="guide" aria-label="Navegação da demonstração">
      <a className="studio-brand" href="#entrada"><span className="brand-mark"><Icon name="house" /></span>PropertyChain</a>
      <div className="guide-content"><span className="eyebrow">DEMONSTRAÇÃO INTERATIVA</span><h1>Confira a cópia.<br /><em>Entenda o registro.</em></h1><p className="guide-intro">Veja se uma cópia de documento é igual à versão registrada.</p>
        <nav className="steps" aria-label="Etapas"><a href="#entrada" className={step < 0 ? 'active' : ''} aria-current={step < 0 ? 'page' : undefined}><span className="step-number"><Icon name="house" /></span><span><strong>Escolher perfil</strong><small>Como deseja entrar?</small></span></a><a href="#exemplo" className={exampleMode ? 'active' : ''} aria-current={exampleMode ? 'page' : undefined}><span className="step-number"><Icon name="check" /></span><span><strong>Experimentar com um exemplo</strong><small>Sem carteira ou instalação</small></span></a>{steps.map((item, index) => <a key={item.id} href={publicSignature !== null && (index === 2 || index === 3) ? lookupFragment(publicSignature, index === 3 ? 'resultado' : 'consulta') : `#${item.id}`} className={!exampleMode && step === index ? 'active' : ''} aria-current={!exampleMode && step === index ? 'step' : undefined}><span className="step-number">0{index + 1}</span><span><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="step-current" aria-hidden="true">↗</span></a>)}</nav>
        <div className="guide-note"><Icon name="info" /><p>Comparação de arquivos, sem comprovação de propriedade.</p></div>
      </div><span className="guide-footer">PROPERTYCHAIN <span>•</span> REGISTRO E CONSULTA NA DEVNET</span>
    </aside>
    <div className="preview-area"><div className="preview-label"><span className="live-dot" />VISUALIZAÇÃO DO APP<span className="preview-mobile">CELULAR</span></div>
      <main className="phone" aria-label="Aplicativo PropertyChain">
        <header className="app-header"><span className="app-logo"><Icon name="house" /></span><span>Documentos<br /><strong>do imóvel</strong></span><span className="prototype-tag">DEMONSTRAÇÃO</span></header>
        <div className="demo-banner"><span className="demo-dot" />Cartório simulado</div>
        <div className="screen-scroll" ref={scroll}>
          <div className="screen-top">{step >= 0 && <button className="back-button" disabled={registrationBusy} aria-label={exampleMode ? 'Sair do exemplo' : 'Voltar à tela anterior'} onClick={() => { if (exampleMode) navigate(-1); else if (publicSignature !== null) window.location.hash = publicResult ? lookupFragment(publicSignature) : '#entrada'; else navigate(step === (profile === 'verificador' ? 2 : profile === 'cartorio' ? 1 : 0) ? -1 : step - 1); }}><Icon name="back" /></button>}<span>{exampleMode ? 'EXEMPLO GUIADO' : step < 0 ? 'BOAS-VINDAS' : `ETAPA ${step + 1} DE 4`}</span><div className="progress-bars" aria-hidden="true" hidden={exampleMode}>{steps.map((item, index) => <i key={item.id} className={index <= step ? 'done' : ''} />)}</div></div>
          {exampleMode ? <ExampleGuide /> : publicSignature !== null ? <PublicLookup signature={publicSignature} showResult={publicResult} /> : <section key={step} className="screen-enter">
            {step < 0 && <>
              <span className="role">BEM-VINDO AO PROPERTYCHAIN</span>{title(<>Confira a cópia <br />do documento.</>)}
              <p className="screen-description">Compare um documento de imóvel com uma versão registrada e veja se o arquivo mudou.</p>
              <fieldset className="profile-options"><legend className="sr-only">Perfil de entrada</legend>
                {[
                  { id: 'exemplo', name: 'Experimentar com um exemplo', description: 'Aprenda sem instalar carteira.', icon: 'check' as const },
                  { id: 'proprietario', name: 'Proprietário', description: 'Registrar um arquivo para comparar depois.', icon: 'house' as const },
                  { id: 'verificador', name: 'Comprador / verificador', description: 'Comparar uma cópia recebida.', icon: 'doc' as const },
                  { id: 'cartorio', name: 'Cartório', description: 'Conhecer a análise simulada.', icon: 'shield' as const },
                ].map(item => <label className="profile-option" key={item.id}><input type="radio" name="profile" value={item.id} checked={profile === item.id} onChange={() => setProfile(item.id)} /><Icon name={item.icon} /><span><strong>{item.name}</strong><small>{item.description}</small></span></label>)}
              </fieldset>
              <Note>O app compara arquivos. Não comprova propriedade nem transfere o imóvel.</Note>
            </>}

            {step === 0 && <>
              <span className="role">PROPRIETÁRIO OU HERDEIRO</span>{title(<>Cadastre seu <br />documento.</>)}
              <p className="screen-description">{file ? 'Registre o código do arquivo para comparar cópias depois. Guarde seu documento.' : 'Escolha um arquivo ou use o PDF de exemplo. Só seu código será registrado.'}</p>
              {!isExample ? compact : <div className="document-card"><div className="document-preview"><div className="paper"><Icon name="house" className="paper-house" /><div className="paper-line" /><div className="paper-line" /><div className="paper-line short" /><span className="paper-stamp"><Icon name="house" /></span></div><span className="sample-label">DOCUMENTO DE EXEMPLO</span></div><div className="document-info"><div className="document-name"><Icon name="doc" />{sample.tipo}</div><a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir PDF fictício</a></div></div>}
              <div className="file-controls"><label className="file-label" htmlFor="document-file">{file ? 'Trocar arquivo local' : 'Escolher foto ou PDF local'}</label><input ref={input} id="document-file" disabled={registrationBusy || !!pendingHash} className="file-input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={chooseFile} /><span className="file-help">PDF, JPEG ou PNG · sem envio</span>{file && <button className="text-button" disabled={registrationBusy || !!pendingHash} onClick={() => { setReceipt(null); setFile(null); setError(''); if (input.current) input.current.value = ''; }}>Usar exemplo fictício</button>}</div>
              {error && <p className="error-message" role="alert">{error}</p>}
              {facts}
              <PreparationPanel file={file} wallet onRegistered={registered} onBusy={setRegistrationBusy} onPendingHash={setPendingHash} />
              <Note>{file ? 'Seu arquivo fica neste aparelho.' : 'Seu arquivo fica neste aparelho.'}</Note>
            </>}
            {step === 1 && <><span className="role">ETAPA DO CARTÓRIO</span>{title(<>Validação pelo <br />cartório.</>)}<p className="screen-description">Esta etapa apenas ilustra a análise do cartório.</p>{compact}{receipt && <div className="registration-receipt"><a className="text-link" href={explorerUrl(receipt.signature)} target="_blank" rel="noreferrer">Ver transação no explorador Devnet</a><p role="status">Registro confirmado na rede de testes: o código gravado foi conferido.</p><output className="digest">{receipt.hash}</output><p><a className="text-link" href={lookupFragment(receipt.signature)}>Abrir consulta pública</a></p></div>}<span className="status-chip pending">Aguardando validação · simulação</span><div className="validation-card"><div className="validation-symbol"><Icon name="shield" /></div><h3>Análise simulada</h3><p>Continue para comparar uma cópia do documento.</p><span className="field-label">Entidade apresentada na demonstração</span><strong>Cartório de exemplo — simulação</strong></div><Note>Nenhum cartório real analisou este documento.</Note></>}
          </section>}
        </div>
        <footer className="app-footer">{step >= 0 && <button className="text-button switch-profile" disabled={registrationBusy} onClick={() => navigate(-1)}>Trocar perfil</button>}{!exampleMode && publicSignature === null && step !== 0 && <button className="primary" onClick={() => step < 0 ? enter() : step === 1 && receipt ? window.location.hash = lookupFragment(receipt.signature) : navigate(step === 3 ? 2 : step + 1)}><span>{step < 0 ? profile === 'exemplo' ? 'Experimentar com um exemplo' : 'Continuar com o perfil escolhido' : steps[step].action}</span><Icon name="arrow" /></button>}<p>Rede de testes · cartório simulado · arquivo no seu aparelho.</p><div className="home-indicator" aria-hidden="true" /></footer>
      </main><p className="preview-caption">Toque no botão verde para percorrer a demonstração.</p>
    </div>
  </div>;
}

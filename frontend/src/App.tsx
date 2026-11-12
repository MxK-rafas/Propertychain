import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';

const steps = [
  { id: 'cadastro', name: 'Cadastrar documento', subtitle: 'O ponto de partida', action: 'Cadastrar documento' },
  { id: 'validacao', name: 'Validação pelo cartório', subtitle: 'Uma etapa de confiança', action: 'Ver validação simulada' },
  { id: 'consulta', name: 'Verificar documento', subtitle: 'A consulta de quem precisa saber', action: 'Verificar documento' },
  { id: 'resultado', name: 'Resultado da verificação', subtitle: 'A origem e o histórico, juntos', action: 'Fazer nova consulta' },
];
function currentStep() {
  const index = steps.findIndex(step => `#${step.id}` === window.location.hash);
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
  const [step, setStep] = useState(currentStep);
  const [profile, setProfile] = useState('proprietario');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const routeChanged = useRef(false);
  useEffect(() => {
    const change = () => { routeChanged.current = true; setStep(currentStep()); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    document.title = `${step < 0 ? 'Escolher perfil' : steps[step].name} · PropertyChain`;
    if (scroll.current) scroll.current.scrollTop = 0;
    if (routeChanged.current) heading.current?.focus({ preventScroll: true });
  }, [step]);
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
    setFile(selected);
    setError('');
  }
  const fileName = file ? file.name : sample.tipo;
  const facts = !file && <dl className="facts"><div><dt>Imóvel fictício</dt><dd>{sample.endereco}</dd></div><div><dt>Titular apresentado na demonstração</dt><dd>{sample.titular}</dd></div></dl>;
  const compact = <div className="compact-doc"><span className="doc-icon"><Icon name="doc" /></span><div><strong className="file-name">{fileName}</strong><small>{file ? 'Arquivo local · conteúdo não analisado' : `${sample.endereco} · Exemplo fictício`}</small></div></div>;
  const title = (children: React.ReactNode) => <h2 className="screen-title" ref={heading} tabIndex={-1}>{children}</h2>;
  return <div className="studio">
    <aside className="guide" aria-label="Navegação da demonstração">
      <a className="studio-brand" href="#entrada"><span className="brand-mark"><Icon name="house" /></span>PropertyChain</a>
      <div className="guide-content"><span className="eyebrow">DEMONSTRAÇÃO INTERATIVA</span><h1>A história do imóvel, <br /><em>mais clara.</em></h1><p className="guide-intro">Do cadastro à consulta, um caminho simples para verificar a origem de um documento.</p>
        <nav className="steps" aria-label="Etapas"><a href="#entrada" className={step < 0 ? 'active' : ''} aria-current={step < 0 ? 'page' : undefined}><span className="step-number"><Icon name="house" /></span><span><strong>Escolher perfil</strong><small>Como deseja entrar?</small></span></a>{steps.map((item, index) => <a key={item.id} href={`#${item.id}`} className={step === index ? 'active' : ''} aria-current={step === index ? 'step' : undefined}><span className="step-number">0{index + 1}</span><span><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="step-current" aria-hidden="true">↗</span></a>)}</nav>
        <div className="guide-note"><Icon name="info" /><p>Nesta etapa, todas as operações são simuladas.<br />Nenhuma transação é enviada.</p></div>
      </div><span className="guide-footer">PROPERTYCHAIN <span>•</span> ETAPA 2 · TELAS E ARQUIVO LOCAL</span>
    </aside>
    <div className="preview-area"><div className="preview-label"><span className="live-dot" />VISUALIZAÇÃO DO APP<span className="preview-mobile">CELULAR</span></div>
      <main className="phone" aria-label="Aplicativo PropertyChain">
        <header className="app-header"><span className="app-logo"><Icon name="house" /></span><span>Documentos<br /><strong>do imóvel</strong></span><span className="prototype-tag">DEMONSTRAÇÃO</span></header>
        <div className="demo-banner"><span className="demo-dot" />Todas as operações são simuladas</div>
        <div className="screen-scroll" ref={scroll}>
          <div className="screen-top">{step >= 0 && <button className="back-button" aria-label="Voltar à tela anterior" onClick={() => navigate(step === (profile === 'verificador' ? 2 : profile === 'cartorio' ? 1 : 0) ? -1 : step - 1)}><Icon name="back" /></button>}<span>{step < 0 ? 'BOAS-VINDAS' : `ETAPA ${step + 1} DE 4`}</span><div className="progress-bars" aria-hidden="true">{steps.map((item, index) => <i key={item.id} className={index <= step ? 'done' : ''} />)}</div></div>
          <section key={step} className="screen-enter">
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
              <p className="screen-description">{file ? 'Seu arquivo será lido apenas neste dispositivo. Nesta etapa, o cadastro é simulado e nada será enviado.' : 'Vamos usar um documento fictício para você conhecer o caminho do cadastro à verificação.'}</p>
              {file ? compact : <div className="document-card"><div className="document-preview"><div className="paper"><Icon name="house" className="paper-house" /><div className="paper-line" /><div className="paper-line" /><div className="paper-line short" /><span className="paper-stamp"><Icon name="house" /></span></div><span className="sample-label">DOCUMENTO DE EXEMPLO</span></div><div className="document-info"><div className="document-name"><Icon name="doc" />{sample.tipo}</div><a className="text-link" href={samplePdf} target="_blank" rel="noreferrer">Abrir PDF fictício</a></div></div>}
              <div className="file-controls"><label className="file-label" htmlFor="document-file">{file ? 'Trocar arquivo local' : 'Escolher foto ou PDF local'}</label><input ref={input} id="document-file" className="file-input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={chooseFile} /><span className="file-help">PDF, JPEG ou PNG · sem envio</span>{file && <button className="text-button" onClick={() => { setFile(null); setError(''); if (input.current) input.current.value = ''; }}>Usar exemplo fictício</button>}</div>
              {error && <p className="error-message" role="alert">{error}</p>}
              {facts}
              <Note>{file ? 'O app ainda não calcula a impressão digital nem analisa o conteúdo do seu arquivo. Ele fica apenas na memória desta página.' : 'Você pode usar o exemplo ou escolher um arquivo do seu dispositivo, sem enviá-lo a um servidor.'}</Note>
            </>}
            {step === 1 && <><span className="role">ETAPA DO CARTÓRIO</span>{title(<>Validação pelo <br />cartório.</>)}<p className="screen-description">Cadastro simulado. No serviço, esta etapa será realizada pelo cartório.</p>{compact}<span className="status-chip pending">Aguardando validação · simulação</span><div className="validation-card"><div className="validation-symbol"><Icon name="shield" /></div><h3>Uma etapa de confiança</h3><p>Aqui, vamos demonstrar o resultado dessa validação. Depois, você verá a consulta como comprador ou corretor.</p><span className="field-label">Entidade apresentada na demonstração</span><strong>Cartório de exemplo — simulação</strong></div><Note>Nenhum cartório real analisou este documento. Nenhuma transação foi enviada.</Note></>}
            {step === 2 && <><div className="success-notice"><Icon name="info" />Validação pelo cartório apenas simulada.</div><span className="role">COMPRADOR OU CORRETOR</span>{title(<>Conheça a origem <br />do documento.</>)}<p className="screen-description">Veja como será apresentada a consulta. Nesta etapa, não há acesso à blockchain.</p><span className="selection-label">Documento selecionado para a demonstração</span><div className="selected-doc"><div className="selected-doc-top"><Icon name="doc" /><strong className="file-name">{fileName}</strong></div><span className="status-chip">Consulta demonstrativa</span>{facts}</div><div className="consult-list"><p>O que será apresentado</p><ul><li><Icon name="check" />Exemplo de resultado da consulta</li><li><Icon name="check" />Tipo de documento e cartório simulado</li>{!file && <li><Icon name="check" />Titular e histórico inteiramente fictícios</li>}</ul></div><Note>Esta demonstração não confirma autenticidade, correspondência do arquivo ou propriedade.</Note></>}
            {step === 3 && <><div className="result-heading"><span className="result-symbol"><Icon name="info" /></span><div><span className="role">RESULTADO SIMULADO</span>{title(<>Exemplo de <br />resultado.</>)}</div></div><p className="screen-description">Nenhum registro foi consultado na Solana Devnet nesta etapa.</p><span className="status-chip">Arquivo não comparado · simulação</span><div className="result-card">{file ? <><h3>ARQUIVO LOCAL</h3><p className="local-file-name">{fileName}</p><p className="property-address">Conteúdo não analisado. Titular e imóvel não identificados pelo app.</p></> : <><h3>TITULAR APRESENTADO NA DEMONSTRAÇÃO</h3><p className="owner">{sample.titular}</p><p className="property-address">{sample.endereco}<br />Imóvel fictício</p></>}
              <div className="result-origin"><Icon name="doc" /><div><span>Tipo de documento</span><strong>{file ? 'Não identificado pelo app' : sample.tipo}</strong></div></div><div className="result-origin"><Icon name="shield" /><div><span>Validado por</span><strong>Cartório de exemplo — simulação</strong><small>Nenhum cartório real analisou este documento.</small></div></div></div>
              {!file && <section className="history" aria-label="Histórico fictício"><h3>HISTÓRICO FICTÍCIO</h3><ol className="timeline">{[...sample.historico].reverse().map(item => <li key={item.ano}><i className="timeline-point" aria-hidden="true" /><div><strong>{item.titular}</strong><span>{item.ano} · {item.descricao}</span></div></li>)}</ol></section>}
              <Note>Sem valor legal. Não comprova autenticidade ou propriedade. A integração com carteira e rede será feita em outra etapa.</Note>
            </>}
          </section>
        </div>
        <footer className="app-footer">{step >= 0 && <button className="text-button switch-profile" onClick={() => navigate(-1)}>Trocar perfil</button>}<button className="primary" onClick={() => step < 0 ? enter() : navigate(step === 3 ? 2 : step + 1)}><span>{step < 0 ? 'Entrar na demonstração' : steps[step].action}</span><Icon name="arrow" /></button><p>Etapa 2 · simulação · nenhum arquivo ou transação enviado.</p><div className="home-indicator" aria-hidden="true" /></footer>
      </main><p className="preview-caption">Toque no botão verde para percorrer a demonstração.</p>
    </div>
  </div>;
}

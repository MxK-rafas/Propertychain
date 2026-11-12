'use strict';
const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const sample = { owner: 'Maria Oliveira', previousOwner: 'João Oliveira', address: 'Rua das Palmeiras, 120', document: 'Escritura do imóvel', registry: 'Cartório de exemplo' };
const facts = `<dl class="facts"><div><dt>Imóvel</dt><dd>${sample.address}</dd></div><div><dt>Proprietária no documento</dt><dd>${sample.owner}</dd></div></dl>`;
const compactDoc = `<div class="compact-doc"><span class="doc-icon">${icon('doc')}</span><div><strong>${sample.document}</strong><small>${sample.address} · Exemplo</small></div></div>`;
const helper = text => `<div class="helper">${icon('info')}<p>${text}</p></div>`;
const screens = [
  {
    id: 'cadastro', button: 'Cadastrar documento', next: 1,
    note: 'Cadastro demonstrativo. Nenhum arquivo será enviado.',
    content: `<span class="role">PROPRIETÁRIO OU HERDEIRO</span><h2 class="screen-title" tabindex="-1">Cadastre seu<br>documento.</h2><p class="screen-description">Vamos usar um documento fictício para você conhecer o caminho do cadastro à verificação.</p><div class="document-card"><div class="document-preview"><div class="paper">${icon('house').replace('<svg ', '<svg class="paper-house" ')}<div class="paper-line"></div><div class="paper-line"></div><div class="paper-line short"></div><span class="paper-stamp">${icon('house')}</span></div><span class="sample-label">DOCUMENTO DE EXEMPLO</span></div><div class="document-info"><div class="document-name">${icon('doc')}${sample.document}</div><div class="document-subtitle">Arquivo de exemplo · envio simulado</div></div></div>${facts}`
  },
  {
    id: 'validacao', button: 'Ver validação simulada', next: 2,
    note: 'Esta etapa representa a atuação de um cartório.',
    content: `<span class="role">ETAPA DO CARTÓRIO</span><h2 class="screen-title" tabindex="-1">Validação pelo<br>cartório.</h2><p class="screen-description">Documento cadastrado. No serviço, esta etapa será realizada pelo cartório.</p>${compactDoc}<span class="status-chip pending">Aguardando validação</span><div class="validation-card"><div class="validation-symbol">${icon('shield')}</div><h3>Uma etapa de confiança</h3><p>Aqui, vamos demonstrar o resultado dessa validação. Depois, você verá a consulta como comprador ou corretor.</p><span class="field-label">Entidade responsável na demonstração</span><strong>${sample.registry}</strong></div>${helper('A validação é fictícia e serve apenas para demonstrar o caminho do documento.')}`
  },
  {
    id: 'consulta', button: 'Verificar documento', next: 3,
    note: 'Consulta de exemplo, sem acesso a registros reais.',
    content: `<div class="success-notice">${icon('check')}Validação pelo cartório simulada.</div><span class="role">COMPRADOR OU CORRETOR</span><h2 class="screen-title" tabindex="-1">Conheça a origem<br>do documento.</h2><p class="screen-description">Consulte as informações do imóvel a partir do documento validado.</p><span class="selection-label">Documento selecionado para a consulta</span><div class="selected-doc"><div class="selected-doc-top">${icon('doc')}<strong>${sample.document}</strong><span class="radio" aria-hidden="true"></span></div><span class="status-chip">${icon('check')}Validado · simulação</span>${facts}</div><div class="consult-list"><p>O que você vai encontrar</p><ul><li>${icon('check')}Autenticidade e origem do documento</li><li>${icon('check')}Dono atual do imóvel</li><li>${icon('check')}Histórico de transferências</li></ul></div>`
  },
  {
    id: 'resultado', button: 'Fazer nova consulta', next: 2,
    note: 'Resultado ilustrativo. Todas as informações são fictícias.',
    content: `<div class="result-heading"><span class="result-symbol">${icon('check')}</span><div><span class="role">RESULTADO DA CONSULTA</span><h2 class="screen-title" tabindex="-1">Documento<br>verificado.</h2></div></div><p class="screen-description">Origem e titularidade em um só lugar.</p><span class="status-chip">${icon('shield')}Autenticidade confirmada · simulação</span><div class="result-card"><h3>DONO ATUAL DO IMÓVEL</h3><p class="owner">${sample.owner}</p><p class="property-address">${sample.address}<br>Imóvel de exemplo</p><div class="result-origin">${icon('doc')}<div><span>Tipo de documento</span><strong>${sample.document}</strong></div></div><div class="result-origin">${icon('shield')}<div><span>Validado por</span><strong>${sample.registry}</strong><small>Simulação</small></div></div></div><section class="history" aria-label="Histórico fictício de transferências"><h3>HISTÓRICO DE TRANSFERÊNCIAS</h3><ol class="timeline"><li><i class="timeline-point" aria-hidden="true"></i><div><strong>${sample.owner}</strong><span>2024 · Transferência por herança</span></div></li><li><i class="timeline-point" aria-hidden="true"></i><div><strong>${sample.previousOwner}</strong><span>1985 · Titular anterior</span></div></li></ol></section>${helper('Nomes, endereço, datas e histórico foram criados apenas para esta demonstração.')}`
  }
];
let current = 0;
function render() {
  const requested = location.hash.slice(1);
  const index = screens.findIndex(screen => screen.id === requested);
  current = index < 0 ? 0 : index;
  const screen = screens[current];
  const region = document.getElementById('screen');
  region.innerHTML = screen.content;
  region.classList.remove('screen-enter');
  void region.offsetWidth;
  region.classList.add('screen-enter');
  document.getElementById('primary').querySelector('span').textContent = screen.button;
  document.getElementById('footer-note').textContent = screen.note;
  document.getElementById('screen-count').textContent = `ETAPA ${current + 1} DE 4`;
  document.getElementById('back-button').hidden = current === 0;
  document.querySelectorAll('.progress-bars i').forEach((bar, i) => bar.classList.toggle('done', i <= current));
  document.querySelectorAll('[data-step]').forEach((link, i) => {
    link.classList.toggle('active', i === current);
    if (i === current) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  document.getElementById('scroll-region').scrollTop = 0;
  document.title = `${['Cadastrar documento', 'Validação pelo cartório', 'Verificar documento', 'Resultado da verificação'][current]} · Protótipo`;
}
function navigate(index) { location.hash = screens[index].id; }
document.getElementById('primary').addEventListener('click', () => navigate(screens[current].next));
document.getElementById('back-button').addEventListener('click', () => navigate(Math.max(0, current - 1)));
window.addEventListener('hashchange', () => {
  render();
  document.querySelector('.screen-title').focus({ preventScroll: true });
});
render();

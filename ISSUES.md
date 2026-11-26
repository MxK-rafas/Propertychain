# Tarefas e estado do projeto

Atualizado em 26/11/2026. O catálogo abaixo registra o estado conferido no [GitHub](https://github.com/MxK-rafas/Propertychain/issues).

## Prioridades atuais

- MVP aceito na [#6](https://github.com/MxK-rafas/Propertychain/issues/6), incluindo aceite informado do teste com foto real.
- Relatório PDF entregue no PR #57 e aceito na [#56](https://github.com/MxK-rafas/Propertychain/issues/56), fechada. É uma evolução concluída, não uma proposta pendente de Depois.
- [#59](https://github.com/MxK-rafas/Propertychain/issues/59): revisão de estrutura, spec e roadmap solicitada antes do pitch; evidências em [revisão de entregas](docs/REVISAO_DE_ENTREGAS.md).
- A preparação para o Demo Day ([#7](https://github.com/MxK-rafas/Propertychain/issues/7)) foi entregue com dez slides e notas. O [roteiro e as respostas para a banca](docs/PITCH_DEMO_DAY.md) fazem parte da documentação. A realização da apresentação e o ensaio do autor ainda não foram confirmados.
- O [exemplo guiado e a revisão de linguagem](docs/FEEDBACKS_E_EXEMPLO_GUIADO.md) foram entregues na [#61](https://github.com/MxK-rafas/Propertychain/issues/61). O autor confirmou o funcionamento do percurso completo no computador e no celular. A próxima rodada com usuários vai avaliar a clareza da nova redação.

## Catálogo original de 41 tarefas

Os arquivos em `issues/` preservam a conciliação de 12/11/2026 e as descrições anteriores, inclusive tarefas EVM. Eles não são uma fila automática de código. Fonte operacional atual: [SPEC.md](SPEC.md); prioridades: [ROADMAP.md](ROADMAP.md); instruções: [AGENTS.md](AGENTS.md).

**Atual** identifica escopo do MVP original; **Fechada** é o estado da issue, não garantia de que todos os textos históricos ainda descrevem o app. O histórico de titulares da #26 pertence à referência visual preservada; a consulta pública atual não apresenta titular ou histórico. As questões em **Depois**, **Fora do MVP** e **Legado EVM** não devem ser retomadas por inferência. Apresentação da #7 foi autorizada expressamente pelo autor e não altera funcionalidades.

| Kit | GitHub | Enquadramento | Estado no GitHub | Escopo |
|---|---|---|---|---|
| 01 | [#2](https://github.com/MxK-rafas/Propertychain/issues/2) | Atual | Fechada | [Consolidar o repositório único do PropertyChain](issues/01-criar-o-repositorio-e-a-estrutura-inicial.md) |
| 02 | [#8](https://github.com/MxK-rafas/Propertychain/issues/8) | Atual | Fechada | [Documentar limites e privacidade do MVP](issues/02-documentar-escopo-e-limites-juridicos.md) |
| 03 | [#9](https://github.com/MxK-rafas/Propertychain/issues/9) | Fonte preservada | Fechada | [Ficha e Lean Canvas do projeto](issues/03-transcrever-a-ficha-do-projeto-e-o-lean-canvas-par.md) |
| 04 | [#10](https://github.com/MxK-rafas/Propertychain/issues/10) | Atual | Fechada | [Personas e histórias do MVP atual](issues/04-definir-personas-e-user-stories.md) |
| 05 | [#11](https://github.com/MxK-rafas/Propertychain/issues/11) | Atual | Fechada | [Arquitetura Solana e fontes de informação](issues/05-definir-arquitetura-modelo-de-dados-e-eventos.md) |
| 06 | [#12](https://github.com/MxK-rafas/Propertychain/issues/12) | Atual | Fechada | [Preparar ambiente Solana Devnet e Phantom](issues/06-configurar-o-ambiente-de-desenvolvimento.md) |
| 07 | [#13](https://github.com/MxK-rafas/Propertychain/issues/13) | Atual | Fechada | [CI: preservar legado e preparar verificações do frontend](issues/07-configurar-integracao-continua-github-actions.md) |
| 08 | [#14](https://github.com/MxK-rafas/Propertychain/issues/14) | Legado EVM | Fechada | [Contrato: estrutura base e controle de acesso](issues/08-contrato-estrutura-base-e-controle-de-acesso.md) |
| 09 | [#15](https://github.com/MxK-rafas/Propertychain/issues/15) | Legado EVM | Fechada | [Contrato: submeter documento](issues/09-contrato-submeter-documento.md) |
| 10 | [#16](https://github.com/MxK-rafas/Propertychain/issues/16) | Legado EVM | Fechada | [Contrato: validar e rejeitar documento](issues/10-contrato-validar-e-rejeitar-documento.md) |
| 11 | [#17](https://github.com/MxK-rafas/Propertychain/issues/17) | Legado EVM | Fechada | [Contrato: revogar documento](issues/11-contrato-revogar-documento.md) |
| 12 | [#1](https://github.com/MxK-rafas/Propertychain/issues/1) | Legado EVM | Fechada | [Contrato: atestar titular de um imóvel](issues/12-contrato-atestar-titular-de-um-imovel.md) |
| 13 | [#18](https://github.com/MxK-rafas/Propertychain/issues/18) | Legado EVM | Fechada | [Contrato: funções de consulta](issues/13-contrato-funcoes-de-consulta.md) |
| 14 | [#19](https://github.com/MxK-rafas/Propertychain/issues/19) | Legado EVM | Fechada | [Contrato: testes unitários](issues/14-contrato-testes-unitarios.md) |
| 15 | [#20](https://github.com/MxK-rafas/Propertychain/issues/20) | Atual | Fechada | [Solana Devnet: registrar hash com Memo e Phantom](issues/15-deploy-do-contrato-na-sepolia.md) |
| 16 | [#21](https://github.com/MxK-rafas/Propertychain/issues/21) | Atual | Fechada | [Frontend: preparar React, TypeScript e Vite](issues/16-frontend-setup-do-projeto.md) |
| 17 | [#22](https://github.com/MxK-rafas/Propertychain/issues/22) | Atual | Fechada | [Frontend: Phantom e rede Solana Devnet](issues/17-frontend-conectar-carteira-e-detectar-rede.md) |
| 18 | [#23](https://github.com/MxK-rafas/Propertychain/issues/23) | Atual | Fechada | [Frontend: SHA-256 local do exemplo ou foto](issues/18-frontend-calcular-o-hash-do-arquivo-no-navegador.md) |
| 19 | [#24](https://github.com/MxK-rafas/Propertychain/issues/24) | Atual | Fechada | [Frontend: tela 1 de cadastro](issues/19-frontend-tela-de-cadastrar-documento.md) |
| 20 | [#25](https://github.com/MxK-rafas/Propertychain/issues/25) | Atual | Fechada | [Frontend: consulta pública e resultado](issues/20-frontend-tela-publica-de-verificacao.md) |
| 21 | [#26](https://github.com/MxK-rafas/Propertychain/issues/26) | Referência visual preservada | Fechada | [Frontend: histórico fictício apenas do exemplo](issues/21-frontend-historico-do-imovel-linha-do-tempo.md) |
| 22 | [#27](https://github.com/MxK-rafas/Propertychain/issues/27) | Depois | Aberta | [Armazenamento remoto de documentos](issues/22-armazenamento-off-chain-opcional-ipfs-com-criptogr.md) |
| 23 | [#28](https://github.com/MxK-rafas/Propertychain/issues/28) | Atual | Fechada | [Frontend: tela 2 com cartório simulado](issues/23-frontend-painel-do-validador-cartorio-simulado.md) |
| 24 | [#29](https://github.com/MxK-rafas/Propertychain/issues/29) | Fora do MVP | Aberta | [Atestação de titular e transferência documental](issues/24-fluxo-de-atestacao-de-titular-e-transferencia-docu.md) |
| 25 | [#30](https://github.com/MxK-rafas/Propertychain/issues/30) | Fora do MVP | Aberta | [Identificador de imóvel por matrícula e salt](issues/25-identificador-opaco-do-imovel-sem-dados-pessoais.md) |
| 26 | [#31](https://github.com/MxK-rafas/Propertychain/issues/31) | Atual | Fechada | [Link de consulta em outro celular, sem carteira](issues/26-link-e-qr-code-de-verificacao.md) |
| 27 | [#32](https://github.com/MxK-rafas/Propertychain/issues/32) | Atual | Fechada | [Revisar escrita e verificação Solana](issues/27-revisao-de-seguranca-do-contrato.md) |
| 28 | [#33](https://github.com/MxK-rafas/Propertychain/issues/33) | Atual | Fechada | [Privacidade do teste com foto real](issues/28-analise-de-lgpd-e-privacidade.md) |
| 29 | [#34](https://github.com/MxK-rafas/Propertychain/issues/34) | Atual | Fechada | [Testar fluxo e consulta de 1–5 segundos](issues/29-testes-ponta-a-ponta-do-fluxo-principal.md) |
| 30 | [#35](https://github.com/MxK-rafas/Propertychain/issues/35) | Atual | Fechada | [Acessibilidade e português simples](issues/30-acessibilidade-e-linguagem-simples.md) |
| 31 | [#3](https://github.com/MxK-rafas/Propertychain/issues/3) | Atual | Fechada | [Estados de transação e erros em português](issues/31-estados-de-transacao-e-tratamento-de-erros.md) |
| 32 | [#4](https://github.com/MxK-rafas/Propertychain/issues/4) | Atual | Fechada | [Publicar o frontend na Vercel](issues/32-deploy-do-frontend.md) |
| 33 | [#5](https://github.com/MxK-rafas/Propertychain/issues/5) | Atual | Fechada | [Documentar a entrega conforme a spec atual](issues/33-documentacao-final.md) |
| 34 | [#6](https://github.com/MxK-rafas/Propertychain/issues/6) | Atual | Fechada | [Modelo fictício e teste local com foto real](issues/34-cenario-de-demonstracao-e-dados-de-seed.md) |
| 35 | [#7](https://github.com/MxK-rafas/Propertychain/issues/7) | Material de apresentação entregue | Fechada | [Pitch e preparação para a banca](issues/35-pitch-e-preparacao-para-a-banca.md) |
| 36 | [#36](https://github.com/MxK-rafas/Propertychain/issues/36) | Documentação entregue | Fechada | [Retrospectiva e trabalhos futuros](issues/36-retrospectiva-e-trabalhos-futuros.md) |
| 37 | [#37](https://github.com/MxK-rafas/Propertychain/issues/37) | Atual | Fechada | [Frontend: ler transação e Memo na Solana](issues/37-frontend-camada-de-leitura-e-eventos-da-blockchain.md) |
| 38 | [#38](https://github.com/MxK-rafas/Propertychain/issues/38) | Atual | Fechada | [Avisos e linguagem do resultado](issues/38-frontend-aviso-legal-global-e-revisao-de-linguagem.md) |
| 39 | [#39](https://github.com/MxK-rafas/Propertychain/issues/39) | Legado EVM | Aberta | [Ambiente local Hardhat e seed](issues/39-ambiente-local-hardhat-node-e-seed-de-desenvolvimento.md) |
| 40 | [#40](https://github.com/MxK-rafas/Propertychain/issues/40) | Fora do MVP | Aberta | [Busca de imóvel por matrícula e salt](issues/40-frontend-busca-de-imovel-por-matricula-e-salt.md) |
| 41 | [#41](https://github.com/MxK-rafas/Propertychain/issues/41) | Fora do MVP | Aberta | [Plano B de vídeo e capturas](issues/41-plano-b-da-demonstracao-video-e-capturas.md) |

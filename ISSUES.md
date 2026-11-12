# Tarefas conciliadas com o MVP atual

As 41 tarefas originais continuam rastreáveis. Nomes dos arquivos preservam o ID do kit, e os links usam o número real no GitHub. O enquadramento abaixo substitui o plano antigo de Sepolia. O estado histórico aberto/fechado não é prova de que o novo requisito Solana foi entregue.

**Atual:** pertence ao MVP, com implementação ainda sujeita às etapas da spec. **Legado EVM:** código/trabalho anterior preservado e fora do caminho crítico. **Fonte preservada:** material de negócio mantido. **Depois/Fora do MVP:** não implementar nesta versão.

Fonte operacional: [SPEC.md](SPEC.md). Trabalho pelo Codex: [AGENTS.md](AGENTS.md). Seguir as seis etapas de [ROADMAP.md](ROADMAP.md), não as dependências antigas ocultas no histórico.

| Kit | GitHub | Enquadramento atual | Escopo |
|---|---|---|---|
| 01 | [#2](https://github.com/MxK-rafas/Propertychain/issues/2) | Atual | [Consolidar o repositório único do PropertyChain](issues/01-criar-o-repositorio-e-a-estrutura-inicial.md) |
| 02 | [#8](https://github.com/MxK-rafas/Propertychain/issues/8) | Atual | [Documentar limites e privacidade do MVP](issues/02-documentar-escopo-e-limites-juridicos.md) |
| 03 | [#9](https://github.com/MxK-rafas/Propertychain/issues/9) | Fonte preservada | [Ficha e Lean Canvas do projeto](issues/03-transcrever-a-ficha-do-projeto-e-o-lean-canvas-par.md) |
| 04 | [#10](https://github.com/MxK-rafas/Propertychain/issues/10) | Atual | [Personas e histórias do MVP atual](issues/04-definir-personas-e-user-stories.md) |
| 05 | [#11](https://github.com/MxK-rafas/Propertychain/issues/11) | Atual | [Arquitetura Solana e fontes de informação](issues/05-definir-arquitetura-modelo-de-dados-e-eventos.md) |
| 06 | [#12](https://github.com/MxK-rafas/Propertychain/issues/12) | Atual | [Preparar ambiente Solana Devnet e Phantom](issues/06-configurar-o-ambiente-de-desenvolvimento.md) |
| 07 | [#13](https://github.com/MxK-rafas/Propertychain/issues/13) | Atual | [CI: preservar legado e preparar verificações do frontend](issues/07-configurar-integracao-continua-github-actions.md) |
| 08 | [#14](https://github.com/MxK-rafas/Propertychain/issues/14) | Legado EVM | [Contrato: estrutura base e controle de acesso](issues/08-contrato-estrutura-base-e-controle-de-acesso.md) |
| 09 | [#15](https://github.com/MxK-rafas/Propertychain/issues/15) | Legado EVM | [Contrato: submeter documento](issues/09-contrato-submeter-documento.md) |
| 10 | [#16](https://github.com/MxK-rafas/Propertychain/issues/16) | Legado EVM | [Contrato: validar e rejeitar documento](issues/10-contrato-validar-e-rejeitar-documento.md) |
| 11 | [#17](https://github.com/MxK-rafas/Propertychain/issues/17) | Legado EVM | [Contrato: revogar documento](issues/11-contrato-revogar-documento.md) |
| 12 | [#1](https://github.com/MxK-rafas/Propertychain/issues/1) | Legado EVM | [Contrato: atestar titular de um imóvel](issues/12-contrato-atestar-titular-de-um-imovel.md) |
| 13 | [#18](https://github.com/MxK-rafas/Propertychain/issues/18) | Legado EVM | [Contrato: funções de consulta](issues/13-contrato-funcoes-de-consulta.md) |
| 14 | [#19](https://github.com/MxK-rafas/Propertychain/issues/19) | Legado EVM | [Contrato: testes unitários](issues/14-contrato-testes-unitarios.md) |
| 15 | [#20](https://github.com/MxK-rafas/Propertychain/issues/20) | Atual | [Solana Devnet: registrar hash com Memo e Phantom](issues/15-deploy-do-contrato-na-sepolia.md) |
| 16 | [#21](https://github.com/MxK-rafas/Propertychain/issues/21) | Atual | [Frontend: preparar React, TypeScript e Vite](issues/16-frontend-setup-do-projeto.md) |
| 17 | [#22](https://github.com/MxK-rafas/Propertychain/issues/22) | Atual | [Frontend: Phantom e rede Solana Devnet](issues/17-frontend-conectar-carteira-e-detectar-rede.md) |
| 18 | [#23](https://github.com/MxK-rafas/Propertychain/issues/23) | Atual | [Frontend: SHA-256 local do exemplo ou foto](issues/18-frontend-calcular-o-hash-do-arquivo-no-navegador.md) |
| 19 | [#24](https://github.com/MxK-rafas/Propertychain/issues/24) | Atual | [Frontend: tela 1 de cadastro](issues/19-frontend-tela-de-cadastrar-documento.md) |
| 20 | [#25](https://github.com/MxK-rafas/Propertychain/issues/25) | Atual | [Frontend: consulta pública e resultado](issues/20-frontend-tela-publica-de-verificacao.md) |
| 21 | [#26](https://github.com/MxK-rafas/Propertychain/issues/26) | Atual | [Frontend: histórico fictício apenas do exemplo](issues/21-frontend-historico-do-imovel-linha-do-tempo.md) |
| 22 | [#27](https://github.com/MxK-rafas/Propertychain/issues/27) | Depois | [Armazenamento remoto de documentos](issues/22-armazenamento-off-chain-opcional-ipfs-com-criptogr.md) |
| 23 | [#28](https://github.com/MxK-rafas/Propertychain/issues/28) | Atual | [Frontend: tela 2 com cartório simulado](issues/23-frontend-painel-do-validador-cartorio-simulado.md) |
| 24 | [#29](https://github.com/MxK-rafas/Propertychain/issues/29) | Fora do MVP | [Atestação de titular e transferência documental](issues/24-fluxo-de-atestacao-de-titular-e-transferencia-docu.md) |
| 25 | [#30](https://github.com/MxK-rafas/Propertychain/issues/30) | Fora do MVP | [Identificador de imóvel por matrícula e salt](issues/25-identificador-opaco-do-imovel-sem-dados-pessoais.md) |
| 26 | [#31](https://github.com/MxK-rafas/Propertychain/issues/31) | Atual | [Link de consulta em outro celular, sem carteira](issues/26-link-e-qr-code-de-verificacao.md) |
| 27 | [#32](https://github.com/MxK-rafas/Propertychain/issues/32) | Atual | [Revisar escrita e verificação Solana](issues/27-revisao-de-seguranca-do-contrato.md) |
| 28 | [#33](https://github.com/MxK-rafas/Propertychain/issues/33) | Atual | [Privacidade do teste com foto real](issues/28-analise-de-lgpd-e-privacidade.md) |
| 29 | [#34](https://github.com/MxK-rafas/Propertychain/issues/34) | Atual | [Testar fluxo e consulta de 1–5 segundos](issues/29-testes-ponta-a-ponta-do-fluxo-principal.md) |
| 30 | [#35](https://github.com/MxK-rafas/Propertychain/issues/35) | Atual | [Acessibilidade e português simples](issues/30-acessibilidade-e-linguagem-simples.md) |
| 31 | [#3](https://github.com/MxK-rafas/Propertychain/issues/3) | Atual | [Estados de transação e erros em português](issues/31-estados-de-transacao-e-tratamento-de-erros.md) |
| 32 | [#4](https://github.com/MxK-rafas/Propertychain/issues/4) | Atual | [Publicar o frontend na Vercel](issues/32-deploy-do-frontend.md) |
| 33 | [#5](https://github.com/MxK-rafas/Propertychain/issues/5) | Atual | [Documentar a entrega conforme a spec atual](issues/33-documentacao-final.md) |
| 34 | [#6](https://github.com/MxK-rafas/Propertychain/issues/6) | Atual | [Modelo fictício e teste local com foto real](issues/34-cenario-de-demonstracao-e-dados-de-seed.md) |
| 35 | [#7](https://github.com/MxK-rafas/Propertychain/issues/7) | Fora do MVP | [Pitch e preparação para a banca](issues/35-pitch-e-preparacao-para-a-banca.md) |
| 36 | [#36](https://github.com/MxK-rafas/Propertychain/issues/36) | Fora do MVP | [Retrospectiva e trabalhos futuros](issues/36-retrospectiva-e-trabalhos-futuros.md) |
| 37 | [#37](https://github.com/MxK-rafas/Propertychain/issues/37) | Atual | [Frontend: ler transação e Memo na Solana](issues/37-frontend-camada-de-leitura-e-eventos-da-blockchain.md) |
| 38 | [#38](https://github.com/MxK-rafas/Propertychain/issues/38) | Atual | [Avisos e linguagem do resultado](issues/38-frontend-aviso-legal-global-e-revisao-de-linguagem.md) |
| 39 | [#39](https://github.com/MxK-rafas/Propertychain/issues/39) | Legado EVM | [Ambiente local Hardhat e seed](issues/39-ambiente-local-hardhat-node-e-seed-de-desenvolvimento.md) |
| 40 | [#40](https://github.com/MxK-rafas/Propertychain/issues/40) | Fora do MVP | [Busca de imóvel por matrícula e salt](issues/40-frontend-busca-de-imovel-por-matricula-e-salt.md) |
| 41 | [#41](https://github.com/MxK-rafas/Propertychain/issues/41) | Fora do MVP | [Plano B de vídeo e capturas](issues/41-plano-b-da-demonstracao-video-e-capturas.md) |

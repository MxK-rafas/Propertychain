# Integração contínua e limites da evidência

Atualizado em 24/11/2026. Workflow: [.github/workflows/ci.yml](../.github/workflows/ci.yml), executado em PRs e push na main, com Node 22 e lockfiles separados.

| Job (nome atual no GitHub) | Diretório | Verificações |
|---|---|---|
| Frontend (telas e arquivo local) | `frontend` | `npm ci`, `npm test` e `npm run build`, incluindo TypeScript |
| Contratos legados (EVM) | `contracts` | Instalação, compilação, testes, cobertura mínima de 90% por contrato, recompilação e teste local de deploy/seed |

O nome do job frontend é histórico, mas sua suíte atual tem **100 testes em dez arquivos**: perfis/rotas, SHA-256, Phantom controlada, preparação/assinatura/envio e conferência, referências de consulta, comparação, relatório PDF e exemplo guiado (integridade da fixture, leitura real via serviço mockado, percurso completo, três comparações, erros/retentativa/cancelamento, retorno/reinício, comprovante real preservado e ajuda Phantom). A contagem foi reproduzida nesta revisão, não é uma quantidade fixa no workflow.

Os testes de assinatura usam chaves efêmeras e mocks de carteira/RPC. Não pedem fundos, segredos ou carteira real. Fixtures são fictícias. A suíte não substitui o teste do autor na Phantom real, os registros públicos de demonstração ou a confirmação de publicação.

O job EVM não é dependência de build da Vercel e não comprova Solana, carteira ou velocidade. Não alterar nomes de checks por motivo cosmético sem considerar eventual configuração administrativa de proteção; esta revisão preserva o workflow.

## Reproduzir

Frontend, em `frontend`: `npm ci`, `npm test`, `npm run build`.

Legado opcional, em `contracts`: `npm ci`, `npm run compile`, `npm test`, `npm run coverage`, `npm run coverage:check`, `npm run compile -- --force`, `npm run test:local`. O teste local requer porta 8545 livre; não inicia o app Solana.

O workflow não passa variáveis de carteira pública ou chave privada. Não anexar documentos pessoais a artefatos. Um status de Vercel bem-sucedido deve ser complementado com abertura do app público. [Revisão de entregas](REVISAO_DE_ENTREGAS.md).

# Integração contínua

O workflow `.github/workflows/ci.yml` executa em todo Pull Request e em pushes para `main`. Usa Node.js 22, permissões de leitura e um limite de dez minutos. Não recebe chaves privadas nem usa Sepolia.

O job **Contratos** instala as dependências com `npm ci`, compila, executa os testes unitários, gera a cobertura e exige **90% de linhas por contrato**. Em seguida recompila os artefatos sem instrumentação e testa o fluxo de deploy e seed contra um nó Hardhat real via RPC. O relatório de cobertura é anexado como artefato `cobertura-contratos`.

Para reproduzir em `contracts/`:

```bash
npm ci
npm run compile
npm test
npm run coverage
npm run coverage:check
npm run compile -- --force
npm run test:local
```

A porta 8545 precisa estar livre para a última etapa. O comando `coverage:check` falha se faltar relatório, faltar algum contrato no relatório ou a cobertura de linhas estiver abaixo de 90%. Lint do frontend deve ser adicionado quando o frontend existir (#21).

## Exigir o resultado antes de mesclar (#13)

O workflow executa os checks; a proteção de branch impede o merge quando eles falham. A integração GitHub desta sessão retornou `403 Resource not accessible by integration` ao consultar a proteção, portanto não foi possível verificar ou alterar sua configuração. A issue #13 permanece aberta nessa parte.

Uma conta com acesso administrativo deve conferir em **Settings → Branches → proteção de main** (ou em um ruleset equivalente):

1. Exigir Pull Request para alterações na `main`.
2. Exigir status checks antes de mesclar e selecionar **Contratos**, do app GitHub Actions, depois da primeira execução.
3. Exigir branch atualizada e impedir bypass para quem também deve respeitar a regra.

Preserve outras proteções já existentes. Esta revisão não habilita auto-merge nem mescla o PR. Sem essa regra, um usuário com permissão de escrita ainda pode mesclar um PR com check vermelho.

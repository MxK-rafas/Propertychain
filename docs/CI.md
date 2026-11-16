> **Atualização — etapa 2:** frontend React/TypeScript/Vite, quatro telas, seleção local, scripts, lockfile e nove testes implementados. Operações ainda simuladas; Phantom, SHA-256, transação/consulta Solana e publicação Vercel continuam pendentes. Aguardar o teste do autor. Ver [frontend/README.md](../frontend/README.md). Notas abaixo sobre frontend inexistente descrevem o estado anterior à etapa 2.

# Integração contínua e limites da evidência

O workflow [.github/workflows/ci.yml](../.github/workflows/ci.yml) mantém o job **Contratos legados (EVM)**: Node.js 22, instalação, compilação, testes, cobertura mínima de 90% por contrato e teste local de deploy/seed. Nenhuma carteira pública ou chave privada é usada.

O código Solidity permanece preservado. Esse job testa somente o legado Hardhat, **não** Phantom, Solana, Memo, velocidade de consulta ou publicação Vercel. Não é critério suficiente de entrega do MVP atual.

O job Frontend (telas e arquivo local) executa npm ci, nove testes e npm run build (incluindo TypeScript), usando frontend/package-lock.json. Os testes novos devem usar arquivos fictícios; nunca anexar foto real a Actions ou artefatos.

## Reproduzir o legado (opcional)

Em `contracts/`, usando o lockfile já versionado:

```bash
npm ci
npm run compile
npm test
npm run coverage
npm run coverage:check
npm run compile -- --force
npm run test:local
```

A porta 8545 precisa estar livre para o último passo. Isso não instala nem inicia um app Solana.

Proteção da main e exigência administrativa de checks não foram modificadas nesta consolidação. A implementação futura deve ser validada com os critérios da [spec](../SPEC.md) e do [plano de testes](PLANO_DE_TESTES.md).

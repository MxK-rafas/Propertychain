# Integração contínua e limites da evidência

O workflow [.github/workflows/ci.yml](../.github/workflows/ci.yml) mantém o job **Contratos legados (EVM)**: Node.js 22, instalação, compilação, testes, cobertura mínima de 90% por contrato e teste local de deploy/seed. Nenhuma carteira pública ou chave privada é usada.

O código Solidity permanece preservado. Esse job testa somente o legado Hardhat, **não** Phantom, Solana, Memo, velocidade de consulta ou publicação Vercel. Não é critério suficiente de entrega do MVP atual.

Na etapa 2 da [spec](../SPEC.md), quando existirem package.json e lockfile no frontend, adicionar verificações de tipos, testes relevantes e build do app. Não adicionar agora um job que falha por chamar scripts inexistentes. Os testes novos devem usar arquivos fictícios; nunca anexar foto real a Actions ou artefatos.

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

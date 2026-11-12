# ADR 0008 — Solana Devnet, Memo e MVP de quatro telas

Data: 12/11/2026. Estado: decisão de produto confirmada pelo autor; implementação funcional pendente.

## Contexto

O repositório tinha código EVM/Solidity, mas o frontend estava vazio. No chat, o autor escolheu Solana Devnet, Phantom, uma carteira, cartório simulado, exemplo fixo e consulta em outro celular sem carteira. Depois autorizou foto real para testes locais, GitHub/Vercel e meta de leitura de 1–5 segundos.

## Decisão

Adotar [SPEC.md](../../SPEC.md) como fonte de verdade. Frontend React/TypeScript/Vite a implementar; usar Solana AI Kit, @solana/kit e Wallet Phantom após conferir compatibilidade atual. Registrar SHA-256 no programa Memo existente (`propertychain:v1:sha256:<hash>`), sem programa próprio ou atestação de titular.

Uma carteira assina na Phantom; nenhuma chave privada é solicitada. Consulta usa assinatura da transação, sem carteira e sem dependência do navegador de origem. Foto é lida apenas localmente; comparar bytes idênticos, sem OCR. Nomes/histórico são fictícios, nunca extraídos automaticamente do arquivo real.

## Consequências

As ADRs 0002, 0003, 0005, 0006 e 0007 deixam de orientar o MVP; React/Vite é preservado, ethers é substituído. ADR 0001 (hash local) e 0004 (sem token) seguem compatíveis. Contratos/testes EVM permanecem como legado, fora da build Vercel. Nenhuma migração funcional é declarada apenas por atualizar documentação.

O objetivo de 1–5 segundos vale para leitura de registro já confirmado; não garante tempo de ação humana ou consenso da rede. Validação institucional e propriedade continuam fora do que a blockchain demonstra nesta versão.

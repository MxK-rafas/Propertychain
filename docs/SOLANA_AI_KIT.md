# Solana AI Kit e bibliotecas utilizadas

Revisão de 24/11/2026. O [Solana AI Kit](https://github.com/solanabr/ai-kit) orientou a implementação em [modo sem instalação](https://github.com/solanabr/ai-kit/blob/main/docs/install.md#no-install-read-the-kit-from-aikitsuperteamcodes). Não é dependência runtime, carteira de servidor ou Solana Agent Kit. Nenhum instalador, hook ou configuração externa foi adotado por esse uso.

## Implementação entregue

- @solana/kit **8.6.0**: endereços, RPC, compilação/serialização v0 e conferência de assinatura.
- @wallet-standard/app **1.1.1**: localizar a Phantom para `solana:signTransaction` com cadeia `solana:devnet`.
- O provedor oficial Phantom faz conexão/desconexão e eventos de conta, em `preparation.ts` e `PreparationPanel.tsx`.
- `memo.ts` prepara uma instrução Compute Budget de preço de prioridade zero e uma instrução Memo com o SHA-256. Verifica mensagem, assinatura, prazo e simulação; não transfere SOL a terceiros.
- A leitura aceita também registros anteriores de apenas Memo, exige sucesso e programa/formato esperados e não usa logs arbitrários como prova.
- `memo-record.ts` guarda apenas comprovante público de tentativa pendente; não há chave, carteira de servidor ou reenvio automático.
- PDF é uma camada local separada, com pdf-lib **1.17.1** sob demanda; não é recurso do AI Kit.

A conexão confere o RPC Devnet e não identifica nem altera a seleção de rede da UI Phantom. Há taxa em SOL de teste. Leitores e usuários do relatório não precisam conectar carteira.

## Referências consultadas na implementação

Consulta inicial em 16/11/2026, ampliada no desenvolvimento da transação. Esta revisão confere o uso no código e lockfile, sem propor atualização de SDK.

- [Hub do AI Kit](https://github.com/solanabr/ai-kit/blob/main/.claude/skills/SKILL.md) e [engenharia frontend](https://github.com/solanabr/ai-kit/blob/main/.claude/agents/solana-frontend-engineer.md).
- [Solana Foundation skill](https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/SKILL.md) e [referência frontend](https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/references/frontend.md).
- [Provedor Phantom](https://docs.phantom.com/solana/integrating-phantom), [conexão](https://docs.phantom.com/solana/establishing-a-connection) e [Wallet Standard](https://docs.phantom.com/development-powertools/solana-wallet-standard).
- [Template Solana Kit + Wallet Standard](https://solana.com/developers/templates/typescript-kit-minimal), [transações Kit](https://www.solanakit.com/docs/advanced-guides/transactions) e [RPC de desenvolvimento](https://solana.com/developers/cookbook/development/connect-environment).

Referências não comprovam execução real. As evidências de código, testes, transação pública e aceite do autor estão separadas na [revisão](REVISAO_DE_ENTREGAS.md).

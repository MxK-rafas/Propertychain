# Solana AI Kit — referências da etapa 3

Consulta em 16/11/2026. O [Solana AI Kit](https://github.com/solanabr/ai-kit) foi usado em [modo sem instalação](https://github.com/solanabr/ai-kit/blob/main/docs/install.md#no-install-read-the-kit-from-aikitsuperteamcodes), sem substituir AGENTS.md, instalar MCPs/hooks, copiar configs ou executar instaladores externos. É uma camada de orientação para agentes, não uma biblioteca runtime que exige carteira de servidor. Não confundir com Solana Agent Kit.

Referências lidas: [hub do kit](https://github.com/solanabr/ai-kit/blob/main/.claude/skills/SKILL.md), [engenharia frontend](https://github.com/solanabr/ai-kit/blob/main/.claude/agents/solana-frontend-engineer.md), [Solana Foundation skill](https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/SKILL.md) e [frontend/Kit](https://github.com/solana-foundation/solana-dev-skill/blob/main/skills/solana-dev/references/frontend.md).

Implementação desta etapa: Kit 8.6.0 (versão conferida no registry), endereço tipado e RPC somente leitura carregados sob demanda; integração Phantom direta conforme [documentação oficial](https://docs.phantom.com/solana/integrating-phantom), isolada em preparation.ts. O guia geral recomenda Wallet Standard/Kit plugins para clientes completos; esta etapa usa a API oficial específica da única carteira aprovada, sem wallet-adapter/web3.js, e ainda não implementa pipeline de transação.

Aplicados: somente Devnet, conferência do genesis, zero chave/seed no projeto, nenhuma assinatura ou escrita neste bloco, estados claros de espera/recusa e invalidação após trocar conta/arquivo. A conexão ao provedor não é prova de rede selecionada na UI Phantom; o indicador do app se refere ao RPC validado.

Documentação de conexão: [Phantom](https://docs.phantom.com/solana/establishing-a-connection); RPC/Kit: [Solana](https://solana.com/developers/cookbook/development/connect-environment). O uso destas referências não comprova teste real da carteira do autor; esse aceite é separado.

## Etapa 4

Mantido o modo sem instalação. Kit compila mensagem v0 curta com uma instrução Memo (sem transferências/lookup tables). A assinatura usa Wallet Standard `solana:signTransaction` da Phantom com cadeia solana:devnet. A versão v0 é escolhida para compatibilidade com a carteira existente; não há necessidade de mensagens grandes v1 neste recorte. O cliente verifica bytes e assinatura, simula antes da aprovação, impede envio duplicado e distingue resposta incerta de confirmação. Fontes: [template oficial Solana Kit + Wallet Standard](https://solana.com/developers/templates/typescript-kit-minimal), [Wallet Standard/Phantom](https://docs.phantom.com/development-powertools/solana-wallet-standard) e [transações Kit](https://www.solanakit.com/docs/advanced-guides/transactions).

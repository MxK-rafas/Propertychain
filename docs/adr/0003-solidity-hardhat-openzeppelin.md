> **SUBSTITUÍDA para o MVP atual** pela [ADR 0008](0008-solana-devnet-mvp.md) e [SPEC.md](../../SPEC.md). Conteúdo abaixo preservado como histórico da fase EVM, sem autorizar sua implementação no app Solana.

# ADR 0003 · Solidity, Hardhat e OpenZeppelin AccessControl

**Status:** Proposto

## Contexto
É preciso controle de acesso (o cartório simulado) e um ambiente de testes e deploy conhecido, com boa documentação.

## Decisão
Contrato `DocumentRegistry` em Solidity, desenvolvido e testado com Hardhat, usando `AccessControl` da OpenZeppelin com os papéis `DEFAULT_ADMIN_ROLE` e `VALIDATOR_ROLE`.

## Consequências
- Papéis auditados e padronizados, em vez de lógica própria de permissão.
- O admin concede e revoga o papel de validador; a carteira admin precisa de guarda cuidadosa.
- Contrato não atualizável (sem proxy) para manter o protótipo simples; mudanças exigem novo deploy.


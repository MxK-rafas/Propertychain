# [Legado EVM] Contrato: estrutura base e controle de acesso

Issue GitHub: [#14](https://github.com/MxK-rafas/Propertychain/issues/14). ID original do kit: 08. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

AccessControl/DocumentRegistry Solidity foi implementado na fase anterior; conservar como histórico.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Código preservado, sem integração com MVP Solana e sem portar o sistema de papéis nesta versão.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Base do contrato `DocumentRegistry` com papéis. O papel VALIDATOR representa o cartório simulado.

## Tarefas
- [x] Criar projeto Hardhat e o contrato `DocumentRegistry.sol`
- [x] Usar `AccessControl` da OpenZeppelin com os papéis `DEFAULT_ADMIN_ROLE` e `VALIDATOR_ROLE`
- [x] Definir enums de tipo de documento e status (Pending, Validated, Rejected, Revoked)
- [x] Definir structs e eventos conforme a arquitetura

## Critérios de aceite
- [x] Contrato compila
- [x] Apenas o admin concede e revoga o papel de validador

## Detalhes
- **Depende de:** #11, #12
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 08 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/14

</details>

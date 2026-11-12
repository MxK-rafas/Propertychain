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

## Contexto
O cartório simulado analisa o documento fora da chain e registra o resultado.

## Tarefas
- [x] Implementar `validateDocument(bytes32 docHash)` e `rejectDocument(bytes32 docHash, uint8 reasonCode)`
- [x] Usar a tabela de `reasonCode` fechada em #11 (reverter com código desconhecido)
- [x] Restringir ao papel VALIDATOR e só permitir a partir do status Pending
- [x] Guardar quem validou/rejeitou e quando
- [x] Emitir `DocumentValidated` e `DocumentRejected`

## Critérios de aceite
- [x] Somente validador executa
- [x] Transições de estado inválidas revertem

## Detalhes
- **Depende de:** #15
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 10 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/16

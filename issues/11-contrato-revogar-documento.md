## Contexto
Documentos validados podem perder a validade (erro, fraude, decisão judicial). Nada é apagado: o histórico permanece e o status muda.

## Tarefas
- [x] Implementar `revokeDocument(bytes32 docHash, uint8 reasonCode)` (VALIDATOR)
- [x] Só permitir a partir de Validated
- [x] Emitir `DocumentRevoked`

## Critérios de aceite
- [x] Documento revogado continua consultável com status Revoked e motivo

## Detalhes
- **Depende de:** #16
- **Tamanho estimado:** P (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 11 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/17

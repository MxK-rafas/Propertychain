## Contexto
Qualquer pessoa pode submeter o hash de um documento. Ele nasce com status Pending e só vira Validated pelo validador.

## Tarefas
- [x] Implementar `submitDocument(bytes32 docHash, DocType docType, bytes32 propertyRef, string cid)`
- [x] Rejeitar hash já cadastrado
- [x] Guardar quem submeteu e quando (timestamp do bloco)
- [x] Emitir `DocumentSubmitted`

## Critérios de aceite
- [x] Submissão grava dados corretos e emite evento
- [x] Hash duplicado reverte com erro claro

## Detalhes
- **Depende de:** #14
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 09 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/15

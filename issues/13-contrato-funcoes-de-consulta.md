## Contexto
Leituras públicas e gratuitas que alimentam a tela de verificação.

## Tarefas
- [x] `verifyDocument(bytes32)` retorna existência, status, tipo, submitter, validador e datas
- [x] `getDocumentsByProperty(bytes32)` lista os hashes de um imóvel
- [x] `getHolderHistory(bytes32)` e `latestAttestedHolder(bytes32)`
- [x] Garantir que nenhuma consulta exige carteira

## Critérios de aceite
- [x] Todas as consultas funcionam via provedor somente leitura

## Detalhes
- **Depende de:** #15, #16, #1
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 13 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/18

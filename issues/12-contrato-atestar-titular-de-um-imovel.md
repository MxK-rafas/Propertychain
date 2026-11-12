## Contexto
O validador atesta quem consta como titular de um imóvel com base em um documento validado. É uma atestação sobre documentos, não um título de propriedade.

## Tarefas
- [x] Implementar `attestHolder(bytes32 propertyRef, address holder, bytes32 basisDocHash)` (VALIDATOR)
- [x] Exigir que `basisDocHash` esteja Validated e vinculado ao mesmo `propertyRef`
- [x] Manter histórico de titulares (eventos + array) e o titular atual
- [x] Emitir `HolderAttested`
- [x] Nomear funções, eventos e textos como 'titular atestado', nunca como 'proprietário legal'

## Critérios de aceite
- [x] Histórico de titulares consultável
- [x] Atestação sem documento validado reverte

## Detalhes
- **Depende de:** #16
- **Tamanho estimado:** G (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 12 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/1

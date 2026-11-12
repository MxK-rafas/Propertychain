## Contexto
Dados como número de matrícula, endereço e nomes não devem ficar em claro numa blockchain imutável. Usar uma referência derivada.

## Tarefas
- [ ] Definir `propertyRef = keccak256(matrícula + cartório + salt)`
- [ ] Gerar e mostrar o salt para o proprietário guardar
- [ ] Documentar como consultar um imóvel conhecendo matrícula + salt
- [ ] Escrever `docs/IDENTIFICADOR_DO_IMOVEL.md`

## Critérios de aceite
- [ ] Nenhum dado pessoal ou matrícula em claro on-chain
- [ ] Consulta por imóvel funciona com o salt

## Detalhes
- **Depende de:** #11
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 25 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/30

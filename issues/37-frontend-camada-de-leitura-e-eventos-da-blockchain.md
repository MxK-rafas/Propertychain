## Contexto
A verificação pública, a linha do tempo (#26) e a lista de pendências do validador (#28) dependem de leituras e de eventos. RPCs públicos da Sepolia costumam limitar o intervalo de blocos em `getLogs`, então a leitura de eventos precisa ser feita com cuidado, e a verificação precisa funcionar sem carteira.

## Tarefas
- [ ] Criar `lib/provider` com provedor somente leitura (RPC público configurável por `.env`), usado quando não há carteira conectada
- [ ] Criar `lib/contract` que expõe as funções de consulta e usa o provedor da carteira apenas para escrita
- [ ] Guardar o bloco de deploy do contrato em configuração e ler eventos a partir dele
- [ ] Implementar leitura de eventos por `propertyRef` com paginação por intervalo de blocos (respeitando o limite do RPC)
- [ ] Criar hooks reutilizáveis (`useDocument`, `usePropertyHistory`, `usePendingDocuments`) com estados de carregamento e erro

## Critérios de aceite
- [ ] Telas públicas leem o contrato sem MetaMask instalada
- [ ] Leitura de eventos funciona na Sepolia sem estourar o limite do RPC
- [ ] Hooks usados por #25, #26 e #28

## Detalhes
- **Depende de:** #18, #21
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 37 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/37

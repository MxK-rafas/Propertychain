# [Atual] Frontend: ler transação e Memo na Solana

Issue GitHub: [#37](https://github.com/MxK-rafas/Propertychain/issues/37). ID original do kit: 37. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Substitui varredura de eventos EVM: buscar assinatura diretamente, validar Memo e erro/finalidade; nenhuma carteira para ler.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Consulta real sem carteira; sem usar valor de URL/log como prova; caso sem arquivo distingue existência de correspondência.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

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

</details>

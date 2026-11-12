# [Legado EVM] Contrato: funções de consulta

Issue GitHub: [#18](https://github.com/MxK-rafas/Propertychain/issues/18). ID original do kit: 13. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Leituras do DocumentRegistry são históricas. A consulta atual busca transação e Memo na Devnet.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Não exigir contrato Solidity, ABI, endereço EVM ou eventos para consultar.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

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

</details>

# [Legado EVM] Contrato: submeter documento

Issue GitHub: [#15](https://github.com/MxK-rafas/Propertychain/issues/15). ID original do kit: 09. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Submissão Pending do contrato antigo permanece preservada, mas a escrita atual usará Memo Solana.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Não chamar submitDocument/ethers no frontend atual.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

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

</details>

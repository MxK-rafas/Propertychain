# [Legado EVM] Contrato: revogar documento

Issue GitHub: [#17](https://github.com/MxK-rafas/Propertychain/issues/17). ID original do kit: 11. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Revogação do contrato antigo fica fora da versão atual.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Não criar revogação de Memo nem novo programa Solana para satisfazer tarefa antiga.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

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

</details>

# [Legado EVM] Contrato: validar e rejeitar documento

Issue GitHub: [#16](https://github.com/MxK-rafas/Propertychain/issues/16). ID original do kit: 10. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Aprovação/rejeição por VALIDATOR existe só no legado. Cartório no MVP é simulado na interface.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Nenhuma segunda carteira, assinatura ou estado institucional on-chain é exigido.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
O cartório simulado analisa o documento fora da chain e registra o resultado.

## Tarefas
- [x] Implementar `validateDocument(bytes32 docHash)` e `rejectDocument(bytes32 docHash, uint8 reasonCode)`
- [x] Usar a tabela de `reasonCode` fechada em #11 (reverter com código desconhecido)
- [x] Restringir ao papel VALIDATOR e só permitir a partir do status Pending
- [x] Guardar quem validou/rejeitou e quando
- [x] Emitir `DocumentValidated` e `DocumentRejected`

## Critérios de aceite
- [x] Somente validador executa
- [x] Transições de estado inválidas revertem

## Detalhes
- **Depende de:** #15
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 10 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/16

</details>

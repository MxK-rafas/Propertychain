# [Legado EVM] Contrato: testes unitários

Issue GitHub: [#19](https://github.com/MxK-rafas/Propertychain/issues/19). ID original do kit: 14. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Conservar testes e cobertura Hardhat da fase anterior.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Evidências continuam identificadas como EVM; não concluir Phantom/Solana com base nelas.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Cobrir fluxos felizes e casos de erro.

## Tarefas
- [x] Testes de submissão, validação, rejeição, revogação, atestação e consultas
- [x] Casos negativos: sem permissão, hash duplicado, estados inválidos, documento de outro imóvel
- [x] Gerar relatório de cobertura (`hardhat coverage`)

## Critérios de aceite
- [x] Cobertura de linhas ≥ 90%
- [ ] Todos os testes rodam na CI

## Detalhes
- **Depende de:** #15, #16, #17, #1, #18
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 14 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/19

Implementação de CI no novo PR; sua execução será conferida antes da conclusão.

</details>

# [Atual] Testar fluxo e consulta de 1–5 segundos

Issue GitHub: [#34](https://github.com/MxK-rafas/Propertychain/issues/34). ID original do kit: 29. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Testar quatro telas, cancelamento/falha, link sem carteira e comparação exata; medir pelo menos dez leituras de registro confirmado.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Relatar mediana/máximo/erros; separar carregamento, escolha, ação humana e confirmação de nova transação. Nunca fabricar sucesso para cumprir tempo.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Garantir que o caminho completo funciona: submeter, validar, verificar, atestar.

## Tarefas
- [ ] Escolher abordagem (Playwright com nó local do Hardhat ou roteiro manual documentado)
- [ ] Automatizar ao menos o fluxo submeter → validar → verificar
- [ ] Rodar na CI se possível

## Critérios de aceite
- [ ] Fluxo principal coberto por teste ou por roteiro reproduzível

## Detalhes
- **Depende de:** #24, #25, #28
- **Tamanho estimado:** G (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 29 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/34

</details>

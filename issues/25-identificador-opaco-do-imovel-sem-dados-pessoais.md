# [Fora do MVP] Identificador de imóvel por matrícula e salt

Issue GitHub: [#30](https://github.com/MxK-rafas/Propertychain/issues/30). ID original do kit: 25. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Não há cadastro/busca de imóvel neste recorte. Identificação da consulta é a assinatura da transação.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Não pedir matrícula, cartório ou salt para consultar; não criar novos campos pessoais.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Fora do MVP) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

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

</details>

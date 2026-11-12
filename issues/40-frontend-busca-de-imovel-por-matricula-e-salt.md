# [Fora do MVP] Busca de imóvel por matrícula e salt

Issue GitHub: [#40](https://github.com/MxK-rafas/Propertychain/issues/40). ID original do kit: 40. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Não há busca/catálogo de imóveis neste MVP.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Consulta usa link de transação, sem pedir matrícula ou implementar keccak/propertyRef.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Fora do MVP) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
A referência do imóvel é opaca (`keccak256(matrícula + cartório + salt)`). Quem conhece matrícula, cartório e salt precisa conseguir chegar à linha do tempo do imóvel sem entender o que é um hash. Os dados digitados são usados só para calcular a referência no navegador e nunca são enviados a lugar nenhum.

## Tarefas
- [ ] Tela com campos matrícula, cartório e salt; calcular o `propertyRef` no navegador com a mesma função de #30
- [ ] Abrir a linha do tempo (#26) a partir da referência calculada
- [ ] Aceitar também a referência já calculada, colada pelo usuário
- [ ] Mensagem clara para 'nenhum documento encontrado para este imóvel' e para salt incorreto (que gera outra referência)
- [ ] Teste unitário garantindo que o front e a documentação (#30) geram a mesma referência

## Critérios de aceite
- [ ] Com matrícula + cartório + salt corretos, a linha do tempo do imóvel abre
- [ ] Nenhum dado digitado é enviado pela rede

## Detalhes
- **Depende de:** #30, #26
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 40 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/40

</details>

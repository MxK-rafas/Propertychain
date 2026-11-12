# [Legado EVM] Contrato: atestar titular de um imóvel

Issue GitHub: [#1](https://github.com/MxK-rafas/Propertychain/issues/1). ID original do kit: 12. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Implementação Solidity preservada, fora do MVP Solana. Não implementar atestação de titular no app atual.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Conservar código e evidências históricas sem tratar titular fictício como proprietário comprovado.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Legado EVM) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
O validador atesta quem consta como titular de um imóvel com base em um documento validado. É uma atestação sobre documentos, não um título de propriedade.

## Tarefas
- [x] Implementar `attestHolder(bytes32 propertyRef, address holder, bytes32 basisDocHash)` (VALIDATOR)
- [x] Exigir que `basisDocHash` esteja Validated e vinculado ao mesmo `propertyRef`
- [x] Manter histórico de titulares (eventos + array) e o titular atual
- [x] Emitir `HolderAttested`
- [x] Nomear funções, eventos e textos como 'titular atestado', nunca como 'proprietário legal'

## Critérios de aceite
- [x] Histórico de titulares consultável
- [x] Atestação sem documento validado reverte

## Detalhes
- **Depende de:** #16
- **Tamanho estimado:** G (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 12 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/1

</details>

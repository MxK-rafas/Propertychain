# [Atual] Solana Devnet: registrar hash com Memo e Phantom

Issue GitHub: [#20](https://github.com/MxK-rafas/Propertychain/issues/20). ID original do kit: 15. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Substitui deploy Sepolia. Uma carteira assina Memo propertychain:v1:sha256:<hash>; nenhum programa próprio.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Transação Devnet confirmada sem erro contém hash esperado e link no explorador; cancelar não avança para sucesso.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Publicar o contrato na testnet e deixar o endereço documentado.

## Tarefas
- [ ] Escrever script de deploy
- [ ] Fazer deploy e verificar o código no Etherscan da Sepolia
- [ ] Conceder o papel VALIDATOR a uma carteira 'cartório demo'
- [ ] Registrar endereço, rede e bloco em `docs/DEPLOYMENTS.md`

## Critérios de aceite
- [ ] Contrato verificado e consultável no explorador
- [ ] Endereço documentado

## Detalhes
- **Depende de:** #19
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 15 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/20

</details>

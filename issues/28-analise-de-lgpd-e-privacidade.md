# [Atual] Privacidade do teste com foto real

Issue GitHub: [#33](https://github.com/MxK-rafas/Propertychain/issues/33). ID original do kit: 28. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Nenhum arquivo real em GitHub, Vercel, RPC, logs, analytics ou OCR. Hash e metadados de transação são públicos; não prometer anonimato.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Revisão de rede/build comprova ausência de upload de imagem e informações fictícias não são ligadas à foto. Operação documental real fica em Depois.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Blockchain é imutável; a LGPD prevê direitos como o de eliminação. É preciso mostrar que o projeto foi pensado para isso.

## Tarefas
- [ ] Escrever `docs/LGPD.md`
- [ ] Explicar a minimização: só hash e referência opaca on-chain; nenhum dado pessoal em claro
- [ ] Discutir se o hash de um documento pode ser considerado dado pessoal e as mitigações
- [ ] Descrever o que acontece se o usuário quiser 'apagar' (revogar, descartar o salt, remover cópia off-chain)

## Critérios de aceite
- [ ] Documento revisado e referenciado no pitch

## Detalhes
- **Depende de:** #30
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 28 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/33

</details>

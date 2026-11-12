# [Atual] Frontend: tela 1 de cadastro

Issue GitHub: [#24](https://github.com/MxK-rafas/Propertychain/issues/24). ID original do kit: 19. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Exemplo fictício por padrão; seleção local opcional; ocultar metadados fictícios ao trocar arquivo; uma ação principal.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Cadastrar solicita Phantom, registra hash e só avança após sucesso verificado na Devnet.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Fluxo do proprietário: escolher arquivo, informar tipo e imóvel, enviar.

## Tarefas
- [ ] Formulário: arquivo, tipo de documento, identificador do imóvel
- [ ] Gerar o `propertyRef` (ver issue do identificador opaco)
- [ ] Enviar a transação e acompanhar o estado
- [ ] Mostrar resumo e link para o resultado depois de confirmado

## Critérios de aceite
- [ ] Documento aparece como Pendente após a confirmação

## Detalhes
- **Depende de:** #22, #23, #30
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 19 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/24

</details>

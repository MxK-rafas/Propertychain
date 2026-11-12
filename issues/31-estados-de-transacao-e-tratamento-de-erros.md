# [Atual] Estados de transação e erros em português

Issue GitHub: [#3](https://github.com/MxK-rafas/Propertychain/issues/3). ID original do kit: 31. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Tratar conexão, assinatura cancelada, saldo Devnet, envio, confirmação, falha, leitura pendente e arquivo divergente; bloquear clique repetido.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Nenhuma falha ou timeout vira sucesso. Mostrar link do explorador e comprovar confirmação/Memo antes de dizer que funcionou.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Transações em blockchain são lentas e podem falhar. O usuário precisa saber o que está acontecendo.

## Tarefas
- [ ] Estados: aguardando carteira, enviada, confirmando, confirmada, falhou
- [ ] Mensagens em português para erros comuns: recusou na carteira, rede errada, sem saldo para a taxa, documento duplicado, sem permissão
- [ ] Evitar duplo clique em enviar

## Critérios de aceite
- [ ] Nenhum erro aparece como mensagem técnica crua

## Detalhes
- **Depende de:** #24
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 31 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/3

</details>

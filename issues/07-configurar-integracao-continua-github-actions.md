# [Atual] CI: preservar legado e preparar verificações do frontend

Issue GitHub: [#13](https://github.com/MxK-rafas/Propertychain/issues/13). ID original do kit: 07. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Manter job Contratos legados (EVM). Na etapa 2, com scripts existentes, adicionar testes relevantes, tipos e build do frontend.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

CI não chama scripts inexistentes nem apresenta testes EVM como comprovação de integração Solana. Nenhuma foto real vira artefato.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Garantir que todo Pull Request compila e passa nos testes.

## Tarefas
- [x] Criar workflow para instalar dependências, compilar o contrato e rodar os testes
- [ ] Adicionar lint do frontend quando existir
- [ ] Exigir o check verde para mesclar na `main`

## Critérios de aceite
- [ ] PR com falha de teste não pode ser mesclado

## Detalhes
- **Depende de:** #2, #12
- **Tamanho estimado:** P (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 07 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/13

Frontend ainda ausente; lint será adicionado com ele. Proteção da main pendente por falta de permissão administrativa na integração (403).

</details>

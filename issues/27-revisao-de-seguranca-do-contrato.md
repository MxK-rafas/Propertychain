# [Atual] Revisar escrita e verificação Solana

Issue GitHub: [#32](https://github.com/MxK-rafas/Propertychain/issues/32). ID original do kit: 27. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Revisar programa Memo, hash, rede, confirmação e ausência de erro; validar entrada e evitar envio repetido. Sem contrato próprio para auditar.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Registro incompatível/ambíguo/falho não mostra sucesso; nenhuma chave privada ou autorização institucional é simulada como real.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Checar riscos conhecidos e documentar. Atenção ao risco de alguém submeter primeiro o hash de um documento alheio: por isso a submissão nasce Pendente e só o validador confirma.

## Tarefas
- [ ] Rodar Slither e analisar os alertas
- [ ] Revisar controle de acesso, estados e eventos
- [ ] Avaliar abuso de submissão (spam, 'ocupação' de hash)
- [ ] Registrar achados e correções em `docs/SEGURANCA.md`

## Critérios de aceite
- [ ] Sem achados críticos em aberto
- [ ] Documento de segurança no repositório

## Detalhes
- **Depende de:** #19
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 27 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/32

</details>

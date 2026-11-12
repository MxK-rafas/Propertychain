# [Atual] Frontend: SHA-256 local do exemplo ou foto

Issue GitHub: [#23](https://github.com/MxK-rafas/Propertychain/issues/23). ID original do kit: 18. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Calcular sobre bytes originais de PDF/JPEG/PNG. Sem normalização, OCR, upload ou logs com documento.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Arquivo idêntico produz hash igual, alterado diverge e duas fotos do mesmo papel não são prometidas como equivalentes.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
O documento nunca deve sair do computador do usuário sem consentimento. Só o hash (SHA-256) vai para a blockchain. SHA-256 permite que qualquer pessoa confira com ferramentas padrão (`sha256sum`).

## Tarefas
- [ ] Implementar leitura do arquivo e SHA-256 via Web Crypto API
- [ ] Drag & drop e seleção de arquivo
- [ ] Exibir o hash e permitir copiar
- [ ] Tratar arquivos grandes sem travar a página

## Critérios de aceite
- [ ] Mesmo arquivo gera o mesmo hash do `sha256sum`
- [ ] Nenhuma requisição de rede envia o arquivo

## Detalhes
- **Depende de:** #21
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 18 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/23

</details>

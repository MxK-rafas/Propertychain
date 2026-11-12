# [Atual] Link de consulta em outro celular, sem carteira

Issue GitHub: [#31](https://github.com/MxK-rafas/Propertychain/issues/31). ID original do kit: 26. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Gerar link com assinatura da transação, sem nome/imagem do arquivo ou dependência de localStorage de origem. QR code fica fora.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Abre na tela 3 em outro aparelho; leitura sem Phantom; cópia digital pode ser comparada localmente.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Facilitar mostrar o resultado a terceiros: link curto ou QR que abre a verificação pronta.

## Tarefas
- [ ] Rota `/verify/:hash`
- [ ] Botão copiar link e gerar QR Code
- [ ] Versão para impressão (selo de verificação)

## Critérios de aceite
- [ ] Escanear o QR abre a tela de verificação com o resultado

## Detalhes
- **Depende de:** #25
- **Tamanho estimado:** P (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 26 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/31

</details>

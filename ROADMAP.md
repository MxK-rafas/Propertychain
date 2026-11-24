# Roadmap do PropertyChain

Atualizado em 24/11/2026. A fonte operacional é [SPEC.md](SPEC.md), alinhada com o aplicativo público e a [revisão de entregas](docs/REVISAO_DE_ENTREGAS.md). Não usar o estado de tarefas EVM antigas como fila de implementação Solana.

## Concluído e aceito

| Entrega | Evidência / aceite |
|---|---|
| Modelo fictício e escopo único Solana | Fixtures, spec e PR #44 |
| Entrada por perfil, cadastro e cartório simulado | PR #45; teste manual do autor |
| SHA-256 local e Phantom | PR #46; teste manual do autor |
| Memo Devnet, link e confirmação | [PR #47](https://github.com/MxK-rafas/Propertychain/pull/47); registro público de exemplo |
| Consulta pública e comparação em outro aparelho | PRs #48, #49, #51, #53 e #54; sem arquivo, igual e diferente |
| Vercel público, sem login para consulta | [Endereço oficial](https://propertychain-theta.vercel.app/); perfis organizam o percurso, sem autenticação |
| Teste com foto real e aceite do MVP | [#6](https://github.com/MxK-rafas/Propertychain/issues/6), aceite do autor em 23/11/2026; foto não fornecida ao Codex |
| Relatório de verificação em PDF | [PR #57](https://github.com/MxK-rafas/Propertychain/pull/57) e [#56](https://github.com/MxK-rafas/Propertychain/issues/56), aceito em 24/11/2026 |

As seis etapas originais e seus critérios Pronto quando estão na spec. A medição registrada de dez leituras de um registro confirmado teve mediana de 0,45 s, máximo de 1,05 s e zero erros; não representa o tempo completo de uso, hash, assinatura ou confirmação. Ver [guia](frontend/README.md).

## Prioridade atual — preparar a apresentação

- Revisar estrutura, spec e roadmap antes do pitch, conforme solicitado pelo autor em 24/11/2026. [Revisão #59](https://github.com/MxK-rafas/Propertychain/issues/59).
- Preparar pitch, roteiro de demonstração e perguntas/respostas na [#7](https://github.com/MxK-rafas/Propertychain/issues/7), para quinta-feira, **26/11/2026**. Solicitação autorizada; material e ensaio ainda não concluídos nesta revisão.
- O autor enviará o app a amigos e trará feedback. Ainda não há resultados dessa rodada registrados; correções e prioridades serão definidas a partir dos relatos.

A preparação do pitch é material de apresentação, sem nova funcionalidade ou alteração do aceite do MVP. Não iniciar novas funcionalidades enquanto esses feedbacks/prioridades não forem definidos pelo autor.

## Depois — sem implementação autorizada

- Taxa por documento/consulta e planos mensais.
- Piloto com cartórios parceiros (não há parceria confirmada no MVP).
- Armazenamento seguro de documentos reais e avaliação jurídica/privacidade para essa operação; [#27](https://github.com/MxK-rafas/Propertychain/issues/27).

Relatórios PDF não são mais pendência de Depois: foram antecipados expressamente e aceitos na #56.

## Um dia

- Licenciamento da plataforma para cartórios.

## Fora deste recorte e legado

Busca por matrícula/salt, atestação de titular, transferência de propriedade, painel/aprovação real de cartório, revogação, programa próprio e QR code do app continuam fora do recorte. Vídeo e capturas da #41 não foram entregues por esta revisão. `contracts/` e #39 preservam o legado Hardhat; não são dependência do frontend e não serão retomados por inferência.

[ISSUES.md](ISSUES.md) diferencia o catálogo original, o estado no GitHub, as evoluções aceitas e a apresentação solicitada.

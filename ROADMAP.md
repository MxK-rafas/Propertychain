# Roadmap do PropertyChain

Atualizado em 26/11/2026. A fonte operacional é [SPEC.md](SPEC.md), alinhada com o aplicativo público e a [revisão de entregas](docs/REVISAO_DE_ENTREGAS.md). Não usar o estado de tarefas EVM antigas como fila de implementação Solana.

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

## Exemplo guiado e Demo Day

O [exemplo guiado e a revisão de linguagem](docs/FEEDBACKS_E_EXEMPLO_GUIADO.md) foram entregues na [#61](https://github.com/MxK-rafas/Propertychain/issues/61). O autor confirmou o funcionamento do percurso completo no computador e no celular. A próxima rodada com usuários vai avaliar a clareza da nova redação.

A preparação para o Demo Day ([#7](https://github.com/MxK-rafas/Propertychain/issues/7)) foi entregue com dez slides e notas. O [roteiro e as respostas para a banca](docs/PITCH_DEMO_DAY.md) fazem parte da documentação. A realização da apresentação e o ensaio do autor ainda não foram confirmados.

## Depois — sem implementação autorizada

- Taxa por documento/consulta e planos mensais.
- Piloto com cartórios parceiros (não há parceria confirmada no MVP).
- Armazenamento seguro de documentos reais e avaliação jurídica/privacidade para essa operação; [#27](https://github.com/MxK-rafas/Propertychain/issues/27).

Relatórios PDF não são mais pendência de Depois: foram antecipados expressamente e aceitos na #56.

## Um dia

- Licenciamento da plataforma para cartórios.

## Fora deste recorte e legado

Busca por matrícula/salt, atestação de titular, transferência de propriedade, painel/aprovação real de cartório, revogação, programa próprio e QR code do app continuam fora do recorte. O PDF do pitch oferece capturas para apresentar sem internet. O vídeo separado da [#41](https://github.com/MxK-rafas/Propertychain/issues/41) continua pendente. `contracts/` e #39 preservam o legado Hardhat; não são dependência do frontend e não serão retomados por inferência.

[ISSUES.md](ISSUES.md) diferencia o catálogo original, o estado no GitHub, as evoluções aceitas e a apresentação solicitada.

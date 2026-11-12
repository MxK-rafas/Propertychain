> **Fonte de negócio preservada.** A ficha/canvas contém hipóteses e a redação entregue na formação. O escopo operacional atual é [SPEC.md](../SPEC.md): Solana Devnet, Phantom, cartório apenas visualmente simulado, dados fictícios e foto local para teste. Não há atestação de titular, aprovação de cartório on-chain ou prova de propriedade neste MVP.

# Lean Canvas

Lean Canvas do projeto (formação, bloco 5), transcrito na issue #9. Cada campo é uma hipótese a testar, não um fato. A nota final lista pontos de redação a alinhar com [`ESCOPO_JURIDICO.md`](ESCOPO_JURIDICO.md).

## 1 · Problema
Proprietários e herdeiros de imóveis antigos, principalmente pessoas mais velhas, perdem ou nunca tiveram o registro oficial dos documentos de posse. Sem prova verificável, perdem tempo e dinheiro, e compradores não confiam na origem do imóvel.

## 2 · Segmento de clientes
Proprietários e herdeiros de imóveis antigos (a dor mais forte), e compradores, corretores, advogados e cartórios que precisam verificar a origem de um imóvel.

## 3 · Proposta de valor
Verificar em minutos quem é o dono de um imóvel e de onde vem o documento, com um histórico que ninguém apaga e que não depende de papel guardado em gaveta.

## 4 · Solução
Um app web para cadastrar documentos imobiliários. O hash de cada documento é registrado em blockchain e validado por uma entidade autorizada (o cartório, simulado no protótipo). Qualquer pessoa pode verificar a autenticidade, o histórico de transferências e o dono atual. Primeira versão: cadastrar e verificar documentos.

## 5 · Canais
Famílias em processo de herança ou regularização, corretores e imobiliárias, advogados da área imobiliária, cartórios parceiros num piloto e a comunidade da formação de blockchain/Web3 para os primeiros testes.

## 6 · Fontes de receita
- Proprietário paga uma taxa por documento verificado e validado.
- Compradores, corretores e imobiliárias pagam por consulta ou relatório de verificação.
- Plano mensal para imobiliárias e escritórios de advocacia com alto volume.
- Longo prazo: licenciamento da plataforma para cartórios.

**Modelo de receita:** 1º, proprietários, compradores e advogados pagam por verificação de documentos e por relatórios de consulta; 2º, licenciamento/parceria da plataforma com os cartórios.

## 7 · Estrutura de custos
Desenvolvimento do app e do smart contract, taxas de rede (baixas em L2, nulas em testnet), armazenamento de documentos (IPFS ou nuvem criptografada), hospedagem, adequação à LGPD e jurídica, e custo de parceria e suporte com cartórios.

## 8 · Métrica-chave
Número de documentos cadastrados e validados, número de verificações feitas por terceiros (compradores, corretores) e tempo para verificar um documento (minutos, contra dias ou semanas hoje).

## 9 · Vantagem injusta
A imutabilidade em si pode ser copiada. O que é difícil de copiar é a confiança institucional (parcerias com cartórios que validam os registros) e o histórico acumulado de documentos já validados. Também conta a vivência direta do problema, que orienta o produto para quem realmente sofre com ele.

## 10 · Alternativas existentes
Certidão de matrícula e escritura nos cartórios (com a plataforma digital do ONR/SREI), guardar cópias em papel ou no Drive e WhatsApp, e contratar advogados ou despachantes para reconstituir a documentação.

---

## Nota de alinhamento com o escopo jurídico

Textos mantidos como entregues. Ao reaproveitar no app, no README e no pitch, use:

| No canvas | No projeto |
|-----------|------------|
| "quem é o dono de um imóvel", "o dono atual" | "titular atestado nos documentos" |
| "histórico de transferências" | "histórico de transferência documental simulada" |
| "validado por cartório" | "validado por um **cartório simulado** no protótipo" |
| "parcerias com cartórios", "piloto", "licenciamento" | hipóteses de futuro; o protótipo não tem parceria nem valor legal |

Pontos de atenção para a revisão da issue #8 e para o pitch (#7):
- A vantagem injusta depende de parcerias com cartórios. A norma proposta ao CNJ pelo ONR sobre blockchain ligada a imóveis pode afetar essa hipótese; confira o estado atual antes de apresentar.
- A "Proposta de valor" promete saber quem é o dono em minutos. No protótipo a promessa correta é verificar a origem e a validação dos documentos, não a propriedade.
- Os custos citam L2; a versão atual usa Solana Devnet por escolha do autor; a menção a L2 permanece apenas como hipótese original de custos.

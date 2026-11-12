> HISTÓRICO da fase EVM, preservado em 12/11/2026. Não define o MVP atual. Pesquisa e testes aqui descritos não foram refeitos nesta consolidação. Consulte ../../SPEC.md.

# Escopo e limites jurídicos

Versão revisada na issue #8. **Última verificação da regulamentação: 10/11/2026.** Este documento não é aconselhamento jurídico; o autor não é advogado. Se o projeto sair do ambiente educacional, é obrigatório consultar um advogado da área registral.

## Resumo em uma frase

O Propertychain verifica a autenticidade e a origem de **documentos**. Ele não registra propriedade.

## Por que isso importa

No Brasil, a propriedade de um imóvel é adquirida com o registro do título no Cartório de Registro de Imóveis (Código Civil, art. 1.245). O Operador Nacional do Registro Eletrônico de Imóveis (ONR), criado pela Lei 13.465/2017, opera o Sistema de Registro Eletrônico de Imóveis (SREI) sob regulação da Corregedoria Nacional de Justiça (CNJ). A Lei 14.382/2022 criou o Sistema Eletrônico de Registros Públicos (SERP).

## Estado da regulamentação (verificado em 10/11/2026)

O debate regulatório atual é sobre **tokenização imobiliária**: representar imóveis, frações ou direitos por tokens em blockchain, ou vincular a matrícula a esses tokens. O que foi encontrado:

| Quando | Órgão | O que decidiu |
|--------|-------|---------------|
| Ago/2025 | Corregedoria de Santa Catarina (Circular 410/2025) | Proíbe os registradores de vincular a matrícula a tokens, blockchain ou outros instrumentos extrarregistrais, até haver lei federal ou regulamentação do CNJ. |
| Set/2025 | ONR | Pede ao CNJ regulamentação específica para tokens (Pedido de Providências 0006613-89.2025.2.00.0000). |
| Out/2025 | Justiça Federal do DF, a pedido do ONR | Suspende a Resolução 1.551/2025 do Cofeci, que criava um sistema próprio de transações imobiliárias digitais com tokens. Segundo fontes jurídicas, em fev/2026 ela foi declarada nula por sentença. |
| 24/10/2025 | Corregedoria do Rio Grande do Sul | Suspende o Provimento 38/2021, manda qualificar negativamente títulos ligados a tokens ou a "controles privados de titularidade" e afirma que blockchain no registro deve ficar dentro do SREI. |
| 23/01/2026 | Corregedoria de São Paulo (Provimento 54/2025) | Proíbe anotação, averbação ou registro que vincule a matrícula a token ou blockchain, enquanto não houver lei federal ou ato do CNJ. |
| 2026 | Corregedoria de Mato Grosso do Sul (Provimento 352/2026) | Mesma linha das anteriores. |

**Situação:** até onde esta pesquisa alcançou, não há norma nacional do CNJ nem lei federal específica sobre blockchain e tokens ligados a imóveis; o pedido do ONR ao CNJ aparece como pendente. A ausência de resultado numa busca não prova que não exista norma nova: **confira de novo antes da banca** (veja "Como atualizar").

**Leitura para o Propertychain:** as normas acima mirram tokens e a vinculação da matrícula a blockchain. O Propertychain não cria token, não altera matrícula e não pratica ato registral. Mesmo assim, a RS fala em "controles privados de titularidade" fora do sistema oficial, e a função de atestar titular precisa ser comunicada com cuidado para não parecer isso (veja "Risco residual").

## O que o projeto faz

- Registra o **hash** de documentos e quem os submeteu.
- Registra a **validação ou rejeição** feita por uma entidade autorizada (cartório **simulado**).
- Permite **verificação pública** de um documento.
- Mantém um **histórico auditável** (linha do tempo) por imóvel.
- Registra a **atestação de titular constante nos documentos** pelo validador simulado.

## O que o projeto não faz

- Não cria token, NFT ou qualquer representação digital do imóvel ou do direito de propriedade.
- Não vincula, anota ou averba nada na matrícula.
- Não constitui, modifica nem transfere direitos reais.
- Não substitui escritura pública, registro de imóveis, certidão de matrícula nem análise do registrador.
- Não armazena dados pessoais ou número de matrícula em claro.
- Não funciona em rede principal (mainnet); apenas testnet.
- Não envolve cartório real: o validador é um papel de demonstração.

## Regras de linguagem no projeto

| Evitar | Usar |
|--------|------|
| "registro de propriedade" | "verificação de documentos" |
| "proprietário legal", "dono", "dono atual" | "titular atestado nos documentos" |
| "transferência de propriedade" | "transferência documental simulada" |
| "substitui o cartório" | "dá ao cartório uma camada pública de verificação" |
| "tokenizar", "token do imóvel" | (não usar; o projeto não tem token) |
| "cartório validou" (sem contexto) | "cartório simulado (demonstração) validou" |

## Risco residual e mitigações

| Risco | Mitigação |
|-------|-----------|
| A atestação de titular ser lida como "controle privado de titularidade" | Texto fixo em toda tela: atestação é sobre o que consta nos documentos, não sobre propriedade. Aviso global (#38). Considerar nomes de função menos fortes, como `latestAttestedHolder` no lugar de `currentHolder`, na issue #14/#1. |
| Usuário confundir "validado" com registro oficial | Texto de resultado da verificação explica o que significa e o que não significa (#25). |
| Promessa de parceria com cartórios no pitch | Tratar como hipótese futura; não afirmar que existe parceria nem que o cartório é real. |
| Dados pessoais em blockchain imutável | Só hash e referência opaca on-chain; análise em `docs/LGPD.md` (#33). |

## Aviso padrão (usar no app e no README)

> Protótipo educacional em rede de testes. Sem valor legal. Não substitui o registro no Cartório de Registro de Imóveis.

## Como atualizar

Antes da entrega final (#5) e da banca (#7), pesquise de novo por: "CNJ tokenização registro de imóveis provimento", "Pedido de Providências 0006613-89.2025.2.00.0000" e a corregedoria do seu estado. Registre a data no topo deste documento.

## Fontes consultadas (10/11/2026)

- TJRS suspende norma sobre tokenização: https://www.registrodeimoveis.org.br/tjrssuspendenormasobretokenizaaao
- Corregedoria de São Paulo proíbe registro de tokens imobiliários (ONR): https://www.onr.org.br/em-vitoria-dos-cartorios-corregedoria-de-sao-paulo-proibe-o-registro-de-tokens-imobiliarios/
- CGJs de MS e SP publicam provimentos (IRIB): https://www.irib.org.br/cgjs-de-ms-e-sp-publicam-provimentos-sobre-tokenizacao-e-blockchain/
- Circular 410/2025 da CGJ de Santa Catarina (ONR): https://www.onr.org.br/norma-da-corregedoria-de-santa-catarina-veda-pratica-de-ato-que-vincule-matricula-a-tokens-digitais-ou-blockchain/
- Provimento 54/2025 da CGJ/SP (Conjur): https://conjur.com.br/2026-mai-18/tokenizacao-e-o-registro-de-imoveis-provimento-no-54-25-da-cgj-sp-2/
- Nulidade da Resolução Cofeci 1.551/25 (Migalhas): https://www.migalhas.com.br/depeso/450618/tokenizacao-imobiliaria-e-competencia-normativa-cofeci-1-551-25
- ONR pede regulamentação ao CNJ (Debate Jurídico): https://www.debatejuridico.com.br/noticias/onr-defende-tokenizacao-imobiliaria-mas-pelas-vias-corretas/

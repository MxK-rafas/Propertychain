# ADR 0004 · Nenhum token representa o imóvel

**Status:** Proposto

## Contexto
A propriedade imobiliária no Brasil se adquire pelo registro no Cartório de Registro de Imóveis. Tokens ligados a imóveis fora do sistema oficial têm risco regulatório (ver `docs/ESCOPO_JURIDICO.md`).

## Decisão
O contrato não cria token, NFT ou representação do imóvel ou do direito de propriedade. Ele registra hashes de documentos, validações e atestações sobre o que consta nos documentos.

## Consequências
- Evita enquadramento como sistema registral paralelo.
- A linguagem do projeto segue a tabela do escopo jurídico ("titular atestado nos documentos", nunca "proprietário legal").
- Não há "transferência de propriedade", apenas transferência documental simulada.

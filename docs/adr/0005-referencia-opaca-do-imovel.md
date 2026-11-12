# ADR 0005 · Imóvel identificado por referência opaca

**Status:** Proposto

## Contexto
Matrícula, endereço e nomes não podem ficar em claro numa blockchain imutável (LGPD).

## Decisão
`propertyRef = keccak256(matrícula + cartório + salt)`, calculado no navegador. O salt é gerado e mostrado ao proprietário, que deve guardá-lo.

## Consequências
- Nenhum dado pessoal ou matrícula em claro on-chain.
- Sem o salt não é possível reconstruir a referência; é preciso orientar o usuário (#30, #40).
- A codificação exata da concatenação deve ser idêntica no front e na documentação (teste unitário em #40).
- Quem conhece matrícula + cartório + salt consegue consultar o imóvel.

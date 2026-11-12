# Contrato DocumentRegistry

Protótipo educacional em rede de testes. Sem valor legal. Não substitui o registro no Cartório de Registro de Imóveis. Veja [`docs/ESCOPO_JURIDICO.md`](../docs/ESCOPO_JURIDICO.md).

## Como rodar

```bash
cd contracts
npm ci
npm run compile
npm test
npm run coverage
```

Requer Node.js 22 LTS. O Hardhat baixa o compilador Solidity na primeira compilação.

## O que o contrato faz

| Função | Quem | O que faz |
|--------|------|-----------|
| `submitDocument(docHash, docType, propertyRef, cid)` | qualquer pessoa | Cadastra o hash; nasce `Pending`. Hash repetido reverte. |
| `validateDocument(docHash)` | VALIDATOR | `Pending` → `Validated`. |
| `rejectDocument(docHash, reasonCode)` | VALIDATOR | `Pending` → `Rejected`. Motivos: 1, 2, 3, 4, 99. |
| `revokeDocument(docHash, reasonCode)` | VALIDATOR | `Validated` → `Revoked`. Motivos: 4, 5, 6, 99. Nada é apagado. |
| `attestHolder(propertyRef, holder, basisDocHash)` | VALIDATOR | Atesta quem consta como titular em documento `Validated` do mesmo imóvel. |
| `verifyDocument(docHash)` | qualquer pessoa | Dados do documento. `status == None` significa não encontrado. |
| `getDocumentsByProperty(propertyRef)` | qualquer pessoa | Hashes do imóvel, em ordem de submissão. |
| `getHolderHistory(propertyRef)` | qualquer pessoa | Histórico de titulares atestados. |
| `latestAttestedHolder(propertyRef)` | qualquer pessoa | Último titular atestado (zero se não houver). |

O admin (`DEFAULT_ADMIN_ROLE`) concede e revoga o papel `VALIDATOR_ROLE`, que representa o cartório simulado.

## Códigos de motivo

| Código | Uso | Significado |
|--------|-----|-------------|
| 1 | rejeição | Documento ilegível ou incompleto |
| 2 | rejeição | Dados divergentes de outros documentos do imóvel |
| 3 | rejeição | Suspeita de adulteração ou fraude |
| 4 | rejeição / revogação | Substituído por versão mais recente |
| 5 | revogação | Decisão judicial ou administrativa |
| 6 | revogação | Erro de validação reconhecido |
| 99 | ambos | Outro motivo |

## Limitações conhecidas

- Revogar um documento **não** apaga atestações de titular feitas com base nele; elas ficam no histórico. A interface deve mostrar o status atual do documento-base (issues #26 e #29).
- `getDocumentsByProperty` devolve a lista inteira. Para um imóvel com muitos documentos, a leitura pode ficar cara; no MVP isso não é problema.
- Contrato sem proxy: mudanças exigem novo deploy.

## Nó e seed locais

Após instalar as dependências, use `npm run node`, `npm run deploy:local` e `npm run seed:local`. O primeiro comando fica aberto em um terminal; os demais executam em outro. Veja [ambiente local](../docs/AMBIENTE_LOCAL.md) e [CI](../docs/CI.md). `npm run test:local` verifica o fluxo com um nó próprio, exigindo a porta 8545 livre.

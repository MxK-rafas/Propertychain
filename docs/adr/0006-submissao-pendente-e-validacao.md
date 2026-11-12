# ADR 0006 · Submissão nasce Pendente; só o validador confirma

**Status:** Proposto

## Contexto
Qualquer pessoa pode submeter um hash. Alguém poderia submeter antes o hash de um documento alheio (ocupação de hash). A blockchain também não garante que o documento é verdadeiro.

## Decisão
Toda submissão nasce com status Pending. Apenas o papel VALIDATOR muda para Validated ou Rejected, e depois pode revogar (Revoked). A tela sempre mostra quem submeteu. Nada é apagado; o histórico permanece em eventos.

## Consequências
- A confiança vem da validação do cartório fora da chain, não da blockchain.
- Hash já cadastrado reverte; um submissor mal-intencionado pode ocupar um hash, mas o documento aparecerá como Pendente ou Rejeitado e o validador decide.
- Spam de submissões é um risco a avaliar na revisão de segurança (#32).

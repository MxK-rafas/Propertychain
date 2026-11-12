# ADR 0001 · SHA-256 calculado no navegador

**Status:** Proposto

## Contexto
O documento pode conter dados pessoais e nunca deve sair do computador do usuário sem consentimento. A verificação precisa ser reproduzível por qualquer pessoa.

## Decisão
O hash SHA-256 do arquivo é calculado no navegador (Web Crypto API) e só ele é enviado ao contrato (`bytes32`).

## Consequências
- Qualquer um confere com ferramentas padrão (`sha256sum`).
- O arquivo não trafega pela rede.
- Qualquer alteração de um byte muda o hash: a prova vale para aquele arquivo exato, não para o "conteúdo" em outro formato.
- Arquivos grandes exigem leitura em blocos para não travar a página (#23).

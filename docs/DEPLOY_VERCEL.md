# Publicação atual na Vercel

Atualizado em 24/11/2026. Repositório: [MxK-rafas/Propertychain](https://github.com/MxK-rafas/Propertychain). Aplicativo público: **https://propertychain-theta.vercel.app/**.

## Configuração em uso

| Campo | Valor |
|---|---|
| Root Directory | `frontend` |
| Framework | Vite |
| Instalação | `npm ci` |
| Build | `npm run build` (TypeScript + Vite) |
| Saída | `dist` |
| Rede | Solana Devnet |
| Variáveis opcionais | `VITE_SOLANA_CLUSTER`, `VITE_SOLANA_RPC_URL` públicas |

Não publicar `frontend/prototype/` como app funcional. Não incluir `contracts/` no build, nem endereços/chaves de deploy EVM. Não há backend, banco ou API de upload.

## Acesso público e compartilhamento

O endereço oficial foi aberto e consultado em sessões novas sem cookies/login/carteira. O cadastro ainda exige aprovação na Phantom; isso não é login na Vercel. O relatório PDF também pode ser gerado pelo visitante sem carteira após consulta confirmada.

Deploys específicos e previews da Vercel podem exigir autenticação. Não afirmar que todas as configurações de proteção do projeto foram removidas: o acesso comprovado é o do domínio público oficial. O app gera links de compartilhamento sempre nesse domínio, com `#consulta?tx=…`.

A página inicial abre a escolha de perfil. O comprador/verificador pode informar o registro dentro da aplicação, sem uma URL temporária. Rotas usam fragmentos; não exigem uma API ou banco de registros.

## Validar uma atualização

1. Em `frontend`, executar `npm ci`, `npm test` e `npm run build`.
2. Conferir que dist contém somente código/assets públicos e fictícios. Nunca incluir foto real ou segredo em VITE_*.
3. Integrar a alteração autorizada após CI/revisão. Conferir o status da Vercel; um build aprovado sozinho não prova publicação.
4. Abrir o domínio oficial em sessão sem login. Conferir entrada, consulta conhecida, comparação e relatório PDF.
5. Recarregar no celular e no computador; testar Phantom real pelo autor quando houver mudança de carteira/abertura de arquivo.
6. Registrar erros e limites honestamente. RPC indisponível não pode virar sucesso fixo ou dados fictícios.

O teste de produção usa leitura de registro fictício existente; não executar nova transação em nome do autor. [Revisão e evidências](REVISAO_DE_ENTREGAS.md).

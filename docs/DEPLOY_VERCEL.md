> **Atualização — etapa 2:** frontend React/TypeScript/Vite, quatro telas, seleção local, scripts, lockfile e seis testes implementados. Operações ainda simuladas; Phantom, SHA-256, transação/consulta Solana e publicação Vercel continuam pendentes. Aguardar o teste do autor. Ver [frontend/README.md](../frontend/README.md). Notas abaixo sobre frontend inexistente descrevem o estado anterior à etapa 2.

# Publicação prevista na Vercel

Repositório único: [MxK-rafas/Propertychain](https://github.com/MxK-rafas/Propertychain). O autor autorizou Vercel como destino. Esta consolidação não cria conta Vercel, integração, projeto hospedado ou deploy.

## Quando o frontend funcional existir

1. Validar etapas anteriores da [spec](../SPEC.md), especialmente leitura real sem carteira.
2. Na conta do autor, importar este repositório na Vercel.
3. Selecionar `frontend` como Root Directory; framework Vite; instalar com `npm ci`; construir com `npm run build`; saída `dist`.
4. Configurar `VITE_SOLANA_CLUSTER=devnet` e RPC permitido para uso público no navegador. Não inserir frase-semente, chave privada ou token secreto em variáveis públicas.
5. Conferir o conteúdo da build: nenhum arquivo real, credencial ou dado pessoal pode estar em `public/`, `dist/` ou assets.
6. Publicar e testar link HTTPS no celular; a rota por fragmento deve abrir diretamente a consulta recebida.
7. Testar cadastro no ambiente Phantom suportado e consulta em outro navegador/aparelho sem carteira. Registrar link real e evidências na revisão de entregas.

Os comandos de build já existem na etapa 2. O deploy Vercel ainda não foi executado; o app atual tem operações simuladas. `contracts/` não faz parte do build Vercel. Não configurar endereço EVM, bloco de deploy ou chave privada.

## Referência visual

`frontend/prototype/` é um conjunto estático de quatro telas simuladas. Não apontar a publicação final para essa pasta e afirmar que o MVP Solana está pronto. Um preview dessa referência deve ser identificado como simulado.

## Erros

Explicar em português o que falhou e qual campo/configuração revisar. Manter o último resultado de build como evidência; não anunciar publicação sem URL retornada e teste da aplicação. Limite/erro do RPC não pode ser ocultado por resultado fixo.

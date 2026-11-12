> **Atualização — etapa 2:** frontend React/TypeScript/Vite, quatro telas, seleção local, scripts, lockfile e seis testes implementados. Operações ainda simuladas; Phantom, SHA-256, transação/consulta Solana e publicação Vercel continuam pendentes. Aguardar o teste do autor. Ver [frontend/README.md](../frontend/README.md). Notas abaixo sobre frontend inexistente descrevem o estado anterior à etapa 2.

# Ambiente do MVP atual

Seguir [SPEC.md](../SPEC.md) e [AGENTS.md](../AGENTS.md). O app de telas está implementado, ainda com operações simuladas. Execute as instruções de frontend/README.md para testar.

## Ferramentas

Git, Node.js 22 ou 24 LTS com npm e acesso ao repositório GitHub. Para cadastrar, Phantom com uma carteira exclusiva de testes e SOL da Devnet obtido em faucet. Não comprar moedas. Para consultar, basta navegador e internet.

No computador, planejar suporte à extensão Phantom. No celular, planejar cadastro no navegador da Phantom; consulta deve funcionar no navegador comum, sem instalar carteira.

Nunca solicitar frase-semente ou exportação de chave privada. Não há chave privada de deploy e não há programa próprio a publicar.

## Configuração pública planejada

Copiar as variáveis de [.env.example](../.env.example) para a configuração local do frontend quando ele existir. `VITE_SOLANA_CLUSTER=devnet` e `VITE_SOLANA_RPC_URL` são públicas; nunca inserir segredos em variáveis Vite. Não usar um RPC cujo token precise ficar secreto num bundle público. O endpoint público é ponto de partida, sujeito a limites e indisponibilidade.

## Estado atual e primeiro passo

`frontend/prototype/` preserva a referência original. O app React está em `frontend/src/`; em `frontend/`, execute `npm ci` e `npm run dev`. Testes: `npm test`. Build: `npm run build`. Não executar npm na raiz, que não tem package.json.

Para abrir a referência visual, seguir [frontend/prototype/README.md](../frontend/prototype/README.md). Para revisar o modelo, abrir [documento-ficticio.pdf](../fixtures/documento-ficticio.pdf).

## Arquivo real de teste

Será fornecido pelo autor. Manter em uma pasta local ignorada, por exemplo `private-test-files/`, fora de `public/`, `fixtures/` e do build. A implementação deve ler apenas no navegador. Não anexar ao PR, Actions, logs ou Vercel.

## Publicação futura

Na Vercel, conectar este repositório; usar `frontend` como raiz, Vite, `npm ci`, `npm run build` e `dist` quando esses scripts existirem. Configurar Devnet/RPC público, confirmar que a build não contém a foto e testar HTTPS em dois aparelhos. Ver [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md).

## Problemas a tratar

| Situação | Orientação simples |
|---|---|
| Phantom indisponível | Explicar como abrir em ambiente compatível; consulta continua sem carteira |
| Sem saldo de teste | Orientar faucet Devnet; não pedir compra ou chave privada |
| Usuário cancelou | Manter o arquivo selecionado e permitir tentar de novo |
| RPC indisponível/limitado | Informar falha temporária, sem mostrar sucesso fictício |
| Arquivo divergiu | Explicar que é necessário o mesmo arquivo digital; outra foto pode ter hash diferente |

O ambiente Hardhat é legado independente: [AMBIENTE_LOCAL.md](AMBIENTE_LOCAL.md). Não é requisito do MVP Solana.

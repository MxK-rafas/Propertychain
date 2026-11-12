# Nó e dados locais

O ambiente da issue #39 usa somente o Hardhat em `127.0.0.1:8545`, chainId **31337**. Não exige carteira, faucet, RPC público, chave privada ou arquivo `.env`. As contas locais são públicas e descartáveis; não as use em redes públicas. O nó não é publicado na rede externa.

## Preparar

Instale Node.js 22 ou 24 LTS e execute `npm ci` dentro de `contracts/`. Após instalar as dependências, use três comandos, todos nessa pasta:

```bash
# Terminal 1: mantenha o nó aberto
npm run node

# Terminal 2
npm run deploy:local
npm run seed:local
```

O primeiro deploy compila o contrato; o compilador precisa ter sido baixado para usar o ambiente sem internet. O deploy concede `VALIDATOR_ROLE` à segunda conta local. A primeira conta é admin, a terceira representa o titular A e a quarta o titular B.

Os três comandos deixam **a blockchain local e os dados** prontos. O frontend ainda não existe; sua implementação continua na issue #21. Assim, o critério da #39 relativo ao aplicativo conectado ainda aguarda essa integração.

## Arquivos gerados

| Arquivo | Conteúdo |
|---|---|
| `contracts/deployments/localhost.json` | Endereço, bloco e hash do bloco de deploy; endereços das contas de demonstração |
| `contracts/deployments/seed-local.json` | Referência fictícia, hashes, estados e último titular atestado |
| `frontend/generated/DocumentRegistry.json` | ABI, endereço, chainId e bloco para a futura camada de leitura |
| `frontend/.env.local` | Variáveis Vite de rede, RPC, contrato e bloco de deploy |

Todos são locais e ignorados pelo Git. O deploy atualiza suas quatro variáveis Vite preservando outras configurações presentes em `.env.local`. Fazer novo deploy muda o contrato e atualiza os arquivos; execute o seed depois dele.

## Dados fictícios

Os arquivos em `contracts/fixtures/` são textos de demonstração, não documentos imobiliários reais nem os PDFs da futura demo da issue #6. O SHA-256 usa os bytes exatos desses arquivos, incluindo a quebra de linha final.

- `escritura-a.txt` e `escritura-b.txt`: validados; baseiam duas atestações sucessivas de titular.
- `pendente.txt`: pendente.
- `rejeitado.txt`: rejeitado por documento incompleto (código 1).
- `revogado.txt`: validado e depois revogado por substituição (código 4).

A referência do imóvel é o keccak256 da string fictícia `propertychain:local:imovel-inteiramente-ficticio`. Isso serve exclusivamente ao seed; não implementa a geração por matrícula, cartório e salt prevista na issue #30.

Reexecutar o seed não envia transações quando o cenário já está pronto: não duplica documentos ou histórico. Se você alterar os estados manualmente, o script aponta a divergência em vez de sobrescrever o histórico.

## Reiniciar

Ao encerrar o nó, os dados desaparecem. Inicie-o novamente e execute deploy e seed. O seed verifica endereço, código e hash do bloco para rejeitar um arquivo de deploy antigo. Ele também recusa execução em outras redes ou em um RPC que não seja Hardhat.

## Teste de integração

Com a porta 8545 livre, dentro de `contracts/`:

```bash
npm run compile
npm run test:local
```

O teste inicia e encerra seu próprio nó, verifica permissões e exportação da configuração, confere hashes e estados usando um provedor sem carteira, repete o seed e verifica que nenhum bloco novo foi criado. Também verifica erros de deploy ausente, rede incorreta e nó reiniciado. Os arquivos locais anteriores são restaurados ao final. Se um nó de desenvolvimento estiver usando a porta, o teste falha sem encerrá-lo.

# Ambiente do aplicativo atual

Atualizado em 24/11/2026. App funcional e público em https://propertychain-theta.vercel.app/. Registro, consulta e comparação usam Solana Devnet; cartório permanece simulado. Ver [SPEC](../SPEC.md) e [guia do frontend](../frontend/README.md).

## Executar localmente

Node.js **22.12.0 ou superior** com npm; Node 22 é usado na CI. Git é necessário para clonar. Na pasta `frontend`:

```bash
npm ci
npm run dev
```

Abrir o endereço mostrado, normalmente `http://localhost:5173/`. A raiz não tem package.json. `npm ci` depende do package-lock.json já versionado: não copiar apenas package.json ou executar na pasta errada.

Verificações, na mesma pasta: `npm test` e `npm run build`. A build gera `frontend/dist`.

## Configuração pública

Usar [.env.example](../.env.example) como referência para `frontend/.env.local`, se precisar configurar além dos defaults:

```text
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

Esses valores são públicos no bundle. Não inserir token secreto em VITE_*, nem chave privada ou frase-semente. O app confere o genesis Devnet e não publica programa próprio.

## Carteira e aparelhos

Cadastro exige Phantom e saldo em SOL de teste obtido em faucet, sem compra de moedas. No computador, usar extensão compatível; no celular, usar o navegador interno da Phantom. O cálculo de hash exige localhost ou HTTPS. A conexão verifica o RPC do app e não muda a rede selecionada na UI da Phantom.

Consulta e PDF não exigem carteira. A pessoa pode entrar como comprador/verificador e colar link/código, ou abrir o link oficial recebido. Computador e celular têm as mesmas ações; apenas o layout se adapta.

## Documentos e persistência

O autor aprovou o teste local com foto real; o arquivo não foi recebido pelo Codex. Não copiar documentos pessoais para fixtures, assets, build, PRs ou logs. Pastas `private-test-files/` e `testes-privados/` são ignoradas para teste local. O arquivo não é enviado; o PDF de relatório também não contém o original ou seu nome.

O app mantém apenas comprovante público de tentativa pendente em sessionStorage. Atualizar a página perde o arquivo local e o PDF preparado; não compartilha um histórico automático entre aparelhos. Para consultar o mesmo registro, usar seu link/código.

## Publicação e problemas comuns

A Vercel já está configurada para `frontend`, build `npm run build`, saída `dist`. O endereço oficial é público; previews específicos podem exigir login. Ver [deploy](DEPLOY_VERCEL.md).

| Situação | Próximo passo |
|---|---|
| Phantom ausente ou cancelada | Abrir ambiente compatível ou tentar de novo; consulta permanece sem carteira |
| Saldo insuficiente | Obter SOL Devnet no faucet, sem comprar moedas |
| Registro pendente ou resposta incerta | Usar Conferir registro existente; não enviar outro automaticamente |
| Referência incompleta | Colar link completo ou código da transação, não SHA-256 do arquivo |
| Arquivo diferente | Usar a cópia exata; outra foto ou compressão altera o hash |
| PDF sem download automático | Usar Abrir PDF ou Baixar PDF novamente |
| Interface antiga ou endereço diferente | Conferir domínio oficial, rota e recarregar; não presumir a causa sem evidência |

Hardhat é [legado independente](AMBIENTE_LOCAL.md); não é requisito para abrir o app ou gerar relatório.

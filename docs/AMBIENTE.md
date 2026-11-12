# Ambiente de desenvolvimento

Passo a passo da issue #12. Use **apenas uma carteira de testes**, nunca a que tenha valor real.

## 1. Ferramentas
1. **Git**: https://git-scm.com
2. **Node.js LTS**: https://nodejs.org (confira com `node -v` e `npm -v`)
3. **VS Code** com uma extensão de Solidity (por exemplo, a da Nomic Foundation para Hardhat)

## 2. Carteira de testes
1. Instale a MetaMask (extensão do navegador).
2. Crie uma **carteira nova só para este projeto**. Guarde a frase de recuperação fora do computador e **nunca** a coloque no repositório.
3. Opcional, mas recomendado: crie uma segunda e uma terceira conta na mesma carteira para simular proprietário, comprador e cartório demo (usadas na issue #6).

## 3. ETH de teste e RPC
1. Obtenha ETH de teste da **Sepolia** em um faucet. Faucets mudam e às vezes exigem login ou saldo mínimo; procure um atualizado (provedores como Alchemy, Infura e Google Cloud costumam oferecer).
2. Crie uma conta em um provedor de RPC (Alchemy, Infura ou similar), crie um app para Sepolia e copie a URL.
3. Para verificar o contrato no explorador da Sepolia (issue #20), crie uma chave de API no Etherscan.

## 4. Variáveis de ambiente
Copie `.env.example` para `.env` (que já está no `.gitignore`) e preencha. **Nunca faça commit do `.env`.**

Para o deploy, use uma chave privada **exportada da carteira de testes**, nunca da carteira pessoal.

## 5. Compilar e testar o projeto existente

Use Node.js 22 LTS. Não inicialize outro projeto Hardhat dentro de `contracts/`.

```bash
cd contracts
npm ci
npm run compile
npm test
npm run coverage
```

Esses comandos usam a rede local em memória e não precisam de carteira, RPC ou `.env`. O Hardhat baixa o compilador Solidity na primeira execução. Os passos de carteira e Sepolia acima preparam uma etapa futura; a configuração atual ainda não lê `.env` nem disponibiliza deploy público.

## 6. Problemas comuns
| Sintoma | Causa provável | O que fazer |
|---------|----------------|-------------|
| Transação falha por falta de saldo | Sem ETH de teste | Pedir mais no faucet |
| Rede errada na MetaMask | Conectada na mainnet | Trocar para Sepolia |
| Erro 429 ou de limite no RPC | Plano gratuito esgotado | Aguardar ou trocar de provedor |

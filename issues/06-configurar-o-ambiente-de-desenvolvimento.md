# [Atual] Preparar ambiente Solana Devnet e Phantom

Issue GitHub: [#12](https://github.com/MxK-rafas/Propertychain/issues/12). ID original do kit: 06. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Node LTS, Git e Phantom de teste; configurar só valores públicos do RPC. Scripts frontend serão criados na etapa 2.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Cadastro usa Devnet; consulta não exige carteira; ninguém solicita frase-semente, chave privada ou exportação de conta.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Preparar as ferramentas e uma carteira de testes isolada.

## Tarefas
- [ ] Instalar Node.js LTS, Git e VS Code (com extensão de Solidity)
- [ ] Instalar MetaMask e criar uma carteira **só para testes**
- [ ] Obter ETH de teste da Sepolia (faucet) e um endpoint RPC (Alchemy, Infura ou similar)
- [ ] Criar `.env.example` e garantir que `.env` está no .gitignore
- [ ] Documentar o passo a passo em `docs/AMBIENTE.md`

## Critérios de aceite
- [ ] Consigo compilar e rodar um contrato 'hello world' na rede local do Hardhat
- [ ] Nenhuma chave privada ou segredo aparece no repositório

## Detalhes
- **Depende de:** #2
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 06 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/12

</details>

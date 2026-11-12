## Contexto
O frontend começa antes do deploy na Sepolia (marcos M1 e M2 se sobrepõem). Para desenvolver sem depender de faucet nem de rede pública, é preciso um nó local com o contrato já implantado e dados de exemplo. O mesmo ambiente serve para os testes ponta a ponta (#34).

## Tarefas
- [x] Script `npm run node` que sobe o nó local do Hardhat
- [x] Script `npm run deploy:local` que implanta o contrato e concede o papel VALIDATOR a uma conta local
- [x] Script `npm run seed:local` que cadastra e valida alguns documentos fictícios
- [x] Exportar ABI e endereço local para o frontend (`.env.local`)
- [x] Documentar em `docs/AMBIENTE.md`

## Critérios de aceite
- [ ] Do zero, três comandos deixam o app rodando contra o nó local com dados de exemplo
- [x] Nenhum segredo ou chave real usado nos scripts locais

## Detalhes
- **Depende de:** #14, #16
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 39 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/39

Ferramentas validadas em teste RPC. O app conectado depende do frontend (#21), ainda ausente.

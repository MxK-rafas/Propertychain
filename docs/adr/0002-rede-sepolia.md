> **SUBSTITUÍDA para o MVP atual** pela [ADR 0008](0008-solana-devnet-mvp.md) e [SPEC.md](../../SPEC.md). Conteúdo abaixo preservado como histórico da fase EVM, sem autorizar sua implementação no app Solana.

# ADR 0002 · Rede de testes Sepolia

**Status:** Proposto

## Contexto
O projeto é um protótipo educacional sem valor legal. É preciso uma rede pública, gratuita e com explorador de blocos.

## Decisão
Usar a testnet Sepolia. Mainnet fica fora do escopo.

## Consequências
- Sem custo real; ETH de teste via faucet.
- Reforça o aviso de "sem valor legal".
- Testnets podem ser reiniciadas ou descontinuadas; documentar endereço e bloco de deploy em `docs/DEPLOYMENTS.md` e ter plano B local (#39, #41).
- RPCs públicos limitam leitura de eventos; ver #37.


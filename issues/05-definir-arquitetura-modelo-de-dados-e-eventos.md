# [Atual] Arquitetura Solana e fontes de informação

Issue GitHub: [#11](https://github.com/MxK-rafas/Propertychain/issues/11). ID original do kit: 05. O nome histórico do arquivo é preservado; o título e escopo desta seção são atuais.

## Escopo atual — 12/11/2026

Solana Devnet, Memo com hash, Phantom única, consulta pública por assinatura, SHA-256 local, GitHub/Vercel e ausência de backend.

Fonte de verdade: [SPEC.md](../SPEC.md). Implementação pelo **Codex**, conforme [AGENTS.md](../AGENTS.md): plano antes do código, uma etapa por vez e pausa para o autor testar. Não tratar esta atualização documental como conclusão de funcionalidade.

## Pronto quando

Modelo distingue hash on-chain, arquivo local e dados fictícios. EVM não é dependência do frontend.

O estado aberto/fechado no GitHub preserva o histórico; o enquadramento atual (Atual) define se a tarefa pertence ao MVP. Conteúdo histórico abaixo não amplia o escopo.

<details>
<summary>Descrição anterior preservada (histórico)</summary>

## Contexto
Fechar as decisões técnicas antes de escrever o contrato, para evitar retrabalho.

## Tarefas
- [ ] Revisar `docs/ARQUITETURA.md` (rascunho incluído)
- [ ] Confirmar: hash SHA-256 calculado no navegador, rede Sepolia, Hardhat, React + ethers v6
- [ ] Confirmar o modelo: Documento, Imóvel (referência opaca) e Atestação de titular
- [ ] Confirmar a lista de eventos do contrato
- [ ] Fechar a tabela de códigos de motivo (`reasonCode`) de rejeição e revogação (rascunho em `docs/ARQUITETURA.md`)
- [ ] Registrar as decisões como ADRs curtos

## Critérios de aceite
- [ ] Arquitetura revisada e aprovada por você
- [ ] Interface do contrato (assinaturas e eventos) fechada

## Detalhes
- **Depende de:** #8
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 05 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/11

</details>

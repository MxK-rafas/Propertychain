# PropertyChain

Cadastro de impressão digital de documentos e consulta pública no celular. **MVP definido para Solana Devnet + Phantom, com cartório simulado.** O código e a documentação ficam neste repositório; a publicação do app funcional está prevista para a Vercel.

> Demonstração educacional, sem valor legal. O registro de um hash não comprova propriedade, autenticidade jurídica nem análise por cartório real.

## Comece aqui

- **[SPEC.md](SPEC.md): especificação atual para implementar o projeto.**
- [AGENTS.md](AGENTS.md): como a IA deve trabalhar, uma etapa por vez e com pausas para teste.
- [Comparação e alinhamento](docs/COMPARACAO_E_ALINHAMENTO.md): o que havia no GitHub, o que mudou e o que ainda não está implementado.
- [Roadmap](ROADMAP.md) e [tarefas conciliadas](ISSUES.md).

## Problema e primeira versão

Proprietários e herdeiros têm dificuldade de apresentar documentos de imóveis antigos; compradores e corretores precisam conferir sua origem. Esta versão permite cadastrar o hash de um arquivo na Solana Devnet e consultar esse registro sem carteira, inclusive em outro celular.

O app começa com uma entrada demonstrativa por perfil (proprietário, comprador/verificador ou cartório), sem autenticação. O percurso mantém quatro telas: **cadastrar documento → validação simulada pelo cartório → verificar documento → resultado**. Há um único botão principal em cada tela. O resultado distingue registro real na rede de testes, comparação exata de arquivo e informações fictícias.

O autor definiu meta de **1–5 segundos para consultar uma transação já confirmada**, quando possível. Assinar na carteira e confirmar uma nova transação são tempos separados, dependentes da pessoa e da rede; não há garantia de cinco segundos para o processo inteiro.

## Estado real da entrega

| Item | Estado |
|---|---|
| Spec, arquitetura, instruções para IA e backlog atual | Consolidados neste repositório |
| Quatro telas finais deste chat | Referência visual em [frontend/prototype](frontend/prototype/README.md), totalmente simulada |
| Modelo de documento fictício | [PDF](fixtures/documento-ficticio.pdf), [dados e SHA-256](fixtures/documento-ficticio.json) |
| Frontend React e seleção de arquivo local | Etapa 2 implementada; operações simuladas, aguardando teste do autor |
| Phantom, SHA-256 e leitura/escrita Solana | **A implementar**, nas próximas etapas da spec |
| Publicação na Vercel | Planejada; nenhum deploy Vercel foi realizado nesta consolidação |
| Foto real para teste | Será fornecida pelo autor e permanecerá local; não consta do repositório |
| Solidity/Hardhat | Código legado preservado em `contracts/`; não é dependência do novo MVP |

O [link do protótipo deste chat](https://documento-imovel-demo-rafael.equaltoucan4.chatgpt.site) mostra a referência aprovada, não uma integração Solana pronta.

## Modelo fictício e documentos reais

O exemplo usa Maria Oliveira, João Oliveira, Rua das Palmeiras, 120 e Cartório de exemplo. Todos são dados de demonstração. A foto real poderá ser selecionada **localmente** no app futuro; somente seu hash será registrado na Devnet. Não haverá OCR, upload nem publicação da foto. Os dados de Maria não serão exibidos como se viessem de um arquivo real.

Para comparar arquivos, eles precisam ter os mesmos bytes. **Duas fotos do mesmo papel geralmente não coincidem.** Sem selecionar uma cópia digital, o terceiro verifica apenas o registro, não o arquivo que tem em mãos. Veja [dados de teste](docs/DADOS_DE_TESTE.md).

## Estrutura

```text
SPEC.md                especificação ativa
AGENTS.md              instruções de trabalho para a IA
frontend/src/          app React da etapa 2, com operações simuladas
frontend/prototype/    referência visual original preservada
fixtures/              documento e dados inteiramente fictícios
docs/                  arquitetura, privacidade, ambiente e decisões
docs/historico/        evidências da fase EVM, sem efeito sobre o escopo atual
issues/                tarefas com IDs originais e escopo reconciliado
contracts/             legado Solidity/Hardhat preservado
```

## Como continuar

O autor aprovou o plano do primeiro bloco. O frontend React, scripts, lockfile, testes e CI já estão implementados. Abra [frontend/README.md](frontend/README.md) para executar e testar esta entrega. Parar para o autor testar antes de avançar para Phantom e hash; a integração Solana e a publicação Vercel continuam pendentes.

Para explorar somente a referência visual original, consulte [frontend/prototype/README.md](frontend/prototype/README.md). Para preparar o desenvolvimento futuro, consulte [docs/AMBIENTE.md](docs/AMBIENTE.md).

## Configuração e segurança

O [.env.example](.env.example) contém apenas variáveis públicas planejadas para Solana Devnet. **Nunca fornecer frase-semente ou chave privada**, nem para deploy. A Phantom aprova as transações; leitores não precisam de carteira. A Vercel hospeda o frontend e não recebe documentos pessoais.

Os testes antigos permanecem documentados em [contracts/README.md](contracts/README.md). Sua CI prova apenas o funcionamento do legado EVM, não integração com Solana. Veja [docs/CI.md](docs/CI.md).

## Licença

MIT. Veja [LICENSE](LICENSE).

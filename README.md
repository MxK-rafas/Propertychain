# PropertyChain

Cadastro de impressão digital de documentos e consulta pública no celular. **MVP publicado na Vercel, com registro na Solana Devnet e assinatura pela Phantom.** O cartório e o histórico de titulares da demonstração são simulados.

> Demonstração educacional, sem valor legal. O registro de um hash não comprova propriedade, autenticidade jurídica nem análise por cartório real.

[Abrir o PropertyChain](https://propertychain-theta.vercel.app/) · [Consultar um registro de teste sem carteira](https://propertychain-theta.vercel.app/#consulta?tx=2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G)

## Comece aqui

- **[SPEC.md](SPEC.md): especificação atual para implementar o projeto.**
- [AGENTS.md](AGENTS.md): como a IA deve trabalhar, uma etapa por vez e com pausas para teste.
- [Comparação e alinhamento](docs/COMPARACAO_E_ALINHAMENTO.md): contexto histórico da mudança de escopo.
- [Roadmap](ROADMAP.md) e [tarefas conciliadas](ISSUES.md).

## Problema e primeira versão

Proprietários e herdeiros têm dificuldade de apresentar documentos de imóveis antigos; compradores e corretores precisam conferir sua origem. Esta versão permite cadastrar o hash de um arquivo na Solana Devnet e consultar esse registro sem carteira, inclusive em outro celular.

O app começa com uma entrada demonstrativa por perfil (proprietário, comprador/verificador ou cartório), sem autenticação. O percurso mantém quatro telas: **cadastrar documento → validação simulada pelo cartório → verificar documento → resultado**. Há um único botão principal em cada tela. O resultado distingue registro real na rede de testes, comparação exata de arquivo e informações fictícias.

O autor definiu meta de **1–5 segundos para consultar uma transação já confirmada**, quando possível. Assinar na carteira e confirmar uma nova transação são tempos separados, dependentes da pessoa e da rede; não há garantia de cinco segundos para o processo inteiro.

## Estado real da entrega

**MVP concluído no escopo aprovado em 23/11/2026**, após o aceite do autor para o teste com foto real na [issue #6](https://github.com/MxK-rafas/Propertychain/issues/6). O cartório permanece simulado; o aceite não é validação jurídica do documento.

| Item | Estado |
|---|---|
| Spec, arquitetura, instruções para IA e backlog atual | Consolidados neste repositório |
| Quatro telas finais deste chat | Referência visual em [frontend/prototype](frontend/prototype/README.md), totalmente simulada |
| Modelo de documento fictício | [PDF](fixtures/documento-ficticio.pdf), [dados e SHA-256](fixtures/documento-ficticio.json) |
| Frontend React e seleção de arquivo local | Etapa 2 testada e aprovada pelo autor; PR #45 integrado |
| SHA-256 e conexão Phantom | Etapa 3 testada e aprovada pelo autor; PR #46 integrado |
| Registro Memo Devnet | Assinado pelo autor na Phantom. [PR #47](https://github.com/MxK-rafas/Propertychain/pull/47) · [Transação finalizada](https://explorer.solana.com/tx/2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G?cluster=devnet) |
| Consulta pública por terceiros | Validada no computador e no celular, sem arquivo, com a mesma cópia e com arquivo diferente. [PR #48](https://github.com/MxK-rafas/Propertychain/pull/48) |
| Publicação na Vercel | [Aplicativo HTTPS](https://propertychain-theta.vercel.app/), validado em dois aparelhos |
| Foto real para teste | Teste aprovado pelo autor em 23/11/2026. [Issue #6](https://github.com/MxK-rafas/Propertychain/issues/6) |
| Solidity/Hardhat | Código legado preservado em `contracts/`; não é dependência do novo MVP |

O [link do protótipo deste chat](https://documento-imovel-demo-rafael.equaltoucan4.chatgpt.site) mostra a referência aprovada, não uma integração Solana pronta.

## Modelo fictício e documentos reais

O exemplo usa Maria Oliveira, João Oliveira, Rua das Palmeiras, 120 e Cartório de exemplo. Todos são dados de demonstração. O app calcula o SHA-256 da foto localmente. Ao aprovar o registro, o usuário publica o hash e os metadados da transação na Devnet. O conteúdo e o nome do arquivo ficam no aparelho. Os campos fictícios do exemplo são ocultados ao selecionar um arquivo próprio.

Para comparar arquivos, eles precisam ter os mesmos bytes. **Duas fotos do mesmo papel geralmente não coincidem.** Sem selecionar uma cópia digital, o terceiro verifica apenas o registro, não o arquivo que tem em mãos. Veja [dados de teste](docs/DADOS_DE_TESTE.md).

## Estrutura

```text
SPEC.md                especificação ativa
AGENTS.md              instruções de trabalho para a IA
frontend/src/          app React com cadastro e consulta na Devnet
frontend/prototype/    referência visual original preservada
fixtures/              documento e dados inteiramente fictícios
docs/                  arquitetura, privacidade, ambiente e decisões
docs/historico/        evidências da fase EVM, sem efeito sobre o escopo atual
issues/                tarefas com IDs originais e escopo reconciliado
contracts/             legado Solidity/Hardhat preservado
```

## Como testar

1. Abra a [consulta de teste](https://propertychain-theta.vercel.app/#consulta?tx=2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G) e clique em **Verificar documento** sem escolher arquivo. O app deve confirmar o registro e indicar que o arquivo não foi comparado.
2. Repita com o [PDF fictício](fixtures/documento-ficticio.pdf) para obter correspondência. Repita com outro arquivo para ver a divergência.
3. Para executar o app localmente ou registrar um novo exemplo com a Phantom, siga o [guia do frontend](frontend/README.md).

As dez leituras do registro já confirmado tiveram mediana de 0,45 s, máximo de 1,05 s e zero erros. A medição cobre a consulta RPC e a conferência do Memo. Uma consulta no site publicado levou 1,49 s.

## Configuração e segurança

O [.env.example](.env.example) contém apenas variáveis públicas para Solana Devnet. **Nunca fornecer frase-semente ou chave privada**, nem para deploy. A Phantom aprova as transações; leitores não precisam de carteira. A Vercel hospeda o frontend e não recebe documentos pessoais.

Os testes antigos permanecem documentados em [contracts/README.md](contracts/README.md). Sua CI prova apenas o funcionamento do legado EVM, não integração com Solana. Veja [docs/CI.md](docs/CI.md).

## Licença

MIT. Veja [LICENSE](LICENSE).


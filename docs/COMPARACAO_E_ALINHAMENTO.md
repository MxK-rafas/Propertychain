# Comparação: canvas, telas/spec do chat e PropertyChain

Data: 12/11/2026. Base inspecionada no GitHub: `main`, commit **869ea6c2c2c8629fdfbf416fc58c0f7be83fab8b** (PR #43 integrado). Foram lidos README, roadmap, arquitetura, ADRs, documentos, backlog, contrato, scripts/testes e configuração. O frontend possuía apenas `.gitkeep`; não havia app funcional nem deploy público comprovado.

## O que prevalece

O autor confirmou neste chat Solana Devnet + Phantom, uma carteira, cartório simulado e consulta em outro celular sem carteira. Depois autorizou foto de documento real para teste local, repositório GitHub, publicação Vercel, objetivo de leitura de 1–5 segundos e **implementação pelo Codex**. [SPEC.md](../SPEC.md) reúne essas escolhas. O canvas é fonte de hipóteses de negócio, não autorização automática de todos os recursos futuros.

## Comparação e resolução

| Tema | GitHub antes desta consolidação | Spec/telas do chat e decisão atual | Alinhamento realizado |
|---|---|---|---|
| Rede/carteira | Sepolia, MetaMask, ethers | Solana Devnet, Phantom | Spec, ambiente, arquitetura, ADR 0008 e backlog atualizados |
| Escrita | Contrato Solidity DocumentRegistry | Memo com hash, sem programa próprio | Contratos preservados como legado, fora do build do app |
| Cartório | VALIDATOR aprova/rejeita on-chain; painel previsto | Apenas uma etapa visual simulada | Tela 2 e tarefa #28 deixam claro que não há outra carteira/transação |
| Titular/histórico | Atestação e eventos no contrato | Maria/João e histórico fixos, fictícios | Sem atestação on-chain; não associar dados do exemplo à foto real |
| Arquivo | Arquivo escolhido, hash local | Exemplo fixo inicialmente; foto real autorizada depois | PDF fictício criado; seleção local PDF/JPEG/PNG especificada, sem upload/OCR |
| Consulta | Contrato por hash, leitura de eventos | Link de transação, outro celular sem carteira | Consulta direta do Memo; comparação só com arquivo idêntico, sem arquivo apenas registro |
| Velocidade | Segundos/minutos, sem meta operacional | Preferencialmente 1–5 segundos | Medir leitura de transação já confirmada; separar confirmação de escrita e ação humana |
| Telas | Frontend vazio | Quatro telas aprovadas e revisadas | Fontes finais copiadas para frontend/prototype como referência simulada |
| Publicação | Vercel ou GitHub Pages, sem deploy | GitHub + Vercel | Instruções alvo, sem declarar publicação realizada |
| Segredos | Ambiente sugeria exportar chave de deploy | Nunca pedir chave/frase-semente | Exemplo ativo removido de chaves EVM; só variáveis públicas Devnet |
| Backlog | 41 tarefas incluindo painel, QR, IPFS, matrícula/salt | Apenas cadastro/consulta e limites aprovados | Tarefas reconciliadas com indicação Atual/Legado/Fora/Depois e descrição anterior preservada |
| IA de programação | Spec externa sem instruções consolidadas no repositório | Autor definiu o Codex | AGENTS.md e referências atuais destinadas ao Codex |

## O que foi entregue nesta consolidação

Spec e instruções do Codex, documentação/ADRs/backlog reconciliados, modelo PDF/JSON fictício e fontes das quatro telas de referência no mesmo repositório. Código Solidity, testes e histórico foram preservados; sua documentação passou a identificar a condição de legado. A CI continua a testar esse legado, com nome explícito.

## O que ainda precisa ser implementado e comprovado

Frontend React funcional, seleção/hash de arquivo, Phantom, transação Memo, consulta RPC, link sem carteira, medição de 1–5 segundos e deploy Vercel. Não há assinatura/URL de transação de teste desta nova arquitetura para apresentar nesta revisão. A foto real ainda será fornecida pelo autor e não foi publicada.

Testes e cobertura Hardhat registrados anteriormente não são evidência de integração Solana. O protótipo estático não é um app blockchain pronto. As pausas para o autor testar valem para a implementação funcional pelo Codex.

## Preservação e rastreabilidade

Contratos em contracts/ não foram apagados ou portados. ADRs substituídas e instruções locais EVM estão identificadas. Evidências e pesquisa jurídica anteriores estão em docs/historico, com data e sem alegar revalidação regulatória. Canvas/ficha preservam o texto entregue, com nota explícita sobre escopo atual.

# Revisão atual de entregas — consolidação para Solana

Base analisada: `869ea6c2c2c8629fdfbf416fc58c0f7be83fab8b`. A comparação completa está em [COMPARACAO_E_ALINHAMENTO.md](COMPARACAO_E_ALINHAMENTO.md). A revisão anterior de código EVM/CI foi preservada em [historico/REVISAO_ANTES_SOLANA.md](historico/REVISAO_ANTES_SOLANA.md).

## Documentos e referências entregues

- SPEC.md como fonte operacional atual e AGENTS.md para o Codex.
- Arquitetura, ambiente, limites, personas, ADRs, roadmap e 41 tarefas reconciliados.
- Fonte das quatro telas aprovadas em frontend/prototype, identificada como simulação.
- Modelo PDF inteiramente fictício com JSON e SHA-256 verificável.
- Plano de teste e configuração alvo Vercel, sem chave privada de deploy.
- Código/fixtures/testes Solidity preservados como legado; job de CI identificado como EVM.

## Limites da entrega

Não foi implementada a integração Solana nem realizado deploy Vercel. Não foi conectada carteira, enviada transação, validada velocidade real ou recebida foto real. A documentação não deve ser usada como prova desses resultados.

O autor deve revisar o modelo e aprovar o plano antes de o Codex iniciar a implementação funcional, uma etapa por vez. O teste por terceiros e os resultados de desempenho entram aqui quando forem realmente executados.

## Verificações desta consolidação

Conferir SHA-256 e leitura do PDF, links locais da documentação ativa, instruções destinadas ao Codex, preservação dos arquivos executáveis legados e sintaxe/navegação da referência visual. CI do PR continua responsável por verificar o legado EVM; não confundir seu resultado com validação do app novo.

## Evidências futuras a registrar

Link da transação Devnet, resultado do Memo/hash, navegador/aparelhos usados, comparação do mesmo arquivo, erro para arquivo diferente, tabela de dez consultas (mediana/máximo/erros) e URL real da Vercel. Mostrar o link da transação antes de anunciar sucesso.

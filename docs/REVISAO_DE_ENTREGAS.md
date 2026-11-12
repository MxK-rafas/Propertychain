> **Atualização — etapa 2:** frontend React/TypeScript/Vite, quatro telas, seleção local, scripts, lockfile e seis testes implementados. Operações ainda simuladas; Phantom, SHA-256, transação/consulta Solana e publicação Vercel continuam pendentes. Aguardar o teste do autor. Ver [frontend/README.md](../frontend/README.md). Notas abaixo sobre frontend inexistente descrevem o estado anterior à etapa 2.

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

## Etapa 2 — entrega aprovada para implementação

O autor aprovou o plano registrado na issue #21. Implementados frontend React/TypeScript/Vite, quatro telas, seleção local de PDF/JPEG/PNG, remoção de metadados fictícios para outro arquivo, erros de tipo/arquivo vazio e retorno ao exemplo. Não há leitura/hash, upload, persistência, Phantom ou acesso Solana.

Validação: seis testes de comportamento, TypeScript e build passaram. Chromium foi executado em 390×844 e 1440×1000, cobrindo navegação, troca de arquivo, ausência de dados fictícios, zero requisições após seleção/navegação, descarte da seleção ao recarregar, ausência de overflow horizontal e erros JavaScript. A build também serve o PDF fictício com hash idêntico à fixture. CI do frontend adicionada separadamente da EVM.

Aceite manual do autor pendente: seguir frontend/README.md. Não avançar para a etapa 3 até ele informar o resultado. Nenhuma transação ou publicação Vercel foi realizada.

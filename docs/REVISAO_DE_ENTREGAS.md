> **Estado atual — 23/11/2026:** Em 23/11/2026, o autor aprovou também o teste local com foto de documento real, concluindo o aceite do MVP no escopo da spec. O aceite foi informado pelo autor; a foto não foi enviada ao Codex nem anexada ao repositório. Isso não constitui análise da autenticidade jurídica do documento ou aprovação por cartório real. [Aceite final — issue #6](https://github.com/MxK-rafas/Propertychain/issues/6). Os registros de etapas pendentes abaixo documentam estados anteriores e não representam a situação atual.

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

## Ajuste solicitado após teste: entrada por perfil

Adicionada tela “Como deseja entrar?” antes do percurso. Proprietário vai para cadastro, comprador/verificador para consulta e cartório para a demonstração de validação. Um botão principal, três opções de perfil e ação secundária Trocar perfil; sem autenticação, contas, senhas ou autorização real. Rotas diretas preservadas; a rota padrão/desconhecida abre a entrada. Nove testes e TypeScript/build passaram, incluindo três caminhos de perfil; Chromium mobile conferiu entrada e retorno. Atualização no mesmo PR de teste, sem integrar na main antes do aceite.

## 16/11/2026 — aceite da etapa 2 e entrega da etapa 3

O autor declarou que está tudo certo e autorizou continuar. PR #45 integrado com CI verde. Etapa 3 preparada em novo PR: SHA-256 local; conexão/desconexão Phantom; validação de endereço e genesis Devnet com Kit 8.6.0; tratamento de recusa, indisponibilidade e troca de conta. 23 testes locais e build passaram. Nenhuma assinatura/transação enviada. Leitura pública de getGenesisHash conferida. Testes de carteira são controlados; teste com extensão real pelo autor continua pendente. Não avançar à escrita Memo antes desse aceite.

## Etapa 4 — escrita de hash na Devnet

O autor testou cálculo/conexão e autorizou continuar; PR #46 integrado. Implementados preparo/saldo/taxa/simulação, assinatura em bytes Wallet Standard/Phantom, checagem de mensagem/assinatura, envio único, link/recibo antes de sucesso, confirmação e conferência do Memo. Envio incerto mantém recibo público na sessão e oferece só acompanhamento; não repete envio automaticamente.

41 testes e TypeScript/build passaram. Chromium mobile percorreu o fluxo com chave efêmera, Wallet Standard e RPCs controlados, um envio interceptado e avanço após conferência. Isso não é evidência de transação real na Devnet. Não houve uso de carteira com fundos nem envio real pelo Codex. Teste/aceite do autor com link real do explorador pendente. Não iniciar etapa 5 antes desse teste.

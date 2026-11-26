# PropertyChain — especificação atual

Atualizada em 26/11/2026 com a evolução de feedbacks [#61](https://github.com/MxK-rafas/Propertychain/issues/61), sobre a main `7943b9a1d15bf22572834187178d2638cc3d8976`, e os aceites das issues [#6](https://github.com/MxK-rafas/Propertychain/issues/6) e [#56](https://github.com/MxK-rafas/Propertychain/issues/56). Esta versão descreve o comportamento entregue. A [spec anterior](docs/historico/SPEC_ANTES_REVISAO_2026-11-24.md) preserva as decisões e os estados históricos; o canvas continua como fonte de hipóteses de negócio.

## Contexto

Proprietários e herdeiros de imóveis antigos precisam apresentar documentos; compradores e corretores precisam conferir os arquivos recebidos. O PropertyChain permite registrar a impressão digital de um arquivo na Solana Devnet e consultar esse registro sem carteira, inclusive em outro aparelho.

**Pergunta do teste:** uma pessoa consegue consultar um registro confirmado e comparar sua cópia digital, sem carteira e com uma experiência simples no celular?

O MVP foi aceito pelo autor em 23/11/2026, incluindo o teste local com foto real. O relatório PDF foi aceito em 24/11/2026. A foto real não foi fornecida ao Codex nem publicada. Esses são aceites manuais do autor, separados das verificações automatizadas. O app público é https://propertychain-theta.vercel.app/ e o repositório é [MxK-rafas/Propertychain](https://github.com/MxK-rafas/Propertychain).

Registro de hash, consulta e comparação são reais na rede de testes. Cartório é uma etapa visual simulada. O registro não comprova autenticidade jurídica, identidade, titularidade ou propriedade; não recupera um documento perdido. Devnet não é infraestrutura registral permanente e pode sofrer resets.

## O que o app faz (tela por tela)

Manter entrada com exemplo guiado e três perfis. O percurso de cadastro/consulta tem quatro etapas; o exemplo acompanha as mesmas quatro etapas, sem carteira pessoal. Cada etapa tem um objetivo e uma ação principal; escolher arquivo, calcular hash, conectar carteira, voltar, compartilhar e baixar PDF são controles de apoio. Computador e celular usam as mesmas rotas e ações. A navegação lateral é ocultada no layout estreito; o indicador de etapa e o botão de voltar continuam no celular.

### Entrada — Confira a cópia do documento.

Explicar primeiro o benefício: conferir se o arquivo recebido é o mesmo que foi registrado antes. Sem login ou autorização real. Quatro opções, com **Experimentar com um exemplo** selecionada por padrão. O botão principal tem esse mesmo texto no exemplo e **Continuar com o perfil escolhido** nos demais perfis.

- Experimentar com um exemplo abre `#exemplo`, sem carteira ou instalação.

- Proprietário abre `#cadastro`.
- Comprador / verificador abre a consulta real em `#consulta`, sem carteira.
- Cartório abre `#validacao`, apenas como demonstração institucional.

URL inicial ou rota desconhecida mostra a entrada. Trocar perfil retorna à entrada. Nenhum perfil concede permissões jurídicas ou de validador.

### Exemplo guiado — `#exemplo`

**Objetivo:** experimentar o percurso completo antes de instalar uma carteira. Quatro etapas, como no app real: cadastro, cartório, verificação e resultado. A solicitação do autor de 24/11/2026 amplia a primeira versão da #61, que ensinava somente as comparações.

| Etapa | O que aparece | Ação principal |
|---|---|---|
| 1. Cadastro de exemplo | PDF fictício a anexar, hash real, carteira de exemplo e publicação ilustrada; explicações da Phantom e blockchain | Anexar documento fictício → Calcular código do arquivo → Simular conexão com a Phantom → Simular aprovação e publicação → Ir para o cartório (uma ação por estado) |
| 2. O papel do cartório | Papel de avaliar a veracidade e decidir pela validação; aprovação visual explicitamente simulada | Simular análise do cartório → Ir para verificação |
| 3. Verificar documento | Registro já existente; seleção de mesmo arquivo, arquivo diferente ou sem arquivo | Verificar documento → etapa 4 |
| 4. Resultado da verificação | Resultado real da consulta, comparação, comprovante público, detalhes e relatório PDF | Testar outro caso → etapa 3; Concluir exemplo é secundário |

Na etapa 1, buscar o PDF público ao anexar e calcular SHA-256 somente após a ação correspondente. Conferir o hash contra o JSON antes de continuar. A conexão é ilustrativa: não acessar provedor Phantom, pedir endereço, assinatura ou saldo. Explicar que no cadastro real a carteira identifica quem autoriza, conectar não publica nada, a aprovação acontece na Phantom e a taxa usa SOL de teste sem valor financeiro. Explicar que a Solana recebe código/metadados públicos, não o PDF.

**Simular aprovação e publicação** lê o registro real já existente especificado em [dados de teste](docs/DADOS_DE_TESTE.md). Exigir registro confirmado e hash da fixture; não enviar transação nova ou inventar comprovante. Mostrar o link do registro existente e identificar a publicação deste percurso como simulação. Falha de rede ou registro divergente impede avanço, mesmo sendo um exemplo.

Na etapa 2, explicar que, no serviço proposto, o cartório avaliaria a veracidade do documento e poderia validá-lo após análise. A ação didática mostra **Documento fictício validado — simulação**; nenhum cartório recebe ou examina o PDF, e essa aprovação não é gravada na blockchain. Não transformar a simulação em alegação de autenticidade/propriedade.

Na etapa 3, usar o PDF original, uma cópia com uma quebra de linha acrescentada em memória ou nenhum arquivo, conforme a escolha. Fazer nova leitura real a cada verificação, calcular o hash local quando houver cópia e só então abrir a etapa 4. A leitura anterior do cadastro não substitui essa consulta. Resultado e PDF aparecem somente na etapa final, usando os mesmos componentes e limites da consulta pública comum; o relatório não contém a aprovação simulada do cartório.

Manter um botão principal por estado, indicador das quatro etapas, explicação de cada ação e atividade durante espera. Retornar da etapa 4 permite testar outro caso sem repetir o cadastro, descartando resultado/PDF anterior. Voltar e recomeçar são secundários; recomeçar limpa anexo, hash, carteira e aprovação ilustrativos. Sair cancela/ignora respostas atrasadas. O exemplo não altera comprovante real pendente em sessionStorage. Não modificar a fixture, o cadastro real, a assinatura da Phantom ou itens de Depois/Um dia.

### 1. Cadastre seu documento — `#cadastro`

**Objetivo:** preparar e registrar o hash do arquivo.

Usar por padrão o [PDF fictício](fixtures/documento-ficticio.pdf), com os dados de exemplo do [JSON](fixtures/documento-ficticio.json). Permitir escolher PDF, JPEG ou PNG local, recusando arquivo vazio ou tipo incompatível. O arquivo não é enviado. Ao escolher outro arquivo, ocultar os dados de Maria/endereço do exemplo; não há OCR nem extração de titular.

Antes da conexão, explicar **Por que o cadastro precisa da Phantom?**: carteira digital para autorizar o registro, aprovação explícita e taxa em SOL de teste sem valor financeiro. Consulta e exemplo dispensam carteira. **Ainda não tenho a Phantom** oferece orientações para instalação pelo site oficial, rede Devnet, navegador interno no celular e créditos gratuitos de teste, além de voltar ao exemplo. Nunca pedir informações de recuperação.

A ajuda **O que é blockchain e por que ela aparece aqui?** explica código público, arquivo no aparelho, endereço público da carteira, limites jurídicos e possível indisponibilidade/reset da rede de testes. Está no exemplo, no cadastro e no formulário de consulta.

O cadastro entregue tem controles explícitos, nesta ordem de uso:

1. **Calcular código do arquivo:** SHA-256 dos bytes originais, localmente. Se usar a fixture, conferir o hash com o JSON.
2. **Conectar Phantom de teste:** obter endereço público e conferir que o RPC do app é Devnet. Isso não muda nem comprova a seleção de rede na interface da Phantom.
3. **Revisar registro:** ação principal inicial. Conferir rede, blockhash, saldo, taxa e simular a transação. A simulação envia apenas o hash ao RPC; não publica o registro.
4. Mostrar resumo de rede, pagador, hash e taxa. A ação principal passa a **Aprovar registro na Phantom**. A carteira solicita assinatura; o app verifica mensagem e assinatura antes do envio.
5. Guardar comprovante público da tentativa, mostrar link do explorador e enviar uma única vez. Aguardar confirmação e conferir programa, pagador e hash. Somente então avançar à etapa 2.

A implementação não possui um botão único chamado Cadastrar documento que automaticamente conecta, calcula e assina. A separação atual permite revisar a operação antes de aprovar. Cancelar preparação é secundário e não envia transação.

Clique repetido não duplica o envio. Arquivo/navegação ficam bloqueados durante o processamento. Em resposta incerta, manter o comprovante e oferecer **Conferir registro existente** (somente leitura), sem nova assinatura ou reenvio automático. Erros, recusa, saldo insuficiente e expiração recebem mensagens em português. Confirmar na Phantom não equivale, por si, a confirmação na rede.

### 2. Validação pelo cartório — `#validacao`

**Objetivo:** explicar a etapa institucional simulada.

Mostrar resumo do arquivo, Cartório de exemplo — simulação e aviso de que nenhum cartório real analisou o documento. Quando o cadastro acaba de confirmar nesta sessão, mostrar o hash, o link do explorador Devnet e **Abrir consulta pública**.

**Botão principal: Ver validação simulada.** Com comprovante confirmado em memória, avançar à consulta desse registro; sem comprovante (entrada pelo perfil Cartório), avançar ao formulário de consulta, que exige informar um registro. Não criar aprovação on-chain ou nova assinatura.

O comprovante de sucesso e o arquivo ficam em memória da sessão do app; a tela de cartório aberta diretamente não recupera automaticamente um cadastro concluído em outro aparelho.

### 3. Verificar documento — `#consulta` ou `#consulta?tx=…`

**Objetivo:** consultar um registro como terceiro, sem carteira.

Título atual: **Verificar documento**. Oferecer o campo **Cole o link do registro** e um arquivo local opcional para comparação. Um link recebido preenche a identificação; a página inicial permite informar essa referência na própria tela, sem abrir uma consulta simulada.

Aceitar código da transação, links de consulta/resultado no domínio oficial ou em deploys antigos do PropertyChain na Vercel e links do explorador Solana com `cluster=devnet`. Interpretar a referência localmente, sem visitar a origem colada. Assinatura inválida ou referência incompleta não é confirmação de registro.

**Botão principal: Verificar documento.** Conferir Devnet e buscar a transação com commitment `confirmed`. Inspecionar sucesso, pagador e instruções esperadas. Se houver arquivo local, calcular SHA-256 e comparar. Registro confirmado com arquivo diferente também avança ao resultado, explicitando a divergência; não é sucesso da comparação.

Sem arquivo, consultar somente o registro. A consulta não faz busca por nome, matrícula, endereço ou hash em um catálogo e não recupera o PDF original. Arquivos não são analisados visualmente. Erros, registro inexistente ou incompatível mantêm a pessoa na consulta com explicação.

### 4. Resultado da verificação — `#resultado?tx=…`

**Objetivo:** explicar o registro encontrado e a comparação realizada.

Exibir separadamente:

- Registro confirmado na Devnet, somente após leitura válida.
- **Mesmo arquivo**, **Arquivo diferente** ou **Arquivo não comparado**, com frase curta explicando a comparação, sem equiparar divergência a fraude.
- **Ver detalhes do registro**, fechado inicialmente: código registrado (SHA-256), código da transação, tempo para consultar a rede de testes e tipo do documento.
- **Ver comprovante público** abre o explorador Devnet; **Copiar link da consulta**, sempre em `https://propertychain-theta.vercel.app/`. Se o clipboard falhar, mostrar o endereço para copiar manualmente.
- Tipo: **Não identificado pelo app**. Nenhum cartório real analisou o documento; cartório/histórico da demonstração são fictícios.
- **Baixar relatório em PDF**, controle secundário da evolução aceita na #56.

A consulta real atual não apresenta Maria Oliveira, João Oliveira ou histórico de titulares, mesmo para a fixture. Esses dados continuam nos arquivos do exemplo e na [referência visual histórica](frontend/prototype/README.md); não são dados obtidos da blockchain nem uma funcionalidade de histórico público entregue.

**Botão principal: Fazer nova consulta.** Voltar à etapa 3 com a referência, limpar o arquivo e o resultado anterior e descartar o relatório preparado. Trocar/remover o arquivo também invalida a comparação anterior. Abrir diretamente uma rota de resultado sem resultado em memória retorna à consulta; não fabrica sucesso nem restaura comparação de outro aparelho.

### Relatório PDF — evolução #56 concluída

Gerar o PDF localmente e sob demanda, somente depois de uma consulta confirmada. Incluir: PropertyChain, Devnet, status do registro, SHA-256 registrado, identificação da transação, comparação (igual/diferente/sem arquivo), data/hora da consulta em UTC segundo o relógio do aparelho e links oficiais da consulta/explorador. A data não é carimbo certificado nem horário da transação.

O PDF descreve aquela leitura; abri-lo não consulta novamente a rede. Incluir limites do registro e identificação de rede de testes. Não incluir nome ou conteúdo do arquivo original, imagem, titular ou anexo. Não oferecer relatório de sucesso em consulta inválida, inexistente, pendente ou com erro.

Carregar pdf-lib só ao solicitar o relatório. Depois de gerar, oferecer **Abrir PDF** e **Baixar PDF novamente** para navegadores que não iniciem o download automático. Liberar o URL temporário ao sair do resultado. O autor aceitou a entrega em 24/11/2026; não há histórico de relatórios salvo no app.

## Configuração

### Aplicativo e bibliotecas

Frontend estático React + TypeScript + Vite em `frontend/`, publicado por HTTPS na Vercel. Executar comandos dentro de `frontend`: `npm ci`, `npm run dev`, `npm test`, `npm run build`. A raiz não tem package.json. Node mínimo 22.12.0; CI usa Node 22. Instalar com o lockfile versionado.

**Use o Solana AI Kit e as bibliotecas atuais da Solana (@solana/kit e Wallet Phantom).** O AI Kit foi orientação em modo sem instalação; não é dependência runtime nem carteira de servidor. A conexão usa o provedor oficial Phantom, e a assinatura usa Wallet Standard. Versões resolvidas conferidas nesta revisão: @solana/kit 8.6.0, @wallet-standard/app 1.1.1 e pdf-lib 1.17.1. Ver [arquitetura](docs/ARQUITETURA.md) e [referências do AI Kit](docs/SOLANA_AI_KIT.md).

### Rede e transação

Somente Solana Devnet e SOL de teste, sem valor financeiro. Defaults públicos: `VITE_SOLANA_CLUSTER=devnet` e `VITE_SOLANA_RPC_URL=https://api.devnet.solana.com`. Conferir o genesis da rede. Configuração local em `frontend/.env.local` ou no projeto Vercel; nunca inserir segredo em VITE_*.

Transação v0 com uma instrução Compute Budget de taxa de prioridade zero e uma instrução Memo `propertychain:v1:sha256:` seguida do SHA-256 hexadecimal minúsculo de 64 caracteres. Programa Memo: `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`. Conferir igualdade byte a byte da mensagem assinada, assinatura do pagador, simulação e prazo antes de transmitir.

A confirmação exige status confirmado/finalizado sem erro e leitura do conteúdo esperado. A consulta aceita também registros anteriores com apenas o Memo, rejeitando programas/instruções extras incompatíveis. Ler a instrução, não procurar apenas texto nos logs. O hash registrado vem da transação; o hash para comparação vem do arquivo local, nunca de um parâmetro não verificado.

### Dados e persistência

O arquivo original fica no aparelho, sem OCR, upload ou armazenamento remoto. Duas cópias com os mesmos bytes coincidem; duas fotos do mesmo papel normalmente não. O hash e os metadados da transação, inclusive a carteira, são públicos; hash não é garantia de anonimato.

Antes do envio, guardar apenas hash, pagador e assinatura em `sessionStorage` da aba. Isso recupera uma tentativa incerta após atualizar a página. Não guardar arquivo, nome, imagem, segredo ou bytes assinados. Remover o comprovante pendente após confirmação/falha conclusiva. O sucesso concluído não é uma lista persistente de documentos. Recarregar descarta seleção local e PDF preparado.

### Publicação e desempenho

Vercel: Root Directory `frontend`, framework Vite, instalação `npm ci`, build `npm run build`, saída `dist`. O [domínio oficial](https://propertychain-theta.vercel.app/) é público sem login; previews temporários podem ser protegidos. `frontend/prototype/` e `contracts/` não são a aplicação publicada.

Meta de 1–5 segundos para leitura de um registro confirmado, sem garantia externa. O tempo mostrado mede conferência do RPC Devnet e leitura/conferência do Memo; não inclui carregamento, seleção/hash local, aprovação humana, envio/confirmação de nova transação ou geração do PDF. Não confundir medições técnicas com o tempo total percebido.

## Regras

- Português, letras legíveis no celular e uma ação principal por tela/estado.
- Nunca pedir frase-semente ou chave privada. A assinatura acontece na Phantom.
- Mostrar o link do explorador antes de anunciar sucesso e conferir transação/Memo.
- Explicar espera e erros honestamente; nunca substituir falha por dados fictícios.
- Não versionar foto real, credenciais ou dados pessoais no repositório, build, logs ou relatório.
- Não anunciar autenticidade jurídica, análise de cartório ou propriedade confirmada.
- Usar arquivos fictícios em testes automatizados. Aceite manual do autor não é auditoria independente de conteúdo.

## Fora do escopo

Contas/senhas, autorização real por perfil, banco de dados, upload/armazenamento remoto, OCR, catálogo de imóveis, busca por matrícula/salt/nome, NFT/token, transferência de propriedade, programa próprio, painel do validador, aprovação/rejeição/revogação on-chain de cartório, atestação de titular, histórico real de propriedade, QR code do app, analytics e cobrança.

O relatório PDF saiu de Depois mediante aprovação e está entregue. Continuam em **Depois**: taxas por documento/consulta, planos mensais, piloto com cartórios e armazenamento seguro acompanhado de avaliação jurídica/privacidade. **Um dia**: licenciamento para cartórios. Nada disso é implementação autorizada automaticamente. Ver [roadmap](ROADMAP.md).

## Como vamos trabalhar

Plano antes do código, uma etapa por vez e pausa para teste do autor, conforme [AGENTS.md](AGENTS.md). Explicar erros e testes em linguagem simples. Atualizar os documentos ativos, mantendo decisões anteriores em histórico. Não enviar mensagens a terceiros ou usar documentos reais em apresentações públicas sem instrução específica.

A preparação para o Demo Day ([#7](https://github.com/MxK-rafas/Propertychain/issues/7)) foi entregue com dez slides e notas. O [roteiro e as respostas para a banca](docs/PITCH_DEMO_DAY.md) fazem parte da documentação. A realização da apresentação e o ensaio do autor ainda não foram confirmados.

O [exemplo guiado e a revisão de linguagem](docs/FEEDBACKS_E_EXEMPLO_GUIADO.md) foram entregues na [#61](https://github.com/MxK-rafas/Propertychain/issues/61). O autor confirmou o funcionamento do percurso completo no computador e no celular. A próxima rodada com usuários vai avaliar a clareza da nova redação.

## Etapas e aceite

| Etapa | Estado | Pronto quando |
|---|---|---|
| 1. Escopo e modelo fictício | Concluída | Autor revisa modelo e aprova decisões, sem compartilhar segredos |
| 2. Telas e seleção local | Concluída | Percurso legível, arquivo local sem upload e dados fictícios separados |
| 3. SHA-256 e Phantom | Concluída | Mesmo arquivo gera mesmo hash; conexão, recusa e troca de conta tratadas |
| 4. Registro Memo Devnet | Concluída | Link do explorador, status sem erro e Memo/hash conferidos; envio incerto não é repetido |
| 5. Consulta pública | Concluída | Registro sem carteira e três resultados corretos; medições técnicas identificadas |
| 6. Publicação e revisão | Concluída | HTTPS público, testes em dois formatos e aceite do autor na #6 |

A evolução de PDF foi publicada no [PR #57](https://github.com/MxK-rafas/Propertychain/pull/57) e aceita na [#56](https://github.com/MxK-rafas/Propertychain/issues/56). A [revisão de entregas](docs/REVISAO_DE_ENTREGAS.md) separa testes automatizados, consulta pública e aceites manuais. As etapas concluídas não prometem ausência de bugs ou prontidão para operação imobiliária em produção.

## Revisão de linguagem — 25/11/2026

Após o autor confirmar funcionamento no computador e no celular, novos testadores ainda tiveram dúvidas sobre a finalidade e relataram excesso de texto. A revisão explica na entrada: comparar um documento de imóvel com uma versão registrada para conferir se o arquivo mudou. Não promete autenticidade, titularidade ou transferência.

Instruções curtas por estado; hash apresentado como código do arquivo. Passos, código calculado e explicações de Phantom/blockchain/cartório ficam em detalhes fechados, disponíveis por toque e teclado. O exemplo mantém as quatro etapas e os três casos; carteira/cartório simulados e comparação real permanecem explícitos. Taxa, rede, código e carteira na revisão de uma transação real continuam visíveis antes da aprovação.

O aceite anterior do percurso completo foi informado pelo autor em 24/11/2026. A compreensão desta nova redação ainda precisa de feedback; testes técnicos não comprovam melhora de entendimento.

# PropertyChain — especificação do MVP

Decisões consolidadas com o autor em 12/11/2026. Esta é a fonte de verdade para a implementação atual. O Lean Canvas e a ficha preservam as hipóteses de negócio; documentos e contratos da fase EVM são históricos quando conflitarem com esta spec. Não tratar planejamento como funcionalidade entregue.

## Contexto

Proprietários e herdeiros de imóveis antigos têm dificuldade para encontrar e apresentar documentos confiáveis. Compradores e corretores precisam entender a origem desses documentos. O PropertyChain testa um caminho simples de cadastro e consulta no celular.

O MVP registra uma impressão digital de arquivo em **Solana Devnet**, com **uma carteira Phantom**, e permite consulta por terceiros sem carteira. O cartório e o histórico de titulares são **simulados**. Registrar um hash não prova a autenticidade jurídica do conteúdo nem a propriedade do imóvel.

O projeto é único: código e documentação no [GitHub](https://github.com/MxK-rafas/Propertychain), publicação prevista na **Vercel**. A referência visual está versionada em [frontend/prototype](frontend/prototype/README.md); o [protótipo deste chat](https://documento-imovel-demo-rafael.equaltoucan4.chatgpt.site) é apenas uma referência de aparência e navegação.

**Pergunta do teste:** outra pessoa consegue consultar o registro de um documento já confirmado, em outro celular, sem carteira e preferencialmente em **1 a 5 segundos**?

O autor pediu um modelo fictício e fornecerá uma foto de documento real para testes locais. Essa foto não integra o repositório nem a publicação. Não inventar leitura automática de seu conteúdo.

## O que o app faz (tela por tela)

Manter quatro telas, um objetivo e um botão principal em cada uma. Voltar, escolher arquivo, abrir explorador e compartilhar link são controles secundários. Estados de carteira, espera e erro aparecem dentro dessas telas.

### 1. Cadastrar documento

**Objetivo:** registrar a impressão digital do arquivo escolhido.

- Título: “Cadastre seu documento.”
- Antes da ficha: “Vamos usar um documento fictício para você conhecer o caminho do cadastro à verificação.”
- Por padrão, carregar o [PDF fictício](fixtures/documento-ficticio.pdf), seus dados e a identificação “Demonstração — dados fictícios”.
- Permitir substituir esse exemplo por uma foto local de teste (JPEG ou PNG) ou por um PDF, sem upload. A escolha é opcional; não criar catálogo ou múltiplos cadastros de arquivos.
- Ao substituir o exemplo, explicar: “Seu arquivo será lido apenas neste dispositivo. Somente sua impressão digital será registrada na rede de testes.” Ocultar Maria Oliveira, endereço e histórico de exemplo. Não sugerir que esses dados vieram da foto.
- Mostrar a rede Devnet, o arquivo selecionado e os estados da operação.

**Botão principal: “Cadastrar documento”.** Conectar a Phantom se necessário, calcular SHA-256 dos bytes exatos do arquivo, solicitar assinatura, enviar uma única transação e verificar confirmação e sucesso. A assinatura ocorre na carteira, sem outra tela do app. Só avançar à tela 2 quando houver confirmação e hash correto.

Cancelamento, falta de saldo de teste ou falha mantêm a pessoa na tela com explicação e nova tentativa. Bloquear cliques repetidos enquanto a operação estiver pendente. Não reenviar automaticamente uma transação cujo resultado ainda seja incerto.

### 2. Validação pelo cartório

**Objetivo:** demonstrar o papel do cartório, sem outra transação.

- Título: “Validação pelo cartório.”
- Texto: “Documento cadastrado. No serviço, esta etapa será realizada pelo cartório.”
- Texto: “Aqui, vamos demonstrar o resultado dessa validação. Depois, você verá a consulta como comprador ou corretor.”
- Mostrar resumo do arquivo, “Cartório de exemplo — simulação” e o aviso de que não houve análise por cartório real.
- Mostrar o link da transação confirmada na Devnet. Não confundir confirmação da rede com aprovação do cartório.

**Botão principal: “Ver validação simulada”.** Avançar à tela 3, sem solicitar outra carteira ou assinatura. A simulação é somente apresentação e não cria um estado de aprovação na blockchain.

### 3. Verificar documento

**Objetivo:** consultar o registro como comprador ou corretor, sem carteira.

- Título: “Conheça a origem do documento.”
- Aviso: “Validação pelo cartório simulada.”
- Identificar o registro recebido pelo link. O link deve abrir diretamente nesta tela em outro celular, sem exigir as telas anteriores.
- No exemplo fictício, usar o mesmo PDF e seus dados fixos.
- Para outro arquivo, permitir selecionar localmente uma cópia digital idêntica, como controle secundário. Sem arquivo, explicar que só será consultado o registro na rede, sem comparação com a foto.
- Não buscar um imóvel por endereço, matrícula ou nome. Não exigir Phantom para leitura.

**Botão principal: “Verificar documento”.** Consultar a transação na Devnet, conferir sucesso, programa Memo e formato esperado. Se houver arquivo local, comparar seu SHA-256 com o valor do Memo. Avançar ao resultado apenas após uma resposta conclusiva.

Se faltar identificação, a transação não existir, tiver falhado, ainda estiver pendente ou o arquivo divergir, explicar a situação. Não apresentar aprovação automática nem substituir uma falha por dados fictícios.

### 4. Resultado da verificação

**Objetivo:** explicar exatamente o que foi encontrado.

Exibir separadamente:

- **Registro na Solana Devnet:** confirmado, somente após consulta real com sucesso.
- **Arquivo:** “Corresponde ao arquivo registrado” apenas após comparação do hash. Sem arquivo: “Registro encontrado; arquivo não comparado”.
- **Tipo de documento:** “Escritura do imóvel” exclusivamente para o exemplo; para uma foto real sem análise, “Não identificado pelo app”.
- **Validado por:** “Cartório de exemplo — simulação”, acompanhado de “Nenhum cartório real analisou este documento”.
- Link da transação no explorador e link da consulta para compartilhar, sem incluir imagem, nome do arquivo ou dados pessoais.

Somente no exemplo fictício, mostrar Maria Oliveira, Rua das Palmeiras, 120 e o histórico: João Oliveira (1985), seguido de Maria Oliveira (2024, herança). Usar “Titular apresentado na demonstração” e “Histórico fictício”. Para um arquivo real, não exibir essa história como se pertencesse ao documento.

**Botão principal: “Fazer nova consulta”.** Voltar à tela 3 com o mesmo registro, sem transação nova.

## Configuração

### Rede, carteira e bibliotecas

Usar exclusivamente **Solana Devnet** e SOL de teste, sem valor financeiro. Uma única carteira Phantom controlada pelo autor aprova o registro. Consulta pública usa conexão somente de leitura.

**Use o Solana AI Kit e as bibliotecas atuais da Solana (@solana/kit e Wallet Phantom).**

Antes da implementação, consultar documentação oficial e confirmar versões e compatibilidade. Não copiar receitas antigas de SDK. O AI Kit não autoriza agentes autônomos, carteiras de servidor ou exposição de chaves. Se algum recurso exigir segredo ou não for compatível, explicar no plano e propor uso seguro dos recursos necessários.

Manter React + TypeScript + Vite como proposta do frontend, substituindo a antiga integração ethers/EVM por Solana. Não adicionar backend ou banco de dados para este MVP.

### Registro e consulta

- Usar o programa Memo existente; não criar um programa Solana próprio.
- Conteúdo do Memo: `propertychain:v1:sha256:` seguido do hash SHA-256 hexadecimal de 64 caracteres em minúsculas.
- Calcular SHA-256 no navegador, sobre os bytes originais. Não comprimir, recortar ou normalizar a imagem antes do cálculo.
- O programa Memo esperado deve ser explicitamente verificado, não apenas uma ocorrência de texto nos logs. Conferir `meta.err == null` e confirmação `confirmed` ou `finalized`.
- A identificação pública é a assinatura da transação. Gerar um link com essa assinatura e a rota de consulta; não depender de localStorage de outro dispositivo.
- O hash esperado vem do arquivo local; o hash registrado vem da instrução Memo. Parâmetros do link não são prova de autenticidade. Validar formato e comprimento antes de consultar.
- Se houver várias instruções conflitantes ou um Memo fora do padrão, não aceitar silenciosamente.
- O fato de alguém registrar um arquivo não prova que essa pessoa é proprietária ou um cartório autorizado.
- Repetir uma consulta nunca envia transação. Registrar de novo o mesmo hash pode produzir outra transação; não prometer exclusividade de documento neste modelo.

Explorador: `https://explorer.solana.com/tx/ASSINATURA?cluster=devnet`.

### Dados fictícios e foto real

O modelo é [fixtures/documento-ficticio.pdf](fixtures/documento-ficticio.pdf), acompanhado de dados e hash em [fixtures/documento-ficticio.json](fixtures/documento-ficticio.json). Não alterar seus bytes sem atualizar o hash. O conteúdo é uma ficha de demonstração, não uma reprodução de escritura oficial.

A foto real será fornecida posteriormente pelo autor. Ler somente em memória no navegador; não enviar para GitHub, Vercel, RPC, IPFS, analytics, OCR ou armazenamento. Somente o hash vai à blockchain, junto dos metadados públicos próprios da transação, como carteira e horário. Um hash não garante anonimato.

**Duas fotos do mesmo papel normalmente têm hashes diferentes.** Para testar correspondência, usar uma cópia do mesmo arquivo digital. Hash não reconhece documentos visualmente nem recupera uma foto perdida. O terceiro precisa receber o arquivo original fora do app se quiser compará-lo.

### GitHub e Vercel

- Repositório único: `MxK-rafas/Propertychain`.
- Frontend funcional a implementar em `frontend/`; referência visual separada em `frontend/prototype/`.
- Publicação futura na Vercel: raiz `frontend`, instalação `npm ci`, build `npm run build`, saída `dist` e HTTPS. Esses scripts ainda serão criados durante a implementação; não afirmar que já funcionam.
- Preferir rotas por fragmento (`#consulta`) para permitir abertura direta sem reescrita de servidor. O link identifica a transação e preserva o domínio local ou publicado.
- Variáveis planejadas: `VITE_SOLANA_CLUSTER=devnet` e `VITE_SOLANA_RPC_URL`. Só valores públicos podem estar em `VITE_*`; não colocar tokens secretos do provedor no frontend.
- Não há chave privada de deploy ou endereço de contrato próprio.
- A publicação na Vercel e a validação com Phantom são etapas futuras, não entregas desta consolidação documental.

### Meta de velocidade

Buscar consulta em **1 a 5 segundos**, do toque em “Verificar documento” até resultado conclusivo de um registro já confirmado, incluindo comparação local quando houver arquivo selecionado. Não é garantia da rede.

Medir separadamente: carregamento inicial do app, seleção do arquivo, aprovação humana na Phantom e envio/confirmação de nova transação. Não esconder esses tempos para afirmar que todo o processo dura cinco segundos.

Ler apenas a transação necessária, evitar varrer blocos ou históricos, carregar sob demanda o código da carteira e não exigir conexão para leitura. Cache de recursos estáticos é permitido; uma aprovação antiga em cache não substitui a consulta real.

Medir pelo menos dez consultas no celular, incluindo outro aparelho sem carteira e primeira consulta sem cache. Anotar mediana, máximo, quantidade de erros e condições de rede. Se passar de cinco segundos, mostrar espera honesta e investigar RPC/rede; nunca fabricar sucesso para cumprir a meta. Registrar tempo de hash e tamanho do arquivo separadamente para identificar fotos grandes.

## Regras

- Português em toda a interface, fontes grandes, bom contraste, poucas cores e botões acessíveis no celular.
- Preservar o visual claro com verde escuro e as quatro telas finais do protótipo.
- Nunca pedir frase-semente ou chave privada, em chat, formulário, terminal ou `.env`. Assinatura ocorre na Phantom.
- Somente Devnet. O app deve verificar a rede utilizada e não registrar em Mainnet.
- Fotos e documentos pessoais não podem ser versionados, enviados em logs ou incorporados ao build público. Testes automatizados usam somente fixtures fictícias.
- Sem OCR, extração automática de nomes, avaliação jurídica, detecção de fraude por imagem ou inferência de proprietário.
- Mensagens claras para carteira ausente, cancelamento, saldo de teste insuficiente, rede indisponível, registro pendente/não encontrado, transação falha e arquivo divergente.
- Nunca mostrar “funcionou” por receber apenas uma assinatura. Conferir sucesso e hash na Devnet.
- Sempre distinguir registro técnico real, cartório simulado e dados fictícios. O exemplo não é resultado da análise de uma foto real.
- Não criar funcionalidades fora desta spec.

## Fora do escopo

Contas/login, banco de dados, upload/armazenamento remoto de documentos, catálogo de imóveis, busca por matrícula/salt, NFT/token, transferência de propriedade, programa próprio, validação/rejeição/revogação on-chain por cartório, painel do validador, segunda carteira, atestação on-chain de titular, histórico real de propriedade, QR code, analytics e cobranças.

**Depois:** relatórios; taxas por documento/consulta; planos mensais; piloto com cartórios; armazenamento seguro para documentos reais e preparação jurídica/LGPD para essa operação.

**Um dia:** licenciamento para cartórios.

O registro de hash na Devnet e a seleção local da foto real foram antecipados expressamente pelo autor. Isso não traz os demais itens do roadmap para o MVP. Os contratos Solidity em `contracts/` são legado preservado, não dependência do app atual.

## Como vamos trabalhar

Estas instruções são para o Codex e qualquer IA de programação:

1. Ler esta spec, [AGENTS.md](AGENTS.md) e a comparação com o repositório. Apresentar plano simples **antes do código** e esperar aprovação.
2. Trabalhar uma etapa por vez. Explicar o que mudou, como abrir e como testar; parar e aguardar meu teste antes de avançar.
3. Explicar erros em linguagem simples: o que aconteceu, o que impede e qual é o próximo passo.
4. Nunca solicitar segredos. Se eu precisar agir na Phantom ou Vercel, explicar o que conferir e aguardar essa ação.
5. **Mostrar o link da transação no explorador antes de dizer que funcionou**, após confirmar sucesso e Memo correto na Devnet.
6. Não tratar um teste de contrato EVM, uma simulação ou uma tela pronta como prova de integração Solana.
7. Não enviar foto real ao repositório ou a serviços externos. Não inventar dados extraídos dela.
8. Se uma escolha técnica estiver incompatível ou faltar um dado, explicar e propor a menor solução dentro do escopo.
9. Atualizar documentação e evidências ao concluir uma etapa, sem marcar tarefas futuras como entregues.

## Etapas

### 1. Revisar modelo, decisões e plano

Revisar o PDF fictício, o escopo da foto local, a arquitetura Solana e o plano. Esta consolidação fornece os documentos, mas não substitui o aceite do autor.

**Pronto quando:** abro o modelo, confirmo que é fictício e aprovo o plano sem compartilhar foto real, frase-semente ou chave privada.

### 2. Implementar as quatro telas no frontend

Preparar React/TypeScript/Vite, reproduzir a referência visual e permitir exemplo ou arquivo local. Nesta etapa, identificar que a blockchain ainda está simulada. Preparar scripts de build/teste e CI do frontend sem torná-lo dependente de `contracts/`.

**Pronto quando:** percorro as quatro telas no celular; ao selecionar uma foto de teste, os dados de Maria desaparecem; o arquivo não é enviado a servidor; build e verificações do frontend passam.

### 3. Conectar Phantom e calcular hash

Implementar assinatura pela carteira de teste e cálculo local, sem armazenar segredos. Comparação usa cópia idêntica do arquivo.

**Pronto quando:** conecto a Phantom na Devnet, posso cancelar sem travar e o mesmo arquivo produz sempre o mesmo hash; um arquivo alterado produz outro.

### 4. Registrar na Solana Devnet

Implementar Memo, confirmação, proteção contra clique repetido, erros e link do explorador.

**Pronto quando:** aprovo uma transação, vejo o link da Devnet e confiro seu sucesso e hash. Cancelamento/falha não mostram cadastro concluído. A simulação do cartório não cria outra transação.

### 5. Consultar em outro celular e medir

Implementar link público sem carteira, leitura da transação, comparação opcional do arquivo e distinção entre registro encontrado e arquivo comparado.

**Pronto quando:** outra pessoa abre o link sem Phantom, verifica o exemplo e compara uma cópia idêntica de um arquivo; uma cópia diferente não passa. Executamos dez consultas e registramos os tempos frente à meta de 1–5 segundos, sem falsificar confirmação.

### 6. Publicar na Vercel e revisar a entrega

Conectar o repositório ao projeto Vercel, configurar build/variáveis públicas e repetir testes de leitura no link HTTPS.

**Pronto quando:** abro o app publicado em dois aparelhos, cadastro com Phantom onde suportado, consulto no outro sem carteira, não encontro foto real no código/build/logs e consigo explicar o que é registro real e o que é simulação.

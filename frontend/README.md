# PropertyChain — registro e consulta na Devnet

[Versão publicada na Vercel](https://propertychain-theta.vercel.app/) · [Consulta de teste sem carteira](https://propertychain-theta.vercel.app/#consulta?tx=2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G)

O autor testou e aprovou cálculo e conexão da etapa 3; PR #46 integrado. O aplicativo entregue registra um hash com Memo na Solana Devnet, consulta o registro e gera relatório PDF. **A consulta lê registros reais da Devnet; o cartório e o histórico do exemplo são simulados.** Não há contas/senhas, contrato próprio ou transferência de propriedade.

## Abrir e preparar

Na pasta `frontend`, com Node.js 22.12+ (preferencialmente 24 LTS):

```bash
npm ci
npm run dev
```

Abra o endereço inicial mostrado (normalmente `http://localhost:5173/`), sem fragmento, e escolha Proprietário. Use localhost ou HTTPS para Web Crypto. No celular, o cadastro com carteira usa o navegador interno da Phantom e HTTPS. A consulta não exige carteira e funciona também no navegador comum. O app está publicado na Vercel.

Use uma carteira exclusiva de testes. Ative a visualização Devnet na Phantom. Para a taxa, obtenha **SOL de teste**, sem valor financeiro, no [faucet oficial](https://faucet.solana.com/). Não compre moedas. O app nunca pede frase-semente ou chave privada.

## Experimentar antes de instalar carteira

Na página inicial, mantenha **Experimentar com um exemplo** e clique no botão de mesmo nome. O guia acompanha quatro etapas: cadastro do exemplo, cartório, verificação e resultado com relatório. No cadastro, anexe o PDF fictício, calcule seu hash, simule a conexão e a aprovação/publicação. Leia as explicações da Phantom e blockchain nessa etapa. Depois, simule a análise do cartório. Na verificação, escolha mesmo arquivo, arquivo diferente ou sem arquivo; o resultado e o PDF aparecem na etapa 4. Testar outro caso retorna à verificação. Leia a explicação e use o botão principal em cada passo. Nenhuma carteira ou pagamento é solicitado; a publicação ilustrada confere um registro já existente e cada verificação faz nova leitura real da Devnet. Não há publicação nova nem análise real de cartório no guia. Erro de rede ou registro indisponível não vira sucesso: tente novamente ou consulte outro registro.

O resultado destaca **Mesmo arquivo**, **Arquivo diferente** ou **Arquivo não comparado**. **Ver comprovante público** abre o explorador; os códigos e o tempo ficam em **Ver detalhes do registro**. Você pode baixar o relatório sem carteira. Ao concluir, a entrada permite escolher seu perfil.

Antes de conectar no cadastro, leia **Por que o cadastro precisa da Phantom?** e **Ainda não tenho a Phantom**. A consulta e o exemplo dispensam instalação. A ajuda sobre blockchain explica o código público, o arquivo no aparelho e os limites da rede de testes. [Feedback e critérios da evolução #61](../docs/FEEDBACKS_E_EXEMPLO_GUIADO.md).

## Teste real de cadastro pelo autor

1. Use primeiro o PDF fictício. Você pode abrir o exemplo ou escolher um PDF/JPEG/PNG local; nenhum arquivo é enviado. Para arquivos próprios, dados de Maria/endereço/histórico são ocultados.
2. Clique em **Calcular código do arquivo** e depois **Conectar Phantom de teste**. O app confere o RPC Devnet por getGenesisHash; isso não altera a seleção de rede da interface da Phantom.
3. Clique em **Revisar registro**. O app busca o blockhash, monta o Memo com taxa de prioridade zero, estima a taxa total, confere o saldo e simula a transação no RPC antes de solicitar a assinatura.
4. Confira o resumo: Solana Devnet, seu endereço público como pagador, o hash, a taxa estimada e a operação Memo sem transferências para terceiros. Se não quiser continuar, use Cancelar preparação.
5. Clique em **Aprovar registro na Phantom**. Agora a Phantom solicita sua aprovação de uma transação Devnet v0. Confira a carteira/rede e aprove. O app valida a assinatura e rejeita alteração da mensagem pela carteira antes de enviar.
6. O link **Acompanhar transação no explorador Devnet** aparece com a assinatura. Ele indica uma tentativa, ainda não sucesso. O app faz um único envio, com preflight; não reconstrói nem reenvia automaticamente.
7. Aguarde a confirmação. O app exige status confirmado/finalizado sem erro e lê novamente a transação para conferir Memo, programa, pagador e hash. Somente então avança à tela do cartório, com **Ver transação no explorador Devnet** antes da mensagem de registro confirmado.
8. Abra o explorador e confira Devnet, resultado sem erro e Memo `propertychain:v1:sha256:` seguido do hash calculado. A validação do cartório permanece simulada e não exige outra assinatura.

## Consulta pública sem carteira

A página inicial é a mesma no computador e no celular: escolha **Comprador / verificador**, entre e cole o **Cole o link do registro** (também aceita o código da transação). Se quiser comparar uma cópia digital, selecione o arquivo nessa mesma tela e clique em **Verificar documento**. O app consulta a Devnet e avança à etapa 4 com resultado e explorador; não há segunda aprovação na carteira.

Também é possível abrir diretamente um link recebido. O app aceita links de consulta/resultado do domínio oficial, links temporários anteriores do PropertyChain na Vercel e links do explorador Solana com `cluster=devnet`. O endereço colado é lido apenas para extrair a identificação pública; o app não visita esse endereço. Consultas usam sempre o RPC Devnet configurado. Entradas vazias, incompletas ou de outra origem/rede recebem uma explicação antes da consulta.

**Copiar link da consulta** gera sempre um endereço em `https://propertychain-theta.vercel.app/`, mesmo se o app estiver aberto em um deploy temporário ou localhost. Não use o endereço temporário da Vercel para compartilhar com testadores. O link contém apenas a identificação pública da transação em `#consulta?tx=…`; não contém nome ou conteúdo de arquivo.

1. Abra o link em uma nova aba ou em outro aparelho. Clique em **Verificar documento** sem selecionar arquivo e confirme que o resultado informa que o arquivo não foi comparado.
2. Clique em **Fazer nova consulta**, selecione a mesma cópia digital e confira se o hash coincide.
3. Repita com um arquivo diferente e confirme que aparece a divergência. A comparação lê o arquivo somente no aparelho.
4. Para medir o desempenho, faça dez consultas consecutivas do mesmo registro confirmado, sem selecionar arquivo. Abra **Ver detalhes do registro** e anote o **Tempo para consultar a rede de testes** em cada resultado e registre mediana, máximo e erros. Esse tempo inclui a conferência de que o RPC está na Devnet e a leitura do Memo, sem carregamento da página, seleção de arquivo, hash local ou confirmação de uma transação nova.

Em 17/11/2026, a função de leitura foi executada dez vezes contra o RPC público da Devnet para a [transação confirmada da etapa 4](https://explorer.solana.com/tx/2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G?cluster=devnet). As dez leituras conferiram o mesmo hash. Mediana de 0,45 s, máximo de 1,05 s e zero erros. Essa execução foi feita no ambiente de desenvolvimento e mede apenas a consulta RPC e a conferência do Memo.

## Relatório PDF — evolução #56

O autor aprovou esta evolução após concluir o MVP. Faça uma consulta confirmada e clique em **Baixar relatório em PDF**, na tela de resultado. O arquivo é gerado neste aparelho; a primeira solicitação carrega a biblioteca de PDF do próprio app. Não envia documento, nome de arquivo ou conteúdo a outro serviço, não exige carteira e não envia nova transação.

O PDF informa hash registrado, identificação da transação, comparação (arquivo igual, diferente ou não comparado), data/hora da consulta em UTC segundo o relógio do aparelho e os links oficiais da consulta e do explorador. Não é uma certidão, comprovação de propriedade ou validação de cartório. Abrir o PDF não faz uma consulta nova à Devnet.

Se o download não aparecer, use **Abrir PDF**; **Baixar PDF novamente** mantém o mesmo relatório enquanto essa consulta estiver aberta. Ao iniciar nova consulta, trocar o arquivo ou sair do resultado, o relatório preparado é descartado. Não há histórico de relatórios armazenado no app.

Em 24/11/2026, o autor confirmou que o relatório está funcionando corretamente e aceitou a entrega da [issue #56](https://github.com/MxK-rafas/Propertychain/issues/56). Para regressões futuras, repetir abertura/download e os três resultados de arquivo, conferindo texto, hash e links. As verificações automatizadas em Chromium e o aceite informado pelo autor são evidências distintas; não declarar testes adicionais de dispositivos que não foram realizados.

Implementação: [pdf-lib 1.17.1](https://pdf-lib.js.org/docs/api/classes/pdfdocument), carregado sob demanda. Usa fontes padrão do PDF, sem buscar fontes externas ou anexar arquivos ao PDF.

## Recusa, falha e resposta incerta

- Se a Phantom fechar e aparecer um erro, informe a mensagem completa e diga se apareceu o link do explorador. Os códigos identificam falhas no retorno da carteira (`PC_WALLET`), alterações na mensagem (`PC_WALLET_MESSAGE`), verificação criptográfica no navegador (`PC_CRYPTO`), consulta do prazo após aprovação (`PC_LIFETIME`), armazenamento do comprovante (`PC_RECEIPT`) e consulta após tentativa de envio (`PC_CONFIRM`). Em caso de alteração, o app bloqueia o envio e informa os campos divergentes que conseguiu identificar.
- Um erro genérico da versão anterior não permite concluir se houve envio. Se houver comprovante, use **Conferir registro existente**; não apague o armazenamento nem inicie uma segunda tentativa para investigar.
- Cancele na Phantom: o app deve explicar em português, sem enviar ou avançar.
- Sem saldo de teste: a preparação para antes de pedir assinatura. Solicite SOL Devnet no faucet, sem dinheiro real.
- Se a preparação ficar antiga, ela expira; prepare de novo e aprove de novo, sem reconstrução automática.
- Clique repetido durante processamento não inicia outro envio. Arquivo, navegação e controles de preparação ficam bloqueados enquanto necessário.
- Se a rede demorar ou interromper a resposta após assinatura, mantenha o link e use **Conferir registro existente**. Essa ação só lê a tentativa anterior; não pede nova assinatura ou envio.
- O app guarda **apenas hash, endereço público e assinatura** da tentativa em `sessionStorage` da aba, antes de enviar. Isso permite recuperar o acompanhamento após atualizar a página. Não há arquivo, imagem, nome de arquivo, bytes assinados ou segredo nesse comprovante. Ele não é compartilhado com outro aparelho e não é banco de dados do app.
- Ao atualizar a página, seu arquivo local é descartado. Se houver tentativa pendente, o comprovante é recuperado e dados fictícios não são atribuídos a arquivo desconhecido. Consulte o registro existente antes de iniciar outro. Não apague o comprovante/feche a aba se ainda não sabe o resultado.
- Uma falha confirmada pela rede não aparece como cadastro concluído. Um RPC que ainda não consegue informar o resultado não é prova de falha; o app mantém o acompanhamento e não cria transação substituta automaticamente.

## O que o cadastro significa

A blockchain recebe só o hash e os metadados públicos próprios da transação, incluindo a carteira e o horário. Isso não prova identidade, autenticidade jurídica, análise de cartório ou propriedade do imóvel. Não há token/NFT.

Arquivos iguais byte a byte têm o mesmo SHA-256; duas fotos do mesmo papel normalmente não. O app não faz OCR, comparação visual ou armazenamento de documentos. Um comprador com o link da transação pode consultar o registro e comparar seu arquivo no próprio aparelho.

## Configuração e verificações

Valores públicos opcionais em `frontend/.env.local`:

```text
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

Outro cluster/genesis é recusado. Não colocar tokens secretos em VITE_*. Dependências: @solana/kit 8.6.0 e Wallet Standard; assinatura em bytes pelo recurso `solana:signTransaction` da Phantom. A transação v0 inclui o Memo e a instrução Compute Budget que define a taxa de prioridade como zero. A conferência também aceita registros anteriores com apenas o Memo. Se o recurso de assinatura estiver indisponível, atualize a Phantom e conecte novamente.

```bash
npm test
npm run build
npm run preview
```

100 testes em dez arquivos passaram (incluindo exemplo guiado com hash real das fixtures, falhas/retentativa/cancelamento, ajuda sem segredos e geração/download do relatório PDF): consulta pública por link, comparação local e tratamento de resultados; percurso e perfis; hash; conexão; preparação/simulação; saldo insuficiente; expiração; recusa; alteração/ausência de assinatura; envio incerto sem repetição; programa/hash divergente; confirmação; persistência somente de comprovante público e retomada sem nova assinatura; diagnósticos após aprovação, bloqueio de armazenamento e indisponibilidade da consulta. Testes criptográficos usam chaves efêmeras locais sem fundos; nenhum envio real foi feito pelo Codex. Chromium conferiu o fluxo completo com Wallet Standard e RPCs controlados.

O [Solana AI Kit](https://github.com/solanabr/ai-kit) orienta a implementação em [modo sem instalação](../docs/SOLANA_AI_KIT.md). A conexão direta Phantom da etapa anterior é mantida; a assinatura da transação usa Wallet Standard, e o Kit compila/verifica/serializa a mensagem. Não há web3.js legado, agentes autônomos ou exportação de chaves.

O autor confirmou a consulta HTTPS no celular sem arquivo, com a mesma cópia digital e com um arquivo diferente. O teste específico com foto real foi aprovado pelo autor em 23/11/2026, concluindo o aceite do MVP. [Registro do aceite — issue #6](https://github.com/MxK-rafas/Propertychain/issues/6). Nenhuma foto real foi recebida ou publicada pelo Codex.

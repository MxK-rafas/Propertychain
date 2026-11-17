# PropertyChain — etapa 4: registrar hash na Devnet

O autor testou e aprovou cálculo e conexão da etapa 3; PR #46 integrado. Esta versão implementa o registro de um hash com Memo na Solana Devnet. **Cartório e consulta por terceiros continuam demonstrativos.** Não há contas/senhas, contrato próprio ou transferência de propriedade.

## Abrir e preparar

Na pasta `frontend`, com Node.js 22.12+ (preferencialmente 24 LTS):

```bash
npm ci
npm run dev
```

Abra o endereço inicial mostrado (normalmente `http://localhost:5173/`), sem fragmento, e escolha Proprietário. Use localhost ou HTTPS para Web Crypto. No celular, a Phantom precisa do seu navegador interno e de acesso HTTPS ao app; publicação Vercel é uma etapa posterior.

Use uma carteira exclusiva de testes. Ative a visualização Devnet na Phantom. Para a taxa, obtenha **SOL de teste**, sem valor financeiro, no [faucet oficial](https://faucet.solana.com/). Não compre moedas. O app nunca pede frase-semente ou chave privada.

## Teste real de cadastro pelo autor

1. Use primeiro o PDF fictício. Você pode abrir o exemplo ou escolher um PDF/JPEG/PNG local; nenhum arquivo é enviado. Para arquivos próprios, dados de Maria/endereço/histórico são ocultados.
2. Clique em **Calcular impressão digital** e depois **Conectar Phantom de teste**. O app confere o RPC Devnet por getGenesisHash; isso não altera a seleção de rede da interface da Phantom.
3. Clique em **Preparar registro na Devnet**. Esta ação ainda não assina nem envia: busca blockhash, estima taxa, confere saldo de teste e simula o Memo.
4. Confira o resumo: Solana Devnet, seu endereço público como pagador, o hash, a taxa estimada e a operação Memo sem transferências para terceiros. Se não quiser continuar, use Cancelar preparação.
5. Clique em **Aprovar registro na Phantom**. Agora a Phantom solicita sua aprovação de uma transação Devnet v0. Confira a carteira/rede e aprove. O app valida a assinatura e rejeita alteração da mensagem pela carteira antes de enviar.
6. O link **Acompanhar transação no explorador Devnet** aparece com a assinatura. Ele indica uma tentativa, ainda não sucesso. O app faz um único envio, com preflight; não reconstrói nem reenvia automaticamente.
7. Aguarde a confirmação. O app exige status confirmado/finalizado sem erro e lê novamente a transação para conferir Memo, programa, pagador e hash. Somente então avança à tela do cartório, com **Ver transação no explorador Devnet** antes da mensagem de registro confirmado.
8. Abra o explorador e confira Devnet, resultado sem erro e Memo `propertychain:v1:sha256:` seguido do hash calculado. A validação do cartório permanece simulada e não exige outra assinatura.

## Recusa, falha e resposta incerta

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

Arquivos iguais byte a byte têm o mesmo SHA-256; duas fotos do mesmo papel normalmente não. O app não faz OCR, comparação visual ou armazenamento de documentos. O comprador ainda vê a demonstração da consulta; a consulta pública em outro aparelho será a etapa 5.

## Configuração e verificações

Valores públicos opcionais em `frontend/.env.local`:

```text
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

Outro cluster/genesis é recusado. Não colocar tokens secretos em VITE_*. Dependências: @solana/kit 8.6.0 e Wallet Standard; assinatura em bytes pelo recurso `solana:signTransaction` da Phantom. Transação v0 com apenas Memo, sem lookup tables. Se o recurso estiver indisponível, atualize a Phantom e conecte novamente; o app não usa uma carteira de servidor como alternativa.

```bash
npm test
npm run build
npm run preview
```

41 testes passaram: percurso e perfis; hash; conexão; preparação/simulação; saldo insuficiente; expiração; recusa; alteração/ausência de assinatura; envio incerto sem repetição; programa/hash divergente; confirmação; persistência somente de comprovante público e retomada sem nova assinatura. Testes criptográficos usam chaves efêmeras locais sem fundos; nenhum envio real foi feito pelo Codex. Chromium conferiu o fluxo completo com Wallet Standard e RPCs controlados.

O [Solana AI Kit](https://github.com/solanabr/ai-kit) orienta a implementação em [modo sem instalação](../docs/SOLANA_AI_KIT.md). A conexão direta Phantom da etapa anterior é mantida; a assinatura da transação usa Wallet Standard, e o Kit compila/verifica/serializa a mensagem. Não há web3.js legado, agentes autônomos ou exportação de chaves.

**Pausa para seu teste:** faça o registro com seu exemplo fictício e sua Phantom de teste, confira o explorador e informe o resultado. Só depois avançaremos à consulta por terceiros. Nenhum sucesso na Devnet deve ser anunciado sem o link e a confirmação real.

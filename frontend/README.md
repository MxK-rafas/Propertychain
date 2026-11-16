# PropertyChain — etapa 3: carteira e impressão digital

O autor aprovou as telas/entrada da etapa 2. Esta versão acrescenta **cálculo SHA-256 real no dispositivo e conexão com Phantom**. Cadastro, cartório e consulta de transações continuam demonstrações. **Nenhuma transação ou assinatura é solicitada nesta etapa.**

## Abrir

Com Node.js 22.12+ (preferencialmente 24 LTS), abra um terminal na pasta `frontend`:

```bash
npm ci
npm run dev
```

Abra o endereço mostrado, normalmente `http://localhost:5173/`, sem fragmento para escolher perfil. Para cálculo SHA-256, use localhost ou HTTPS: navegadores bloqueiam Web Crypto em endereços HTTP de rede local. A publicação HTTPS na Vercel será feita em outra etapa. Para encerrar o servidor, Ctrl+C.

## Testar — cálculo sem carteira

1. Entre como Proprietário. No painel “Impressão digital do arquivo”, clique em “Calcular impressão digital”.
2. O PDF fictício deve produzir o SHA-256 de `../fixtures/documento-ficticio.json`. O resultado identifica bytes; não é aprovação de cartório.
3. Selecione um PDF/JPEG/PNG local. O código anterior deve sumir; calcule novamente. Os dados fictícios de Maria continuam ocultos para outro arquivo.
4. Repita com uma cópia idêntica: o código deve ser igual. Altere o arquivo ou tire outra foto: o código pode mudar. Não há reconhecimento visual ou OCR.
5. Entre como Comprador/verificador: também é possível calcular localmente, **sem conectar carteira**. Ainda não há busca ou comparação com registro on-chain.

Seu arquivo nunca é enviado ou salvo. Para o exemplo, o app baixa somente o PDF fictício público de seus próprios assets. Arquivos escolhidos são lidos em memória no dispositivo. Ao trocar arquivo, resultados antigos são invalidados; ao atualizar a página, a seleção é descartada.

## Testar — Phantom

1. Use a extensão Phantom oficial no computador ou o navegador interno da Phantom no celular. Use carteira exclusiva de testes. Nunca forneça frase-semente ou chave privada ao app/Codex.
2. No perfil Proprietário, clique em “Conectar Phantom de teste”. Aprove somente a conexão. Não deverá aparecer pedido para assinar/enviar transação ou mensagem.
3. O app confere um endereço público válido e se o servidor configurado pertence à Devnet (`getGenesisHash`). Só depois mostra “Carteira conectada · RPC Solana Devnet confirmado”.
4. Essa indicação é a **rede do app/RPC**; não significa que o app alterou a seleção de rede na interface Phantom. Para os testes futuros, configure a Phantom para rede de testes também.
5. Teste cancelar a conexão. O app deve explicar em português e permitir tentar novamente.
6. Teste desconectar e trocar a conta na Phantom: o app deve retirar o estado pronto e exigir nova conexão/conferência.
7. Sem Phantom, a mensagem deve explicar como abrir em um ambiente compatível. Compradores não precisam dela para calcular.

Não é necessário SOL para conectar e calcular; saldo de teste será necessário para registrar na etapa seguinte. O endpoint público pode falhar ou limitar requisições; nesse caso o app não anuncia a conexão pronta. A espera do RPC tem limite de 15 segundos, contado após aprovar a carteira.

## O que continua simulado

“Continuar demonstração” percorre o cartório simulado, consulta e resultado. Nenhum desses passos grava ou verifica documentos na blockchain. O resultado simulado não prova integridade, autenticidade jurídica ou propriedade. Não mostrar um link de transação inventado.

## Configuração e verificações

Valores públicos opcionais em `.env.local` na pasta frontend:

```text
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

Sem eles, esses são os padrões. Outro cluster/genesis é recusado. Não inserir segredos em `VITE_*` (esses valores entram no navegador). Não há chave privada de deploy. O endereço público da carteira é usado apenas no estado da página; o RPC de conferência recebe só a chamada getGenesisHash, sem arquivo, hash ou endereço da carteira como parâmetro.

```bash
npm test
npm run build
npm run preview
```

23 testes cobrem cálculo conhecido, PDF canônico, arquivo alterado, invalidação de leitura antiga, RPC Devnet, rede incompatível, cancelamento, desconexão/troca de conta e o percurso anterior. Os testes de carteira usam um provedor simulado e RPC controlado: não substituem seu teste com a extensão real. Uma leitura do endpoint Devnet público foi conferida separadamente, sem carteira e sem transação.

O [Solana AI Kit](https://github.com/solanabr/ai-kit) foi consultado em modo sem instalação; ver [referências e decisões](../docs/SOLANA_AI_KIT.md). Dependência runtime `@solana/kit` 8.6.0, carregada sob demanda; Phantom usa a integração direta oficial em módulo isolado. Não há agentes autônomos ou carteira de servidor.

**Pausa para seu teste:** confirme cálculo e conexão/cancelamento com a Phantom antes de avançarmos para o registro Memo. Sem transação nesta entrega, não há link do explorador a apresentar.

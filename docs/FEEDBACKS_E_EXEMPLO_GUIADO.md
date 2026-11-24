# Feedbacks e exemplo guiado — #61

Atualizado em 24/11/2026. [Issue #61](https://github.com/MxK-rafas/Propertychain/issues/61), evolução expressamente autorizada pelo autor após o MVP e o relatório PDF. Fonte operacional: [spec](../SPEC.md); prioridades: [roadmap](../ROADMAP.md).

## Evidência recebida

O autor enviou o app a amigos e relatou que muitos travaram na carteira: não tinham uma ou não conheciam carteiras/blockchain. Não foi fornecido número de participantes, transcrições individuais ou taxa de conclusão. Este registro não inventa esses dados nem declara melhora medida.

## Implementação atual — percurso completo solicitado pelo autor

A primeira versão, no PR #62, focava as três comparações. Em seguida, o autor pediu um exemplo mais detalhado e parecido com a aplicação real. Essa solicitação amplia a #61, mantendo o teste/aceite pendente.

1. **Cadastro:** PDF fictício será anexado por um clique; o próximo calcula SHA-256 de verdade. Depois, simular conexão com a Phantom e aprovação/publicação na Solana. Explicações da carteira e blockchain ficam nessa etapa. Cada ação tem seu estado e um único botão principal. Não abre carteira, pede assinatura ou envia transação. A publicação é representada com uma leitura real do registro já existente, com link e rótulo claro de simulação.
2. **Cartório:** explicar o papel de analisar veracidade e decidir pela validação. O botão representa a análise e mostra Documento fictício validado — simulação. Nenhum cartório analisa o documento, e não há aprovação on-chain.
3. **Verificação:** usuário passa a verificar um documento já publicado. Escolher mesmo arquivo, arquivo diferente ou sem arquivo e clicar em Verificar documento. Cada execução lê novamente a Devnet e compara a cópia escolhida quando houver arquivo.
4. **Resultado:** apresentar a comparação, comprovante público, detalhes e relatório PDF da consulta real, sem incorporar aprovação fictícia. Testar outro caso volta à etapa 3 e descarta resultado/PDF anterior; Concluir exemplo retorna à entrada.

Original e cópia alterada permanecem no aparelho; a fixture original é preservada. Erros de rede/registro/hash não viram sucesso didático. Retentativa, cancelamento ao sair e reinício são tratados. A demonstração não modifica comprovante real pendente em sessionStorage. Os perfis e o cadastro real continuam disponíveis.

Nenhum backend, upload, conta, custódia, validação real de cartório ou item de Depois/Um dia foi incluído.

## Verificações técnicas

100 testes em dez arquivos e build TypeScript/Vite. Os testes do guia exercitam o percurso completo, bytes reais da fixture e três comparações, hash divergente, fixture alterada, erro/registro ausente, retry, clique repetido, cancelamento, retorno/reinício e preservação de comprovante real pendente. Nenhuma conexão ao provedor é solicitada. Carteira/RPC são controlados nos testes unitários; não são evidência de adoção por usuários.

A evidência da primeira versão no PR #62 foi três leituras reais por formato. Para o percurso completo, o roteiro de Chromium em 390×844 e 1440×1000 confere quatro leituras (registro existente no cadastro e três verificações), além de um PDF para cada resultado; publicação oficial documentada na issue. Não há conexão de carteira ou envio de transação. O cadastro → cartório → consulta → resultado também passou nos dois formatos com Wallet Standard e RPC controlados; nenhum envio real foi feito pelo Codex. Emulação de tamanho não substitui um teste na Phantom real.

O roteiro de regressão está no [plano de testes](PLANO_DE_TESTES.md). A abertura do domínio público e as leituras da Devnet são verificações separadas dos testes unitários; a issue reúne a evidência final de publicação.

## Aceite pendente do autor

1. Abra o domínio oficial no navegador comum do celular e toque em Experimentar com um exemplo.
2. Anexe o documento fictício, calcule o hash, simule conexão/aprovação/publicação e leia a ajuda da Phantom/blockchain. Não instale nem conecte sua carteira.
3. Avance ao cartório e simule a análise. Confira que a aprovação é apresentada como demonstração.
4. Na verificação, escolha mesmo arquivo e abra o resultado/PDF. Use Testar outro caso para repetir com arquivo diferente e sem arquivo.
5. Conclua o exemplo e diga onde ainda ficou em dúvida. A issue fica aberta para esse aceite; a melhora com os amigos ainda não foi medida.

A #61 permanece aberta até esse teste/aceite. Os aceites anteriores do MVP (#6) e PDF (#56) são preservados; a evolução não comprova autenticidade ou propriedade.

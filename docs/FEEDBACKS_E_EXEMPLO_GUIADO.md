# Feedbacks e exemplo guiado — #61

Atualizado em 24/11/2026. [Issue #61](https://github.com/MxK-rafas/Propertychain/issues/61), evolução expressamente autorizada pelo autor após o MVP e o relatório PDF. Fonte operacional: [spec](../SPEC.md); prioridades: [roadmap](../ROADMAP.md).

## Evidência recebida

O autor enviou o app a amigos e relatou que muitos travaram na carteira: não tinham uma ou não conheciam carteiras/blockchain. Não foi fornecido número de participantes, transcrições individuais ou taxa de conclusão. Este registro não inventa esses dados nem declara melhora medida.

## Implementação

- Entrada explica o benefício de conferir cópias; exemplo sem carteira é a opção padrão. Proprietário, Comprador / verificador e Cartório continuam como perfis demonstrativos.
- `#exemplo`: quatro passos, um botão principal por estado, texto do que acontece e atividade durante a espera. Usa o PDF fictício original, uma cópia com quebra de linha adicionada em memória e uma consulta sem arquivo. Não pede conta, carteira, dinheiro nem nova transação.
- As três leituras usam `lookupMemo` e o registro real já confirmado. SHA-256 da fixture e hash da rede são conferidos. Falha, reset, registro ausente ou divergente interrompem o passo com explicação e retry; não existe sucesso de contingência simulado.
- Resultados: Mesmo arquivo, Arquivo diferente e Arquivo não comparado. Códigos e tempo em Ver detalhes do registro; Ver comprovante público abre o explorador Devnet. Compartilhamento oficial e PDF preservados.
- Ajuda Phantom antes da conexão: para que serve, aprovação explícita, SOL de teste sem valor financeiro, instalação no site oficial, rede de testes e alternativa para experimentar sem carteira. Nunca pede recuperação/chave privada.
- Ajuda blockchain: código e metadados públicos, documento no aparelho, limites jurídicos e possível indisponibilidade/reset. Cadastro usa os termos Calcular código do arquivo e Revisar registro; taxas continuam explícitas antes da assinatura.

Nenhum backend, upload, conta, custódia, validação real de cartório ou item de Depois/Um dia foi incluído.

## Verificações técnicas

99 testes em dez arquivos e build TypeScript/Vite. Os testes novos exercitam os bytes reais da fixture, comparação igual/diferente/sem arquivo, hash divergente, fixture alterada, erro/registro ausente, retry, clique repetido e cancelamento ao sair. Carteira/RPC são controlados nos testes unitários; não são evidência de adoção por usuários.

Chromium em 390×844 e 1440×1000 percorreu o guia local com três leituras reais da Devnet em cada formato e download do PDF, sem carteira, sem envio e sem erros JavaScript. O cadastro → cartório → consulta → resultado também passou nos dois formatos com Wallet Standard e RPC controlados; nenhum envio real foi feito pelo Codex. Emulação de tamanho não substitui um teste na Phantom real.

O roteiro de regressão está no [plano de testes](PLANO_DE_TESTES.md). A abertura do domínio público e as leituras da Devnet são verificações separadas dos testes unitários; a issue reúne a evidência final de publicação.

## Aceite pendente do autor

1. Abra o domínio oficial no navegador comum do celular, sem carteira, e toque em Experimentar com um exemplo.
2. Percorra Verificar o exemplo → Testar uma cópia alterada → Consultar sem arquivo. Confira os três resultados, o comprovante público e, se quiser, o PDF.
3. Conclua e escolha Proprietário. Confira se a ajuda explica a Phantom antes da conexão; não é necessário instalar para aceitar o exemplo.
4. Diga onde ainda ficou em dúvida. O objetivo é conseguir experimentar sem interromper o teste para instalar uma carteira.

A #61 permanece aberta até esse teste/aceite. Os aceites anteriores do MVP (#6) e PDF (#56) são preservados; a evolução não comprova autenticidade ou propriedade.

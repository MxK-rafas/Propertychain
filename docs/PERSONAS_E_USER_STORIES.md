# Personas e user stories

Personas **fictícias**, criadas para orientar o produto (issue #10). Histórias marcadas com **[MVP]** entram no mínimo viável definido no `ROADMAP.md`.

## Personas

### 1. Seu José, proprietário/herdeiro
- 72 anos, tem um lote antigo que passou pela família sem registro atualizado. Os papéis estão espalhados entre gavetas e parentes.
- Pouca familiaridade com tecnologia; usa o celular para WhatsApp.
- **Dor:** na hora de vender ou repartir a herança, ninguém acha nem consegue provar a origem dos documentos.
- **Precisa de:** guardar a prova de que os documentos existiam, estavam íntegros e foram conferidos por quem tem autoridade, sem entender de blockchain.

### 2. Camila, compradora (ou corretora)
- 34 anos, avalia a compra de um lote e desconfia da origem do imóvel.
- Confortável com tecnologia, mas sem conhecimento de blockchain; não quer instalar carteira só para conferir.
- **Dor:** receber cópias de documentos e não ter como saber se são os mesmos que o cartório analisou.
- **Precisa de:** conferir um documento em segundos, com resultado claro e linguagem simples.

### 3. Cartório (simulado)
- Representa o validador: analisa os documentos fora da blockchain e registra o resultado.
- **Dor:** hoje a conferência de um documento por terceiros é manual e não é pública.
- **Precisa de:** uma camada pública de verificação para o que já analisa, sem que a blockchain substitua o seu papel.

## User stories

| # | História | MVP |
|---|----------|-----|
| US1 | Como proprietário, quero escolher um arquivo e cadastrar sua impressão digital (hash) sem enviá-lo a ninguém, para provar que ele existia e não foi alterado. | **[MVP]** |
| US2 | Como proprietário, quero vincular o documento a um imóvel sem expor matrícula ou dados pessoais, para proteger minha privacidade. | **[MVP]** |
| US3 | Como cartório, quero ver os documentos pendentes e conferir o arquivo contra o hash, para decidir se valido ou rejeito. | **[MVP]** |
| US4 | Como cartório, quero validar ou rejeitar um documento informando o motivo, para que o resultado fique público e auditável. | **[MVP]** |
| US5 | Como comprador, quero arrastar um arquivo e ver se ele foi validado, sem carteira, para saber se posso confiar nele. | **[MVP]** |
| US6 | Como comprador, quero ver quem submeteu, quem validou e quando, para avaliar a origem do documento. | **[MVP]** |
| US7 | Como comprador, quero entender o que o resultado significa e o que não significa, para não confundir verificação com registro de propriedade. | **[MVP]** |
| US8 | Como cartório, quero atestar o titular que consta em um documento validado, para que o histórico mostre a sequência de titulares. | **[MVP]** |
| US9 | Como comprador, quero ver o histórico do imóvel em ordem cronológica, para acompanhar a cadeia de custódia dos documentos. | **[MVP]** |
| US10 | Como cartório, quero revogar um documento validado que perdeu a validade, mantendo o histórico, para corrigir erros sem apagar nada. | |
| US11 | Como proprietário, quero compartilhar um link ou QR Code de verificação, para mostrar o resultado a terceiros com facilidade. | |
| US12 | Como proprietário mais velho, quero textos simples, fontes grandes e mensagens claras de erro, para usar o app sem ajuda técnica. | |

## Relação com as issues

US1/US2 → #15, #23, #24, #30 · US3/US4 → #16, #28 · US5/US6/US7 → #18, #25, #37, #38 · US8/US9 → #1, #26, #29 · US10 → #17 · US11 → #31 · US12 → #35, #3

# Dados de teste

## Exemplo público

O [PDF fictício](../fixtures/documento-ficticio.pdf) foi criado nesta consolidação, com aviso de demonstração e sem assinaturas ou selos oficiais. O [JSON](../fixtures/documento-ficticio.json) registra os dados e SHA-256 dos seus bytes. O [TXT](../fixtures/documento-ficticio.txt) é referência editável de conteúdo, com hash diferente.

Maria Oliveira, João Oliveira, Rua das Palmeiras, 120, Cartório de exemplo e as datas 1985/2024 são fictícios. A ficha não reproduz um documento real. O autor deve revisar o modelo antes de registrar.

Não alterar/reimprimir o PDF e continuar usando seu hash anterior. Qualquer alteração exige novo cálculo. Usar cópia byte a byte para comparação em outro celular.

## Foto real fornecida pelo autor

O autor aprovou o teste local com foto real em 23/11/2026. O arquivo não foi fornecido ao Codex nem anexado ao repositório; o aceite está registrado na [issue #6](https://github.com/MxK-rafas/Propertychain/issues/6). A seleção de JPEG/PNG ou PDF ocorre localmente no aplicativo. Não subir a imagem, não extrair texto com OCR, não persistir em servidor e não adicionar ao repositório, build Vercel, Actions, capturas ou logs. `private-test-files/` e `testes-privados/` são pastas ignoradas para apoiar testes locais.

Ao trocar a fixture por outro arquivo, ocultar titular/endereço/histórico fictícios. Para esse arquivo, tipo/proprietário não são identificados pelo app. A validação de cartório permanece simulada e não prova análise institucional da foto.

Somente hash segue ao Memo na Devnet. A transação também expõe metadados da rede, incluindo a carteira; hash não é garantia de anonimato.

## Consulta sem carteira

Compartilhar o link com a assinatura da transação. Para verificar só o registro, outro aparelho não precisa ter o arquivo. Para afirmar correspondência, deve selecionar uma cópia idêntica recebida fora do app; não depender de armazenamento do navegador de origem.

Duas fotos do mesmo papel normalmente têm hashes diferentes, assim como uma imagem recortada ou recomprimida. Divergência de hash demonstra diferença de arquivo, não necessariamente fraude. O MVP não compara conteúdo visual e não recupera o documento a partir do hash.

No exemplo guiado `#exemplo`, o app carrega o PDF público e confere seu SHA-256 antes de comparar. A assinatura fixa é `2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G`, com hash `d7266d0a2f4b3f727327086e5718c63cf2e675bf59f206e5aa2415b3a5bdc4dd`. Cada passo lê esse registro real; ele precisa corresponder ao PDF. No passo alterado, acrescentar uma quebra de linha em uma cópia em memória. Não alterar a fixture original nem registrar uma transação nova. Devnet indisponível/resetada é erro, sem fallback de sucesso.

A consulta pública comum não seleciona o exemplo automaticamente e não exibe titulares fictícios, mesmo se o hash coincidir. Um parâmetro de URL nunca é evidência do conteúdo do documento.

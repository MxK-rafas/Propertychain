# Dados de teste

## Exemplo público

O [PDF fictício](../fixtures/documento-ficticio.pdf) foi criado nesta consolidação, com aviso de demonstração e sem assinaturas ou selos oficiais. O [JSON](../fixtures/documento-ficticio.json) registra os dados e SHA-256 dos seus bytes. O [TXT](../fixtures/documento-ficticio.txt) é referência editável de conteúdo, com hash diferente.

Maria Oliveira, João Oliveira, Rua das Palmeiras, 120, Cartório de exemplo e as datas 1985/2024 são fictícios. A ficha não reproduz um documento real. O autor deve revisar o modelo antes de registrar.

Não alterar/reimprimir o PDF e continuar usando seu hash anterior. Qualquer alteração exige novo cálculo. Usar cópia byte a byte para comparação em outro celular.

## Foto real fornecida pelo autor

A foto ainda não foi fornecida. Na implementação, permitir selecionar JPEG/PNG ou PDF localmente. Não subir a imagem, não extrair texto com OCR, não persistir em servidor e não adicionar ao repositório, build Vercel, Actions, capturas ou logs. `private-test-files/` e `testes-privados/` são pastas ignoradas para apoiar testes locais.

Ao trocar a fixture por outro arquivo, ocultar titular/endereço/histórico fictícios. Para esse arquivo, tipo/proprietário não são identificados pelo app. A validação de cartório permanece simulada e não prova análise institucional da foto.

Somente hash segue ao Memo na Devnet. A transação também expõe metadados da rede, incluindo a carteira; hash não é garantia de anonimato.

## Consulta sem carteira

Compartilhar o link com a assinatura da transação. Para verificar só o registro, outro aparelho não precisa ter o arquivo. Para afirmar correspondência, deve selecionar uma cópia idêntica recebida fora do app; não depender de armazenamento do navegador de origem.

Duas fotos do mesmo papel normalmente têm hashes diferentes, assim como uma imagem recortada ou recomprimida. Divergência de hash demonstra diferença de arquivo, não necessariamente fraude. O MVP não compara conteúdo visual e não recupera o documento a partir do hash.

Para a fixture, a implementação pode carregar o PDF público e comparar automaticamente. Só associar os dados fictícios quando o hash realmente coincidir, nunca por um parâmetro de URL informando o modo.

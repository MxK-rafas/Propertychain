# Testes manuais do MVP

Executar conforme cada etapa da [spec](../SPEC.md), parando para o autor testar. Este plano não afirma que a integração Solana já foi implementada.

## Arquivos

- Fixture fictícia: verificar SHA-256 de `fixtures/documento-ficticio.pdf` contra o JSON.
- Mesmos bytes em outro aparelho: hash deve coincidir.
- Cópia alterada: deve divergir. Outra foto do mesmo papel não precisa coincidir.
- Foto real: só seleção local e hash; nenhuma requisição de upload ou imagem/filename em logs/URLs. Dados de Maria/endereço/histórico não aparecem como pertencentes ao arquivo real.

## Registro

Phantom ausente, conexão recusada, assinatura cancelada, falta de SOL de teste, rede incorreta, RPC indisponível, transação falha e confirmação lenta devem produzir estados compreensíveis. Nenhum vira sucesso. Clique repetido não gera envio duplicado; timeout não provoca reenvio silencioso. Conferir Memo e ausência de erro na Devnet, com link do explorador.

## Consulta

Abrir link em outro celular sem Phantom; consultar a mesma assinatura. Exemplo fixo pode ser comparado automaticamente; para outro documento, distinguir registro encontrado de arquivo não comparado. Comparar uma cópia exata e uma alterada. Testar assinatura ausente/inválida, transação inexistente, falha/pendente, programa errado, Memo incompatível e conteúdo conflitante. Consulta não solicita assinatura nem taxa.

Cartório permanece simulado. Nada na Devnet comprova titularidade legal ou validação institucional. Os dados/histórico de Maria só devem aparecer quando o arquivo corresponde à fixture.

## Velocidade

Meta proposta pelo autor: 1–5 segundos do toque em verificar até resultado conclusivo de registro já confirmado. Medir pelo menos dez consultas, incluindo outro aparelho sem carteira e primeira leitura sem cache. Incluir cálculo local quando houver arquivo selecionado. Anotar mediana, máximo, erros, tamanho do arquivo, aparelho e conexão.

Separar carregamento inicial, seleção do arquivo, assinatura humana e confirmação de escrita. Não anunciar que o processo inteiro dura cinco segundos. Repetições de leitura devem consultar a rede; sucesso antigo não substitui resposta real.

| Tentativa | Aparelho/conexão | Arquivo/tamanho | Tempo de hash | Tempo total de consulta | Resultado/erro |
|---|---|---|---|---|---|
| A preencher no teste | | | | | |

Se ultrapassar cinco segundos, registrar a medição e a causa observada. O app deve mostrar espera ou falha honesta, sem resposta fabricada.

## Publicação

Build Vercel com somente assets fictícios, HTTPS, abertura direta do link em dois aparelhos, legibilidade no celular e uma ação principal por tela. Só marcar etapa concluída com evidência real e aceite do autor.

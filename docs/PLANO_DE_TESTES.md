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

Abrir a página inicial tanto no computador quanto no celular, escolher Comprador / verificador e consultar pela mesma tela, colando link/código e selecionando arquivo opcional. Conferir que o arquivo e a comparação não se perdem ao avançar para a etapa 4. Repetir com link temporário antigo, código da transação e link do explorador Devnet. Não deve haver navegação para o deploy temporário nem solicitação de carteira. O compartilhamento deve usar sempre o domínio oficial.

Ao abrir um link público, a navegação deve marcar **Etapa 3 de 4**. Após verificar um registro confirmado, deve avançar para **Resultado da verificação**, marcar **Etapa 4 de 4** e manter a assinatura no endereço. Conferir os três casos: sem arquivo, cópia idêntica e arquivo diferente. A comparação escolhida deve aparecer no resultado. **Fazer nova consulta** retorna à etapa 3 e limpa o arquivo selecionado. Se voltar e trocar/remover o arquivo, o resultado anterior não pode ser reapresentado como uma nova comparação sem verificar novamente. Erros de consulta permanecem na etapa 3.

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


## Evolução #56 — relatório de verificação em PDF

- Após uma consulta confirmada, baixar o PDF nos três casos: sem arquivo, arquivo idêntico e arquivo diferente. Comparar o texto, hash, transação e links com o resultado da tela.
- Conferir que a data/hora corresponde à consulta no relógio do aparelho, expressa em UTC, e não é apresentada como horário certificado da transação.
- Abrir os links no PDF e conferir domínio oficial e explorador Devnet. O arquivo deve explicar rede de testes, ausência de valor legal e cartório simulado.
- Conferir que o PDF não contém nome/conteúdo/imagem do documento original, titular inventado ou anexos. A geração não faz nova consulta RPC, upload ou transação.
- Antes de verificar e em consultas com erro/inexistentes/inválidas, não deve aparecer relatório de sucesso.
- Usar Abrir PDF se o navegador não iniciar o download automático; testar também Baixar PDF novamente. Conferir no computador e na Phantom real.
- Ao fazer nova consulta ou trocar o arquivo, o relatório antigo não fica disponível como se pertencesse à nova comparação. Falha ao gerar permite tentar de novo sem apagar o resultado da consulta.
- A publicação oficial deve abrir em uma sessão anônima, sem login Vercel e sem carteira para consulta. Não usar URL protegida de preview para os testadores.

O autor confirmou o funcionamento correto do relatório em 24/11/2026, aceitando a entrega da issue #56. Os cenários acima permanecem como roteiro de regressão. O MVP original permanece aceito na #6.

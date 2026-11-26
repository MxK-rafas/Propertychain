# PropertyChain no Demo Day de 26/11/2026

O material entregue ao autor tem dez slides, roteiro nas notas do apresentador e versões editáveis em PowerPoint e LibreOffice, além de PDF. A fala foi planejada para cerca de três minutos usando as capturas. Percorrer o exemplo inteiro ao vivo leva tempo adicional.

## Roteiro

1. **É o mesmo arquivo?** Apresente a pergunta de quem recebe a cópia de um documento de imóvel.
2. **O problema.** Conte o caso ilustrativo do corretor que recebe uma cópia antiga sem ter uma referência para comparar.
3. **Como funciona.** O proprietário registra o código e compartilha o link. O comprador abre o link e confere a cópia.
4. **Demonstração.** Abra o [app público](https://propertychain-theta.vercel.app/), escolha **Experimentar com um exemplo** e avance pelo cadastro e pela análise simulada do cartório. Escolha **Com o mesmo arquivo**, clique em **Verificar documento** e mostre o resultado e o relatório.
5. **Por que blockchain.** O código pode ser consultado na rede de testes, inclusive em outro aparelho. O arquivo fica no dispositivo.
6. **O que funciona.** Mostre os três resultados e o relatório. O autor testou o fluxo no celular e no computador.
7. **O que aprendemos.** Os relatos sobre a barreira da carteira e o excesso de texto levaram ao exemplo sem carteira e às instruções mais curtas.
8. **Modelo de negócio.** Cobrança por consulta ou relatório e mensalidade para uso frequente são hipóteses. O MVP é gratuito.
9. **Convite.** Peça ao público para abrir o app e explicar com as próprias palavras o que o resultado confirmou.
10. **Sobre mim.** Encerre com a apresentação de Rafael Vinicius, criador do PropertyChain.

Para apresentar sem internet, abra o PDF dos slides no computador antes do evento. O slide 4 mostra a tela real de resultado com um arquivo fictício e o slide 6 mostra o trecho do relatório. O QR do slide 9 aponta para o domínio oficial. A gravação em vídeo é uma entrega separada na [#41](https://github.com/MxK-rafas/Propertychain/issues/41).

## Perguntas da banca

- **O que o resultado comprova?** Com a cópia selecionada, o app informa se os bytes são iguais aos do arquivo registrado. Sem cópia, o app só confirma que encontrou o registro.
- **Qual é o papel do cartório?** O MVP simula a análise. Para verificar a situação jurídica, a pessoa ainda precisa consultar os documentos oficiais do Registro de Imóveis.
- **Por que usar blockchain?** Qualquer pessoa com o link pode conferir a referência pública no explorador da Solana Devnet. A rede é de testes e está sujeita a indisponibilidade e resets.
- **O que fica exposto?** O código do arquivo e os dados públicos da transação, como o endereço da carteira. O arquivo fica no aparelho. Um serviço que armazene arquivos reais precisaria de avaliação de privacidade e LGPD.
- **Por que não usar tokens?** Comparar arquivos exige um código de referência. Um token não estabelece titularidade jurídica nem é necessário para a primeira hipótese de receita.
- **Quem já testou e o que falta medir?** O autor confirmou que o exemplo funcionou no computador e no celular. A próxima rodada deve medir se as pessoas conseguem explicar o resultado com a nova redação.

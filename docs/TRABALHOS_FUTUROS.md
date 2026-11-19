# Retrospectiva do PropertyChain

O MVP foi publicado na Vercel e validado na Solana Devnet. O proprietário registra a impressão digital de um arquivo com a Phantom. Quem recebe o link consulta o registro sem carteira e pode comparar uma cópia digital no próprio aparelho. O cartório e o histórico de titulares são fictícios. [Aplicativo publicado](https://propertychain-theta.vercel.app/) · [Escopo do MVP](../SPEC.md)

## O que funcionou

- **Registro.** O teste manual assinou e finalizou na Devnet um Memo com o SHA-256 do PDF fictício. O explorador confirmou o hash esperado. [PR #47](https://github.com/MxK-rafas/Propertychain/pull/47) · [Transação finalizada](https://explorer.solana.com/tx/2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G?cluster=devnet)
- **Consulta.** No computador e no celular, os testes distinguiram registro confirmado sem arquivo, correspondência com a mesma cópia digital e divergência com outro arquivo. Dez leituras do registro confirmado tiveram mediana de 0,45 s, máximo de 1,05 s e zero erros. A medição cobre RPC e conferência do Memo. Uma consulta no site publicado levou 1,49 s. [PR #48](https://github.com/MxK-rafas/Propertychain/pull/48) · [Roteiro reproduzível](../frontend/README.md)
- **Limites visíveis.** A tela mostra estados separados para a confirmação na rede, a comparação do arquivo e a validação pelo cartório. O registro é uma evidência do hash gravado. A autenticidade do documento e a propriedade do imóvel ficam fora da verificação. [PR #49](https://github.com/MxK-rafas/Propertychain/pull/49)

## O que faria diferente

- **Testar a carteira real mais cedo.** Os testes com RPC controlado não reproduziram a alteração de mensagem observada após a aprovação na Phantom. Na tentativa seguinte, a taxa de prioridade zero foi definida antes da assinatura, a checagem byte a byte foi preservada e o registro foi concluído. [PR #47](https://github.com/MxK-rafas/Propertychain/pull/47)
- **Testar navegação e compartilhamento como parte do fluxo inicial.** A versão anterior mostrava o resultado no endereço da consulta e oferecia um link para a página já aberta. A correção criou uma rota para o resultado e um botão que confirma a cópia. Na próxima rodada, vale testar também a abertura do link copiado em outra aba ou aparelho. [PR #51](https://github.com/MxK-rafas/Propertychain/pull/51)
- **Manter latência técnica e tempo de uso em medições separadas.** Os números atuais descrevem leituras de um único registro confirmado. Um piloto pode medir carregamento, seleção de arquivo e leitura em redes e aparelhos diferentes. [Medições atuais](../frontend/README.md)

O teste específico com foto real continua pendente e depende de o autor ter um arquivo disponível. O teste é feito no aparelho, com a foto fora do repositório e dos serviços de publicação. [Issue #6](https://github.com/MxK-rafas/Propertychain/issues/6)

## Depois

- Relatórios de verificação.
- Taxa por documento ou consulta e planos mensais.
- Piloto com cartórios parceiros.
- Armazenamento seguro para documentos reais e preparação jurídica e de privacidade para essa operação.

## Um dia

- Licenciamento da plataforma para cartórios.

Esses itens são hipóteses para avaliar. Cada implementação depende de uma decisão do autor sobre a prioridade e o escopo. [Roteiro do projeto](../ROADMAP.md)

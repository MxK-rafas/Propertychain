# Ficha do projeto

Texto entregue na atividade "Ficha do projeto" da formação (versão atualizada). Transcrito na issue #9 sem os colchetes do modelo. A nota final lista pontos de redação a alinhar com [`ESCOPO_JURIDICO.md`](ESCOPO_JURIDICO.md).

## 1 · Problema

Pessoas perdem dinheiro e confiabilidade quando não possuem o registro oficial de algum documento imobiliário. Isso acontece com frequência, principalmente com pessoas mais velhas e propriedades muito antigas.

## 2 · 5 Porquês

1. Por que a falta de registro/documento acontece? Porque as pessoas perdem, esquecem com o tempo.
2. Por que as pessoas perdem, esquecem com o tempo? Porque são documentos de pouco uso e muita burocracia.
3. Por que são documentos de pouco uso e muita burocracia? Porque estão relacionados ao sistema Judicial/Cartorial.
4. Por que estão relacionados ao sistema Judicial/Cartorial? Porque o registro de propriedades requer a intermediação dessas entidades.
5. Por que o registro de propriedades requer a intermediação dessas entidades? Porque não há uma plataforma acessível 100% confiável que valide esses documentos de forma verificável.

**Causa raiz:** as pessoas perdem e/ou não possuem os documentos que validem que elas são realmente as donas da propriedade. Com isso, perdem tempo e dinheiro na hora em que possíveis compradores verificam essas informações, o que faz o processo demorar muito mais ou os negociantes não confiarem na origem do imóvel.

## 3 · Como Poderíamos

Como poderíamos registrar os documentos para os proprietários de um jeito que seja fácil verificar o documento e quem o possui?

## 4 · Ideia, blockchain e primeira versão

**Ideia:** um app em que o proprietário e os compradores conseguem verificar a confiabilidade e a origem de documentos, e a blockchain garante um registro que ninguém apaga.

**Precisa de blockchain?** Sim, porque a blockchain torna a auditoria do cartório pública e verificável por qualquer pessoa, sem substituí-lo: todos podem verificar o documento, suas transferências e seu dono.

**Primeira versão:** a única ação do usuário é verificar e cadastrar os documentos.

**Superpoder escolhido:** registro que ninguém apaga.

---

## Nota de alinhamento com o escopo jurídico

O texto acima é o que foi entregue na formação e foi mantido. No app, no README e na apresentação, use a redação do escopo jurídico para estes termos:

| Na ficha | No projeto |
|----------|------------|
| "donas da propriedade", "quem a possui", "seu dono" | "titular atestado nos documentos" |
| "suas transferências" | "histórico de transferência documental simulada" |
| "registrar os documentos" | "cadastrar a impressão digital (hash) dos documentos" |
| auditoria "do cartório" | auditoria feita por um **cartório simulado** no protótipo, com o papel de validador |

Em uma frase, para todos os documentos: o Propertychain verifica documentos; quem registra a propriedade continua sendo o Cartório de Registro de Imóveis.

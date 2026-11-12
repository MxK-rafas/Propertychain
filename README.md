# Propertychain

> Verificação pública de documentos imobiliários em blockchain, com o cartório como entidade validadora (simulada).

**Aviso:** protótipo educacional, destinado à rede de testes Sepolia e atualmente testado localmente. **Não tem valor legal** e **não substitui o registro no Cartório de Registro de Imóveis**. Veja [docs/ESCOPO_JURIDICO.md](docs/ESCOPO_JURIDICO.md).

## O problema

Pessoas perdem tempo, dinheiro e confiabilidade quando não possuem o registro oficial de algum documento imobiliário. Isso acontece com frequência, principalmente com pessoas mais velhas e propriedades muito antigas. Na hora de vender, herdar ou comprar, é difícil achar e verificar os documentos, e compradores desconfiam da origem do imóvel.

## A ideia

Um app em que proprietários e compradores conseguem **verificar a origem e a confiabilidade de documentos imobiliários**. A blockchain guarda um registro que ninguém apaga e torna a auditoria do cartório **pública e verificável por qualquer pessoa, sem substituí-lo**.

## Fluxo previsto do aplicativo

1. O proprietário escolhe o arquivo. O navegador calcula o **hash SHA-256** (o arquivo não sai do computador) e envia o hash ao contrato, vinculado a um imóvel por uma referência opaca.
2. O **cartório simulado** (papel VALIDATOR) analisa o documento fora da chain e o marca como validado ou rejeitado.
3. **Qualquer pessoa** confere um documento sem precisar de carteira: arrasta o arquivo, o hash é recalculado e comparado com o que está na blockchain.
4. O validador pode atestar o **titular** constante nos documentos, e o histórico fica em uma linha do tempo.

## O que este projeto não faz

- Não cria token que represente o imóvel ou o direito de propriedade.
- Não transfere titularidade legal.
- Não guarda dados pessoais nem número de matrícula em claro na blockchain.

## Estrutura

```
contracts/   contrato Solidity e testes (Hardhat)
frontend/    pasta reservada ao app web (ainda não implementado)
docs/        escopo jurídico, arquitetura, personas e decisões
issues/      textos das tarefas com ID original e link para o GitHub
scripts/     consulta do backlog no GitHub
```

## Documentação

- [Roadmap](ROADMAP.md) e [índice de issues](ISSUES.md)
- [Escopo e limites jurídicos](docs/ESCOPO_JURIDICO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Como contribuir](CONTRIBUTING.md)

## Estado atual

O repositório contém o contrato `DocumentRegistry`, testes automatizados, documentação de escopo e arquitetura e o backlog. O frontend contém somente um marcador de pasta: as telas descritas ainda precisam ser implementadas. Não há endereço de contrato publicado na Sepolia nem aplicativo web disponível.

O contrato implementa submissão, validação, rejeição, revogação, consultas públicas e histórico de titulares atestados. A consulta confere a correspondência do hash e a decisão do validador; o hash sozinho não comprova a veracidade do conteúdo nem a propriedade legal.

## Executar e testar o contrato

Requisitos: Git e Node.js 22 ou 24 LTS com npm.

```bash
git clone https://github.com/MxK-rafas/Propertychain.git
cd Propertychain/contracts
npm ci
npm run compile
npm test
npm run coverage
```

Os testes usam a rede local em memória do Hardhat. Não exigem MetaMask, RPC da Sepolia, ETH de teste ou chave privada. O Hardhat baixa o compilador na primeira execução; é necessário acesso à internet para instalar dependências e obter o compilador.

Não execute `hardhat init`: o projeto já está configurado. Para detalhes, veja [ambiente](docs/AMBIENTE.md) e [API do contrato](contracts/README.md).

## Configuração

O arquivo [.env.example](.env.example) documenta as variáveis previstas para deploy e frontend. O contrato e os testes locais ainda não carregam esse arquivo. Não é necessário preenchê-lo para os comandos acima. A configuração da Sepolia, os scripts de deploy e o frontend fazem parte do backlog.

Arquivos `.env`, chaves, dependências, builds e relatórios de cobertura são ignorados pelo Git. Apenas exemplos sem segredos devem ser versionados. O lockfile npm é versionado para instalações reproduzíveis.

## Backlog e revisão

As 41 tarefas estão no [índice de issues](ISSUES.md) e no [GitHub](https://github.com/MxK-rafas/Propertychain/issues). Os números reais do GitHub diferem dos identificadores originais dos arquivos em `issues/`; consulte o índice antes de referenciar uma tarefa. A [revisão de entregas](docs/REVISAO_DE_ENTREGAS.md) registra evidências e pendências.

A primeira entrega do app continua sendo cadastrar e verificar documentos. Frontend, carteira, hash no navegador, painel do validador e deploy permanecem pendentes. Histórico e atestação já existem no contrato, mas ainda não têm interface.

## Stack

Contrato atual: Solidity 0.8.24, Hardhat 2 e OpenZeppelin AccessControl.

Frontend e rede pública planejados:

Solidity + Hardhat + OpenZeppelin · React + TypeScript + Vite + ethers v6 · Sepolia · GitHub Actions

## Licença

MIT. Veja [LICENSE](LICENSE).

O antigo `scripts/bootstrap_github.sh` agora apenas lista o backlog, evitando duplicação das issues já importadas.

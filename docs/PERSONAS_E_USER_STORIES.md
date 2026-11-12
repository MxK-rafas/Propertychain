# Personas e histórias do MVP atual

Referência: [SPEC.md](../SPEC.md). As personas são fictícias; o escopo se restringe ao teste atual.

## Personas

- **Seu José, proprietário/herdeiro:** usa celular e precisa de explicações simples para cadastrar o hash de um arquivo. Nesta demonstração, usa exemplo fictício ou arquivo local de teste.
- **Camila, compradora/corretora:** abre um link em outro celular, sem carteira, e quer saber o que foi registrado e se sua cópia digital corresponde.
- **Cartório de exemplo:** representa apenas uma etapa explicada visualmente; não é operador, conta ou carteira separada no MVP.

## Histórias incluídas

| História | Teste de aceite |
|---|---|
| Como proprietário, uso um exemplo ou seleciono um arquivo local para registrar seu hash | Só hash é enviado; foto não sai do dispositivo |
| Como proprietário, aprovo na Phantom de teste | Devnet explícita, uma carteira, cancelamento tratado, nenhuma chave privada pedida |
| Como iniciante, entendo que cartório e titularidade são simulados | Tela 2 explica papéis e não executa outra transação |
| Como terceiro, abro o link sem carteira | Outro aparelho consulta a mesma transação |
| Como terceiro, comparo minha cópia idêntica do arquivo | Hash igual coincide, diferente não; sem arquivo não há afirmação de correspondência |
| Como pessoa pouco técnica, entendo o resultado e erros | Português, fontes grandes, uma ação principal por tela e mensagens simples |
| Como avaliador, observo a velocidade | Dez medições de leitura de registro confirmado frente à meta de 1–5 segundos, sem incluir ação humana como tempo de rede |

## Fora do MVP

Painel de pendências, decisão de validador on-chain, atestação/revogação, identidade de proprietário, busca por matrícula, QR code e armazenamento remoto. As antigas histórias desses recursos não são requisitos atuais. Ver [ROADMAP.md](../ROADMAP.md).

# Roadmap

Roadmap do Propertychain. Caixas marcadas indicam implementação revisada na branch de importação; a conclusão no GitHub depende do merge do PR. As semanas são relativas ao início; ajuste conforme o prazo da formação.

## Visão geral

| Marco | Período | Entrega |
|-------|---------|---------|
| M0 · Fundação e escopo | Semana 1 | Repositório, escopo jurídico, personas e arquitetura definidos. |
| M1 · Smart contract | Semanas 2-3 | Contrato com submissão, validação, revogação, atestação de titular e consultas, testado e na Sepolia. |
| M2 · Frontend: cadastrar e verificar | Semanas 3-4 | App web com carteira, hash local do arquivo, tela de cadastro e tela pública de verificação. |
| M3 · Validador e cadeia de custódia | Semana 5 | Painel do cartório simulado, atestação de titular, histórico do imóvel e link/QR de verificação. |
| M4 · Qualidade, segurança e privacidade | Semana 6 | Revisão de segurança, LGPD, testes ponta a ponta, acessibilidade e tratamento de erros. |
| M5 · Entrega: deploy, demo e pitch | Semana 7 | Deploy público, documentação final, cenário de demonstração e apresentação. |

## Caminho crítico

Ambiente (#12) → arquitetura (#11) → contrato (#14 a #18) → testes (#19) → deploy (#20) → frontend (#21 a #25, com #30 e #37) → validador (#28) → deploy final (#4) → demo (#6) → pitch (#7).

O frontend pode começar em paralelo ao fim do contrato: #21 só depende do ambiente e da estrutura do contrato (#12, #14), e o nó local (#39) dispensa a Sepolia durante o desenvolvimento.

## MVP (o mínimo que precisa funcionar)

1. Cadastrar um documento (hash) e vinculá-lo a um imóvel (#15, #24, #30)
2. O cartório simulado validar ou rejeitar (#16, #28)
3. Qualquer pessoa verificar o documento sem carteira (#18, #25, #37), com o aviso legal visível (#38)
4. Ver o histórico do imóvel e o titular atestado (#1, #26)

Tudo marcado como `prioridade:P2` pode virar trabalho futuro sem comprometer a entrega.

## Detalhamento por marco

### M0 · Fundação e escopo

*Repositório, escopo jurídico, personas e arquitetura definidos.* (Semana 1)

- [ ] **#2** Criar o repositório e a estrutura inicial `P`
- [ ] **#8** Documentar escopo e limites jurídicos `P`
- [x] **#9** Transcrever a ficha do projeto e o Lean Canvas para o repositório `P`
- [x] **#10** Definir personas e user stories `P`
- [ ] **#11** Definir arquitetura, modelo de dados e eventos `M`
- [ ] **#12** Configurar o ambiente de desenvolvimento `M`
- [ ] **#13** Configurar integração contínua (GitHub Actions) `P`

### M1 · Smart contract

*Contrato com submissão, validação, revogação, atestação de titular e consultas, testado e na Sepolia.* (Semanas 2-3)

- [x] **#14** Contrato: estrutura base e controle de acesso `M`
- [x] **#15** Contrato: submeter documento `M`
- [x] **#16** Contrato: validar e rejeitar documento `M`
- [x] **#17** Contrato: revogar documento `P`
- [x] **#1** Contrato: atestar titular de um imóvel `G`
- [x] **#18** Contrato: funções de consulta `M`
- [ ] **#19** Contrato: testes unitários `M`
- [ ] **#20** Deploy do contrato na Sepolia `M`
- [ ] **#39** Ambiente local: nó Hardhat e seed de desenvolvimento `M`

### M2 · Frontend: cadastrar e verificar

*App web com carteira, hash local do arquivo, tela de cadastro e tela pública de verificação.* (Semanas 3-4)

- [ ] **#21** Frontend: setup do projeto `P`
- [ ] **#22** Frontend: conectar carteira e detectar rede `M`
- [ ] **#23** Frontend: calcular o hash do arquivo no navegador `M`
- [ ] **#24** Frontend: tela de cadastrar documento `M`
- [ ] **#25** Frontend: tela pública de verificação `M`
- [ ] **#26** Frontend: histórico do imóvel (linha do tempo) `M`
- [ ] **#27** Armazenamento off-chain opcional (IPFS com criptografia) `G`
- [ ] **#30** Identificador opaco do imóvel (sem dados pessoais) `M`
- [ ] **#37** Frontend: camada de leitura e eventos da blockchain `M`
- [ ] **#38** Frontend: aviso legal global e revisão de linguagem `P`
- [ ] **#40** Frontend: busca de imóvel por matrícula e salt `M`

### M3 · Validador e cadeia de custódia

*Painel do cartório simulado, atestação de titular, histórico do imóvel e link/QR de verificação.* (Semana 5)

- [ ] **#28** Frontend: painel do validador (cartório simulado) `G`
- [ ] **#29** Fluxo de atestação de titular e transferência documental simulada `M`
- [ ] **#31** Link e QR Code de verificação `P`

### M4 · Qualidade, segurança e privacidade

*Revisão de segurança, LGPD, testes ponta a ponta, acessibilidade e tratamento de erros.* (Semana 6)

- [ ] **#32** Revisão de segurança do contrato `M`
- [ ] **#33** Análise de LGPD e privacidade `M`
- [ ] **#34** Testes ponta a ponta do fluxo principal `G`
- [ ] **#35** Acessibilidade e linguagem simples `M`
- [ ] **#3** Estados de transação e tratamento de erros `M`

### M5 · Entrega: deploy, demo e pitch

*Deploy público, documentação final, cenário de demonstração e apresentação.* (Semana 7)

- [ ] **#4** Deploy do frontend `P`
- [ ] **#5** Documentação final `M`
- [ ] **#6** Cenário de demonstração e dados de seed `M`
- [ ] **#7** Pitch e preparação para a banca `M`
- [ ] **#36** Retrospectiva e trabalhos futuros `P`
- [ ] **#41** Plano B da demonstração (vídeo e capturas) `P`

## Definição de pronto (para cada issue)

- Critérios de aceite da issue atendidos
- Testes passando na CI
- Documentação atualizada, se algo visível mudou
- Pull Request revisado (mesmo que seja por você) e mesclado na `main`

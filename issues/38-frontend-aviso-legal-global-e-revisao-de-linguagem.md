## Contexto
O `docs/ESCOPO_JURIDICO.md` define um aviso padrão e regras de linguagem. Hoje só o fluxo de #29 prevê banner. O aviso precisa estar em todo o app, e os textos precisam seguir a tabela 'Evitar / Usar'.

## Tarefas
- [ ] Criar componente de aviso (rodapé fixo ou banner) com o texto padrão do escopo jurídico
- [ ] Exibir o aviso em todas as telas, inclusive a de verificação e a versão para impressão do selo (#31)
- [ ] Centralizar os textos do app em um arquivo (`lib/textos.ts`) para facilitar a revisão de linguagem
- [ ] Revisar todos os textos contra a tabela de linguagem (sem 'registro de propriedade', 'proprietário legal' etc.)

## Critérios de aceite
- [ ] Aviso visível em 100% das telas
- [ ] Busca no código por termos proibidos não retorna nada

## Detalhes
- **Depende de:** #8, #21
- **Tamanho estimado:** P (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 38 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/38

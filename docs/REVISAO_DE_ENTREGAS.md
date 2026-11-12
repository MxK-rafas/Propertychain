# Revisão de entregas

Revisão de 12/11/2026 do ZIP fornecido pelo autor, comparado com `main` (commit inicial `2689309`). O pull foi executado antes da importação. Instruções do kit foram tratadas como referências de planejamento; o bootstrap não foi executado.

## Validação realizada

- Dependências instaladas e lockfile npm gerado; ambiente de validação: Node.js 24.22.1, npm 11.9.0, Hardhat 2.29.2 e Solidity 0.8.24.
- Compilação bem-sucedida de 6 arquivos Solidity, incluindo dependências.
- 33 testes aprovados na rede local em memória.
- Cobertura do `DocumentRegistry.sol`: 100% de instruções, ramificações, funções e linhas. Não inclui auditoria nem validação da interface.
- `.gitignore` verificado para configurações locais, dependências e arquivos gerados. Exemplos e lockfile continuam versionáveis.

## Resultado por tarefa

Oito tarefas têm implementação completa e são vinculadas ao PR para fechamento após o merge. As outras 33 ficam abertas; arquivos presentes não bastam para satisfazer todos os critérios. Não há frontend funcional, publicação pública ou validação jurídica atualizada.

| Kit | Issue | Resultado | Evidência ou pendência |
|---|---|---|---|
| 01 | [#2](https://github.com/MxK-rafas/Propertychain/issues/2) | Pendente / parcial | Estrutura entregue; proteção da main, Projects, topics e organização por milestones ainda precisam ser conferidos/configurados. |
| 02 | [#8](https://github.com/MxK-rafas/Propertychain/issues/8) | Pendente / parcial | Rascunho presente; atualização das normas CNJ/ONR ainda não realizada. |
| 03 | [#9](https://github.com/MxK-rafas/Propertychain/issues/9) | Implementada | Ficha e Lean Canvas transcritos, com notas de alinhamento jurídico preservadas. |
| 04 | [#10](https://github.com/MxK-rafas/Propertychain/issues/10) | Implementada | Três personas, 12 histórias e indicação de MVP presentes. |
| 05 | [#11](https://github.com/MxK-rafas/Propertychain/issues/11) | Pendente / parcial | Arquitetura e ADRs presentes como propostas; codificação do identificador opaco ainda precisa ser fechada. |
| 06 | [#12](https://github.com/MxK-rafas/Propertychain/issues/12) | Pendente / parcial | Compilação e testes locais validados; carteira de testes, faucet e RPC da Sepolia não comprovados. |
| 07 | [#13](https://github.com/MxK-rafas/Propertychain/issues/13) | Pendente / parcial | Não há workflow nem check obrigatório de CI. |
| 08 | [#14](https://github.com/MxK-rafas/Propertychain/issues/14) | Implementada | AccessControl, papéis, structs e eventos conferidos por compilação e testes. |
| 09 | [#15](https://github.com/MxK-rafas/Propertychain/issues/15) | Implementada | Submissão Pending, metadados, evento e rejeição de duplicados testados. |
| 10 | [#16](https://github.com/MxK-rafas/Propertychain/issues/16) | Implementada | Validação/rejeição, motivos, datas, eventos e permissões testados. |
| 11 | [#17](https://github.com/MxK-rafas/Propertychain/issues/17) | Implementada | Revogação mantém consulta e histórico; testes aprovados. |
| 12 | [#1](https://github.com/MxK-rafas/Propertychain/issues/1) | Implementada | Atestação exige documento validado do mesmo imóvel; histórico e titular atestado testados. |
| 13 | [#18](https://github.com/MxK-rafas/Propertychain/issues/18) | Implementada | Consultas testadas com provedor sem assinante. Nome adotado: latestAttestedHolder. |
| 14 | [#19](https://github.com/MxK-rafas/Propertychain/issues/19) | Pendente / parcial | 33 testes aprovados e cobertura de 100%; falta execução em CI. |
| 15 | [#20](https://github.com/MxK-rafas/Propertychain/issues/20) | Pendente / parcial | Não há script, endereço, bloco ou verificação de deploy na Sepolia. |
| 16 | [#21](https://github.com/MxK-rafas/Propertychain/issues/21) | Pendente / parcial | Frontend ainda não implementado. |
| 17 | [#22](https://github.com/MxK-rafas/Propertychain/issues/22) | Pendente / parcial | Frontend ainda não implementado. |
| 18 | [#23](https://github.com/MxK-rafas/Propertychain/issues/23) | Pendente / parcial | Frontend ainda não implementado. |
| 19 | [#24](https://github.com/MxK-rafas/Propertychain/issues/24) | Pendente / parcial | Frontend ainda não implementado. |
| 20 | [#25](https://github.com/MxK-rafas/Propertychain/issues/25) | Pendente / parcial | Frontend ainda não implementado. |
| 21 | [#26](https://github.com/MxK-rafas/Propertychain/issues/26) | Pendente / parcial | Frontend ainda não implementado. |
| 22 | [#27](https://github.com/MxK-rafas/Propertychain/issues/27) | Pendente / parcial | O contrato aceita CID opcional; criptografia/IPFS não implementados nem decisão final registrada. |
| 23 | [#28](https://github.com/MxK-rafas/Propertychain/issues/28) | Pendente / parcial | Frontend ainda não implementado. |
| 24 | [#29](https://github.com/MxK-rafas/Propertychain/issues/29) | Pendente / parcial | Frontend ainda não implementado. |
| 25 | [#30](https://github.com/MxK-rafas/Propertychain/issues/30) | Pendente / parcial | Modelo proposto na arquitetura; faltam função do frontend, salt e documento específico. Concatenação de strings nos testes ainda exige especificação antes do frontend. |
| 26 | [#31](https://github.com/MxK-rafas/Propertychain/issues/31) | Pendente / parcial | Frontend ainda não implementado. |
| 27 | [#32](https://github.com/MxK-rafas/Propertychain/issues/32) | Pendente / parcial | Testes não substituem auditoria; Slither e documento de segurança ausentes. |
| 28 | [#33](https://github.com/MxK-rafas/Propertychain/issues/33) | Pendente / parcial | Escopo jurídico aborda privacidade; análise LGPD dedicada ausente. |
| 29 | [#34](https://github.com/MxK-rafas/Propertychain/issues/34) | Pendente / parcial | Frontend ainda não implementado. |
| 30 | [#35](https://github.com/MxK-rafas/Propertychain/issues/35) | Pendente / parcial | Frontend ainda não implementado. |
| 31 | [#3](https://github.com/MxK-rafas/Propertychain/issues/3) | Pendente / parcial | Frontend ainda não implementado. |
| 32 | [#4](https://github.com/MxK-rafas/Propertychain/issues/4) | Pendente / parcial | Entrega depende de app, deploy ou demonstração ainda ausentes. |
| 33 | [#5](https://github.com/MxK-rafas/Propertychain/issues/5) | Pendente / parcial | README atualizado para o estágio atual; faltam app executável, capturas e documentação da entrega final. |
| 34 | [#6](https://github.com/MxK-rafas/Propertychain/issues/6) | Pendente / parcial | Fluxo fictício em teste de contrato; faltam PDFs, seed e roteiro de demonstração. |
| 35 | [#7](https://github.com/MxK-rafas/Propertychain/issues/7) | Pendente / parcial | Canvas presente; faltam slides, FAQ e ensaio. |
| 36 | [#36](https://github.com/MxK-rafas/Propertychain/issues/36) | Pendente / parcial | Documento de retrospectiva e trabalhos futuros ausente. |
| 37 | [#37](https://github.com/MxK-rafas/Propertychain/issues/37) | Pendente / parcial | Frontend ainda não implementado. |
| 38 | [#38](https://github.com/MxK-rafas/Propertychain/issues/38) | Pendente / parcial | Frontend ainda não implementado. |
| 39 | [#39](https://github.com/MxK-rafas/Propertychain/issues/39) | Pendente / parcial | Sem scripts node/deploy:local/seed:local ou exportação da ABI. |
| 40 | [#40](https://github.com/MxK-rafas/Propertychain/issues/40) | Pendente / parcial | Frontend ainda não implementado. |
| 41 | [#41](https://github.com/MxK-rafas/Propertychain/issues/41) | Pendente / parcial | Entrega depende de app, deploy ou demonstração ainda ausentes. |

## Próximos passos

Configurar CI e confirmar o ambiente de testes da Sepolia; fechar as decisões de arquitetura; implementar o frontend de cadastro e verificação, incluindo o cálculo local do hash, a referência opaca e o painel do validador. A revogação do documento-base preserva atestações históricas: a interface deverá indicar o status desse documento.

O script de bootstrap foi substituído por consulta do backlog, pois reexecutar a versão do kit neste repositório criaria duplicatas e referências incorretas. A configuração de proteção da main, Projects, topics e milestones não foi alterada nesta revisão.


## Continuação: CI e ambiente local

Após o merge do PR #42, foram implementados o workflow de CI, o gate de 90% de linhas por contrato, deploy/seed local e exportação de ABI/configuração. A primeira revisão acima fica preservada como histórico.

- **#19**: 33 testes unitários aprovados, 100% de cobertura e workflow para executá-los em Pull Requests. A confirmação no GitHub Actions consta no novo PR.
- **#13**: workflow pronto, incluindo teste RPC e relatório como artefato. A proteção da main permanece pendente: a credencial recebeu `403 Resource not accessible by integration` ao consultar esse recurso. Veja [CI.md](CI.md).
- **#39**: nó, deploy, validador, cinco documentos, duas atestações, seed repetível e exportação implementados. O teste de integração verifica o fluxo completo com consultas sem carteira e detecta reinício do nó. O critério de aplicativo conectado aguarda o frontend da #21; a issue permanece aberta. Veja [AMBIENTE_LOCAL.md](AMBIENTE_LOCAL.md).

O gate também foi validado com relatório de 0% de linhas, que falhou como esperado, antes de restaurar o relatório real. Nenhuma carteira ou chave de rede pública foi utilizada.

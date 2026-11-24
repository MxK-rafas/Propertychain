# Revisão de estrutura e entregas — 24/11/2026

Solicitada pelo autor antes de continuar o pitch, [issue #59](https://github.com/MxK-rafas/Propertychain/issues/59). Base examinada: main `843d6936fc067cd653dd70aa0db31d44bc89a032`. Esta revisão consolida o estado do código, da documentação ativa, do build e das evidências; não é auditoria jurídica ou de segurança independente.

## Conclusão

A estrutura funcional está coerente com o frontend Solana/Phantom e a publicação estática. Havia divergências documentais concretas: estados de implantação antigos, botões diferentes dos atuais, histórico fictício prometido no resultado, PDF simultaneamente entregue e listado como futuro e descrições de CI desatualizadas. Foram corrigidas nos documentos ativos sem adicionar funcionalidades. Também foi corrigida uma identificação incorreta no resumo de tentativa recuperada: sem arquivo original, o comprovante de outro hash não pode receber o endereço da fixture.

A spec foi reescrita como descrição única do comportamento entregue; o roadmap separa concluído, apresentação solicitada e hipóteses futuras. A comparação de 12/11/2026 permanece identificada como histórica. Versões anteriores da [spec](historico/SPEC_ANTES_REVISAO_2026-11-24.md) e da [revisão](historico/REVISAO_ANTES_AUDITORIA_2026-11-24.md) foram preservadas, com ajuste apenas de links relativos para a nova localização.

## Comparação e correções

| Tema | Divergência encontrada | Estado documentado após a revisão |
|---|---|---|
| Cadastro | Spec prometia um botão automático Cadastrar documento | Hash e conexão explícitos, preparação, revisão e aprovação na Phantom |
| Consulta desde a entrada | Parte dos textos ainda tratava a consulta como simulada | Campo de link/código e arquivo opcional; leitura real da Devnet sem carteira |
| Resultado | Spec prometia Maria e histórico de titulares | Tipo não identificado, sem titular/histórico público; dados antigos preservados na fixture/protótipo |
| Transação | Texto do AI Kit ainda descrevia somente Memo | Compute Budget de preço zero + Memo; compatibilidade de leitura com Memo anterior |
| Relatório | Retrospectiva/spec ainda o listavam em Depois | Geração local entregue no PR #57 e aceite do autor na #56 em 24/11 |
| Persistência | Arquitetura não detalhava o comprovante de tentativa | sessionStorage só para hash/pagador/assinatura pendentes; arquivo/resultado/PDF em memória |
| Ambiente/Vercel | Guias descreviam frontend ou deploy futuros | App público, raiz frontend, build/dist e variáveis públicas efetivamente usados |
| CI | Contagens antigas e etapas simuladas | 90 testes em nove arquivos; job EVM separado; nomes do workflow preservados |
| Recuperação de tentativa | Comprovante de outro hash, sem arquivo, podia mostrar o endereço fictício | Resumo identifica arquivo não selecionado; teste reproduziu o erro antes da correção |
| Metadados | Descrição HTML dizia operações simuladas | Descrição de cadastro/consulta Devnet, comparação local e PDF; cartório simulado |
| Próxima prioridade | Pitch seguia apenas como material fora do MVP | Solicitação para 26/11 registrada, sem fingir material/ensaio concluídos |
| Catálogo | Estado histórico de tarefas podia ser lido como fila atual | Índice com estados GitHub, distinção de legado e #26 como referência visual |

A mudança sobre histórico de titulares é correção de documentação: não foi reintroduzida uma função ausente na consulta pública. As fontes de negócio preservam a hipótese original, sem transformá-la em entrega ou em autorização para ampliar o app.

## Estrutura conferida

- `frontend/src`: entrada/rotas, hash e Phantom, Memo/RPC, consulta, compartilhamento e PDF.
- `frontend/index.html` e Vite: entrada real do app; assets fictícios importados de fixtures; geração em dist.
- `frontend/prototype`: referência visual histórica, sem integração real; não é a publicação final.
- `fixtures`: PDF/JSON/TXT fictícios. O segundo modelo gerado no chat não foi apresentado como fixture versionada nesta revisão.
- `contracts`: Hardhat/Solidity e seus lockfile/scripts/testes próprios, sem importação pelo frontend.
- `.github/workflows/ci.yml`: jobs separados de frontend e legado EVM, Node 22.
- `scripts/bootstrap_github.sh`: somente consulta issues; não cria ou substitui backlog.
- `.env.example`: apenas defaults públicos Devnet; `.gitignore`: cobre configurações locais, documentos de teste, builds e artefatos.
- Canvas/ficha e ADRs históricas: fontes preservadas, com limites e referências ao escopo atual.

## Evidências e validação

Na cópia exata da base, executar em frontend: **npm ci, npm test e npm run build**. Resultado inicial: **90 testes em nove arquivos, TypeScript e build aprovados**. Uma nova regressão de recuperação de comprovante falhou antes da correção; após o ajuste, a suíte tem **91 testes em nove arquivos**. A execução final de 91 testes, TypeScript e build passou. Dependências não foram atualizadas.

Versões resolvidas no lockfile: React/react-dom 19.3.1; Vite 7.3.8; TypeScript 5.9.3; Vitest 4.1.12; @solana/kit 8.6.0; @wallet-standard/app 1.1.1; pdf-lib 1.17.1. A raiz não tem package.json e o deploy Vercel não depende de contracts.

As checagens desta revisão incluem links locais dos Markdown versionados, consistência das referências de arquivos, SHA-256 da fixture, assets da build, regras de ignore e leitura do app público/relatório com registro fictício existente. Não se envia transação em nome do autor. Resultado: 82 arquivos Markdown e 246 referências locais conferidos, sem caminhos ou âncoras quebradas; SHA-256 da fixture preservado. Dois links locais antigos no histórico EVM foram corrigidos. A restauração do comprovante também foi conferida em Chromium, em 390 e 1440 pixels, sem endereço fictício e com o acompanhamento disponível. Evidências na issue #59 e no PR da revisão.

Não foram encontrados, entre os caminhos versionados conferidos, arquivos .env locais, chaves .pem/.key ou documentos nas pastas pessoais de teste. Os caminhos de teste e dist/deployments estão ignorados. Isso é uma verificação de estrutura e regras, não garantia de ausência de vulnerabilidades ou auditoria completa de segredos.

## Evidências anteriores preservadas

- [Transação de exemplo no explorador Devnet](https://explorer.solana.com/tx/2s5ruPV79nw66AfL6DHgUuqGx7nH59WJEkxvqfAEDYsRiBTGemsFo8Pw7oaEegW5kkHTKDmYs3qwRtTPYmFRJ4G?cluster=devnet). Memo confirmado, teste manual do autor no PR #47.
- Consulta em outro aparelho, mesma cópia, cópia diferente e sem arquivo; correções de navegação e domínio oficial nos PRs #48–#54.
- Dez leituras de um registro confirmado: mediana 0,45 s, máximo 1,05 s, zero erros. Medição técnica registrada em 17/11/2026, excluindo carregamento, hash local e nova escrita; não é benchmark repetido nesta revisão.
- [#6](https://github.com/MxK-rafas/Propertychain/issues/6): aceite manual do teste com foto real em 23/11/2026. O arquivo não foi recebido pelo Codex; não alegar análise independente de seu conteúdo.
- [#56](https://github.com/MxK-rafas/Propertychain/issues/56): relatório implementado no PR #57, 90 testes e PDFs conferidos nos três estados, acesso público em sessões sem login; aceite informado pelo autor em 24/11/2026 e registrado no PR #58. Os relatos do autor não são ampliados para novos testes específicos não informados.

## O que segue pendente

Preparação e ensaio do pitch para 26/11/2026, na [#7](https://github.com/MxK-rafas/Propertychain/issues/7). Após esta auditoria, o autor relatou dificuldade de amigos com carteiras e autorizou a [evolução #61](FEEDBACKS_E_EXEMPLO_GUIADO.md); o registro separado documenta implementação e testes. A contagem de participantes e a melhora de usabilidade ainda não foram medidas. Nenhuma parceria de cartório, receita, produção jurídica ou função de Depois/Um dia é apresentada como concluída. Não houve mudança na validade do aceite do MVP ou do PDF.

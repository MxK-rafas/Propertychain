# Instruções para o Codex no PropertyChain

O autor é iniciante. Ler [SPEC.md](SPEC.md), [ROADMAP.md](ROADMAP.md) e [revisão atual](docs/REVISAO_DE_ENTREGAS.md). A spec atual descreve o aplicativo entregue. Canvas, protótipo, tarefas importadas e documentos em histórico preservam decisões anteriores; não autorizam funcionalidades por si.

- Antes de novo código/funcionalidade, apresentar plano simples e aguardar aprovação. Trabalhar uma etapa por vez e parar para o autor testar.
- Explicar mudanças, erros e como testar em português simples, sem presumir conhecimento de programação.
- App: React/TypeScript/Vite, Solana Devnet, SHA-256 local e Phantom. Consulta e relatório PDF sem carteira; publicação estática e pública na Vercel.
- Use o Solana AI Kit e as bibliotecas atuais da Solana (@solana/kit e Wallet Phantom). Conferir compatibilidade antes de alterar dependências; não instalar agentes, hooks ou carteiras de servidor por inferência.
- `contracts/` é legado Solidity/Hardhat isolado, sem dependência no build atual. Não retomar Sepolia/MetaMask/ethers, painel do validador ou atestação de titular por seguir tarefas históricas.
- Nunca pedir frase-semente/chave privada. Assinatura só na Phantom, com SOL de teste. Conexão confere o RPC Devnet, sem mudar a rede selecionada na UI da carteira.
- Fotos/documentos reais ficam no aparelho: sem versionar, publicar, logar, enviar a serviços ou usar em capturas públicas. Não fazer OCR nem inventar titular/endereço.
- Mesmos bytes coincidem; duas fotos do mesmo papel podem divergir. Sem arquivo, só consultar registro, sem afirmar integridade de uma cópia.
- Mostrar link do explorador antes de anunciar sucesso e conferir status/Memo/hash. Nunca reenviar automaticamente uma tentativa incerta.
- A meta de 1–5 s é leitura de registro confirmado. Separar carregamento, hash, assinatura humana, confirmação de escrita e PDF; não fabricar resultados para cumprir tempo.
- Manter português e uma ação principal por tela; nomes/estados atuais estão na spec. Não reintroduzir consulta simulada ou histórico de titularidade na tela real sem nova decisão.
- Não implementar itens de Depois/Um dia sem autorização explícita. Não apresentar testes EVM como evidência de Solana ou aceite manual como auditoria jurídica.
- Compartilhar o domínio oficial https://propertychain-theta.vercel.app/; previews podem exigir login.

## Entregas aceitas

- MVP e teste local com foto real: aceite do autor em 23/11/2026, [#6](https://github.com/MxK-rafas/Propertychain/issues/6). A foto não foi fornecida ao Codex.
- Relatório PDF local: escopo autorizado, PR #57 publicado e aceite do autor em 24/11/2026, [#56](https://github.com/MxK-rafas/Propertychain/issues/56), documentado no PR #58. Sem arquivo original, backend ou nova transação.
- 99 testes atuais em dez arquivos; a revisão histórica registrou 91 antes da evolução de feedbacks. Ver [#61](docs/FEEDBACKS_E_EXEMPLO_GUIADO.md); o texto do aceite não deve ser ampliado para testes não relatados.

## Trabalho atual

O autor solicitou pitch para quinta-feira, 26/11/2026 ([#7](https://github.com/MxK-rafas/Propertychain/issues/7)) e depois priorizou a auditoria da estrutura/spec/roadmap ([#59](https://github.com/MxK-rafas/Propertychain/issues/59)). Após a auditoria, o autor relatou dificuldade de amigos com carteiras e autorizou explicitamente a evolução [#61](https://github.com/MxK-rafas/Propertychain/issues/61): exemplo guiado sem carteira, explicação Phantom/blockchain e linguagem simples. Usar leituras reais do registro fictício; nunca simular sucesso ou enviar transações automaticamente. A issue fica aberta até teste/aceite do autor. Retomar o pitch após esta evolução. Preparação do pitch é material de apresentação; não declarar slides, ensaio, contagem de testadores ou ganho de conversão sem evidência.

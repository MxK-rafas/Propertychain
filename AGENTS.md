# Instruções para o Codex no PropertyChain

O autor é iniciante. A especificação ativa é [SPEC.md](SPEC.md). Ler também [docs/COMPARACAO_E_ALINHAMENTO.md](docs/COMPARACAO_E_ALINHAMENTO.md) e [ROADMAP.md](ROADMAP.md).

- Antes do código, apresentar um plano simples e esperar aprovação. Trabalhar uma etapa por vez; parar para o autor testar antes de avançar.
- Explicar o que mudou, como abrir e como testar, sem exigir conhecimento de programação. Explicar erros em português simples.
- Stack atual: Solana Devnet + Phantom; hash SHA-256 local; Memo; consulta pública sem carteira; frontend React/TypeScript/Vite publicado na Vercel.
- Use o Solana AI Kit e as bibliotecas atuais da Solana (@solana/kit e Wallet Phantom). Conferir a documentação atual e compatibilidade antes de instalar. Não introduzir carteira de servidor ou agentes autônomos.
- `contracts/`, o ambiente Hardhat e ADRs EVM marcados como históricos NÃO são dependências do MVP Solana. Não implementar ethers, Sepolia, MetaMask, painel do validador ou atestação on-chain por seguir tarefas antigas.
- `frontend/prototype/` é referência visual simulada, não app Solana funcional. Não marcar como entregue o frontend funcional apenas porque a referência abre.
- Nunca solicitar frase-semente ou chave privada; não adicionar `DEPLOYER_PRIVATE_KEY` a configuração ativa. Assinatura só na Phantom.
- O autor fornecerá uma foto real depois. Não versionar, publicar, logar nem enviar a serviços. Calcular hash localmente; não fazer OCR ou inventar proprietário a partir dela.
- Dois arquivos com os mesmos bytes coincidem; duas fotos do mesmo papel geralmente não. Sem arquivo local, só confirmar registro, não integridade da foto.
- Meta de leitura: 1–5 segundos para registro já confirmado, medida separadamente de carregamento, ação humana e confirmação da transação. Não usar sucesso fictício para cumprir tempo.
- Mostrar link da transação no explorador Devnet antes de anunciar sucesso; verificar confirmação, ausência de erro e Memo/hash esperado.
- Não implementar itens de Depois/Um dia. Não marcar testes EVM como evidência de Solana.

## Estado em 17/11/2026

Os PRs #45–#49 foram integrados à main. O autor validou o SHA-256, a conexão Phantom e o registro real do Memo na Devnet. A consulta sem carteira foi validada no computador e no celular, com arquivo idêntico, diferente e sem arquivo. O [app está publicado por HTTPS](https://propertychain-theta.vercel.app/). O cartório e o histórico da demonstração são fictícios. A [issue #6](https://github.com/MxK-rafas/Propertychain/issues/6) acompanha o teste específico com foto real.

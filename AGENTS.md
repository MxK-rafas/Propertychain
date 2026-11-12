# Instruções para o Codex no PropertyChain

O autor é iniciante. A especificação ativa é [SPEC.md](SPEC.md). Ler também [docs/COMPARACAO_E_ALINHAMENTO.md](docs/COMPARACAO_E_ALINHAMENTO.md) e [ROADMAP.md](ROADMAP.md).

- Antes do código, apresentar um plano simples e esperar aprovação. Trabalhar uma etapa por vez; parar para o autor testar antes de avançar.
- Explicar o que mudou, como abrir e como testar, sem exigir conhecimento de programação. Explicar erros em português simples.
- Stack atual: Solana Devnet + Phantom; hash SHA-256 local; Memo; consulta pública sem carteira; frontend React/TypeScript/Vite a implementar; publicação Vercel.
- Use o Solana AI Kit e as bibliotecas atuais da Solana (@solana/kit e Wallet Phantom). Conferir a documentação atual e compatibilidade antes de instalar. Não introduzir carteira de servidor ou agentes autônomos.
- `contracts/`, o ambiente Hardhat e ADRs EVM marcados como históricos NÃO são dependências do MVP Solana. Não implementar ethers, Sepolia, MetaMask, painel do validador ou atestação on-chain por seguir tarefas antigas.
- `frontend/prototype/` é referência visual simulada, não app Solana funcional. Não marcar como entregue o frontend funcional apenas porque a referência abre.
- Nunca solicitar frase-semente ou chave privada; não adicionar `DEPLOYER_PRIVATE_KEY` a configuração ativa. Assinatura só na Phantom.
- O autor fornecerá uma foto real depois. Não versionar, publicar, logar nem enviar a serviços. Calcular hash localmente; não fazer OCR ou inventar proprietário a partir dela.
- Dois arquivos com os mesmos bytes coincidem; duas fotos do mesmo papel geralmente não. Sem arquivo local, só confirmar registro, não integridade da foto.
- Meta de leitura: 1–5 segundos para registro já confirmado, medida separadamente de carregamento, ação humana e confirmação da transação. Não usar sucesso fictício para cumprir tempo.
- Mostrar link da transação no explorador Devnet antes de anunciar sucesso; verificar confirmação, ausência de erro e Memo/hash esperado.
- Não implementar itens de Depois/Um dia. Não marcar testes EVM como evidência de Solana.

O pedido atual consolidou escopo, referência visual e documentação no repositório. O autor aprovou o plano do primeiro bloco. A etapa 2 (React, telas, arquivo local e testes) foi implementada, com operações ainda simuladas. Respeitar a pausa para o autor testar antes de avançar para Phantom/SHA-256.

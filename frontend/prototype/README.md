# Referência visual das quatro telas

Fonte: versão final aprovada no chat, antes da implementação da blockchain. Estes arquivos são apenas aparência e navegação simuladas, sem Phantom, transação real, upload ou RPC. Não representam o MVP funcional entregue.

O escopo atual está em [SPEC.md](../../SPEC.md) e as instruções para o Codex em [AGENTS.md](../../AGENTS.md). Ao implementar o app, adaptar os avisos: cadastro/consulta na Devnet serão reais; cartório e dados do exemplo continuam fictícios. Para a foto real, retirar os dados de Maria e não inventar informações.

Para visualizar localmente, na raiz do repositório, com Python instalado:

```bash
python3 -m http.server 8000 --directory frontend/prototype
```

Abrir `http://localhost:8000`. As etapas também podem ser abertas por `#cadastro`, `#validacao`, `#consulta` e `#resultado`. O servidor local não é um deploy Vercel. O app React funcional será implementado em `frontend/`, sem depender dos contratos legados.

Os arquivos preservam o visual aprovado; textos antigos como “nenhum arquivo será enviado” e “sem acesso a registros reais” se referem à simulação visual. Os estados reais devem seguir a spec. Não adicionar integração Solana diretamente a esta referência para contornar as pausas de teste.

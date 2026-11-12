# Como contribuir

Leia [SPEC.md](SPEC.md), [AGENTS.md](AGENTS.md) e [ISSUES.md](ISSUES.md). O escopo atual substitui tarefas antigas de Sepolia; o legado não deve orientar novas funcionalidades por engano.

1. Apresente o plano antes do código; aguarde aprovação do autor.
2. Trabalhe uma etapa por vez e pare para o autor testar antes de avançar.
3. Crie branch a partir de `main`, com commits pequenos e claros.
4. Abra Pull Request com problema resolvido, mudança e validação. Use referência de issue sem fechá-la como implementada se entregou somente documentação ou proposta.
5. Confira CI apropriada e revisão antes de integrar. O job EVM não demonstra Solana funcionando.

Nunca versionar foto/documento real, `.env`, chave privada ou frase-semente. Nunca pedir exportação de chave ao autor. Usar Phantom e Devnet; consulta sem carteira. Os diretórios `private-test-files/` e `testes-privados/` são ignorados para apoiar testes locais, mas documentos pessoais também não devem ser copiados para assets públicos.

Explicar problemas e instruções em português simples. Não implementar Depois/Um dia, OCR, backend, armazenamento remoto ou validação real de cartório.

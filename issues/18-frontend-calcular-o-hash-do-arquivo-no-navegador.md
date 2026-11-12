## Contexto
O documento nunca deve sair do computador do usuário sem consentimento. Só o hash (SHA-256) vai para a blockchain. SHA-256 permite que qualquer pessoa confira com ferramentas padrão (`sha256sum`).

## Tarefas
- [ ] Implementar leitura do arquivo e SHA-256 via Web Crypto API
- [ ] Drag & drop e seleção de arquivo
- [ ] Exibir o hash e permitir copiar
- [ ] Tratar arquivos grandes sem travar a página

## Critérios de aceite
- [ ] Mesmo arquivo gera o mesmo hash do `sha256sum`
- [ ] Nenhuma requisição de rede envia o arquivo

## Detalhes
- **Depende de:** #21
- **Tamanho estimado:** M (P ≈ 1-2 h, M ≈ meio dia, G ≈ 1 dia ou mais)


Origem: tarefa 18 do kit. Issue atual: https://github.com/MxK-rafas/Propertychain/issues/23

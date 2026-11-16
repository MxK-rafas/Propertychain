# PropertyChain — etapa 2

Uma tela de entrada por perfil e as quatro telas do percurso estão implementadas em React + TypeScript + Vite, com seleção local de PDF/JPEG/PNG. **Cadastro, cartório e consulta continuam simulados.** Não há conexão com Phantom, cálculo de hash, transação ou consulta Solana nesta entrega.

O arquivo escolhido fica apenas na memória da página. Não há upload, OCR, leitura de conteúdo, armazenamento ou log do arquivo. Ao escolher outro arquivo, os dados de Maria, endereço e histórico fictícios desaparecem. Ao atualizar ou fechar a página, a seleção é descartada.

## Abrir no computador

Instale Node.js 22.12 ou superior (22/24 LTS) e baixe este repositório. Abra um terminal dentro da pasta `frontend` e execute:

```bash
npm ci
npm run dev
```

Abra o endereço mostrado pelo terminal, normalmente `http://localhost:5173`. Mantenha o terminal aberto durante o teste; pressione Ctrl+C quando terminar. Não coloque seu arquivo de teste dentro do repositório: selecione-o no botão do app, a partir da pasta em que ele já está.

Para usar um celular na mesma rede Wi-Fi, abra o endereço `Network` mostrado pelo Vite. Se a rede/firewall impedir acesso, faça primeiro o teste no computador. Esta opção é local e não é uma publicação na Vercel.

## Teste de aceite do autor

1. Na entrada, escolha Proprietário e clique em “Entrar na demonstração”. Abra o exemplo e percorra: cadastrar → cartório simulado → consultar → resultado.
2. Confira que nenhuma tela afirma ter confirmado um registro real na Devnet.
3. Volte ao cadastro e escolha uma imagem ou PDF do dispositivo. O nome do arquivo deve aparecer; Maria, o endereço e o histórico fictícios devem desaparecer em todas as telas.
4. No resultado desse arquivo, confira “Não identificado pelo app” e a explicação de que o conteúdo não foi analisado.
5. Volte ao cadastro e use “Usar exemplo fictício”. Os dados de demonstração devem voltar.
6. Selecione um arquivo e atualize a página: a seleção deve desaparecer. Experimente também voltar às telas e repetir a consulta.

**Pausa:** informe o que funcionou e o que precisa melhorar antes de avançarmos para Phantom e SHA-256.

## Verificações de desenvolvimento

```bash
npm test
npm run build
npm run preview
```

`test` executa nove testes de comportamento. `build` verifica TypeScript e gera `dist/`. `preview` abre a build local; não faz deploy.

O PDF/JSON fictício é importado da pasta `../fixtures/`; apenas esses assets públicos entram na build. Não colocar fotos reais em `src`, `public`, `fixtures` ou `dist`. As dependências são registradas em `package-lock.json` e a CI roda com `npm ci`.

O protótipo HTML original permanece em `prototype/` como referência. A [SPEC.md](../SPEC.md) e o [AGENTS.md](../AGENTS.md) orientam as próximas etapas. Vercel, carteira, hash e rede serão trabalhados nas etapas correspondentes, após o aceite desta entrega.

## Apresentação por perfil

Ao abrir o endereço principal, aparece a escolha de perfil. Proprietário abre cadastro, Comprador / verificador abre consulta e Cartório abre validação simulada. Não é login real: nenhuma conta, senha, carteira ou permissão é criada. Use “Trocar perfil” para reiniciar a apresentação em outro caminho. Voltar da primeira tela de cada caminho retorna à entrada. Rotas diretas continuam acessíveis.

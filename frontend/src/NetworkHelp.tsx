export function NetworkHelp() {
  return <details className="learning-help">
    <summary>Saiba mais: blockchain</summary>
    <p>A blockchain guarda o código (hash) do arquivo para permitir comparações. O PDF fica no seu aparelho.</p>
    <p>O código e o endereço da carteira são públicos.</p>
    <p>Usamos a Solana Devnet, rede de testes que pode ficar indisponível ou apagar registros. O cadastro não comprova autenticidade ou propriedade.</p>
  </details>;
}

export function PhantomHelp() {
  return <div className="wallet-explanation">
    <h3>Por que o cadastro precisa da Phantom?</h3>
    <p>A Phantom é a carteira que autoriza o cadastro. O app só envia o registro depois da sua aprovação.</p>
    <p><strong>Exemplo e consulta dispensam carteira.</strong> A taxa usa SOL de teste, sem valor financeiro. Não compre moedas.</p>
    <details className="learning-help">
      <summary>Ainda não tenho a Phantom</summary>
      <ol>
        <li>Use o <a className="text-link" href="https://phantom.com/download" target="_blank" rel="noreferrer">site oficial da Phantom</a> para instalar o aplicativo no celular ou a extensão no computador. Crie sua carteira seguindo as instruções da própria Phantom.</li>
        <li>Ative a visualização da rede de testes Solana Devnet na Phantom. No celular, abra este app pelo navegador interno da carteira para cadastrar.</li>
        <li>Obtenha créditos gratuitos de teste no <a className="text-link" href="https://faucet.solana.com/" target="_blank" rel="noreferrer">faucet oficial da Solana</a>. Eles servem para a taxa do cadastro. Volte aqui e conecte sua carteira.</li>
      </ol>
      <p>Nunca pedimos frase de recuperação ou chave privada.</p>
      <a className="text-link" href="#exemplo">Prefiro experimentar sem carteira</a>
    </details>
  </div>;
}

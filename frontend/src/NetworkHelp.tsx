export function NetworkHelp() {
  return <details className="learning-help">
    <summary>O que é blockchain e por que ela aparece aqui?</summary>
    <p>Blockchain é uma rede de registros que outras pessoas podem consultar. Aqui, ela guarda um código que identifica o arquivo. Esse código muda quando o arquivo muda.</p>
    <p>Seu documento fica no aparelho. A rede recebe o código e os dados públicos do registro, incluindo o endereço da carteira que o autorizou.</p>
    <p>Este app usa a Solana Devnet, uma rede de testes. O registro ajuda a comparar cópias; não comprova quem é o proprietário nem se o conteúdo do documento é verdadeiro. A rede de testes pode ficar indisponível ou apagar registros em uma reinicialização.</p>
  </details>;
}

export function PhantomHelp() {
  return <div className="wallet-explanation">
    <h3>Por que o cadastro precisa da Phantom?</h3>
    <p>A Phantom é um aplicativo de carteira digital. Você a usa para autorizar o registro do código do arquivo. O PropertyChain só envia o registro depois da sua aprovação.</p>
    <p><strong>Para consultar ou experimentar, você não precisa de carteira.</strong> No cadastro, a taxa da rede usa SOL de teste, sem valor financeiro. Não compre criptomoedas para esta demonstração.</p>
    <details className="learning-help">
      <summary>Ainda não tenho a Phantom</summary>
      <ol>
        <li>Use o <a className="text-link" href="https://phantom.com/download" target="_blank" rel="noreferrer">site oficial da Phantom</a> para instalar o aplicativo no celular ou a extensão no computador. Crie sua carteira seguindo as instruções da própria Phantom.</li>
        <li>Ative a visualização da rede de testes Solana Devnet na Phantom. No celular, abra este app pelo navegador interno da carteira para cadastrar.</li>
        <li>Obtenha créditos gratuitos de teste no <a className="text-link" href="https://faucet.solana.com/" target="_blank" rel="noreferrer">faucet oficial da Solana</a>. Eles servem para a taxa do cadastro. Volte aqui e conecte sua carteira.</li>
      </ol>
      <p>As informações de recuperação da carteira ficam sob seu controle. O PropertyChain nunca pede sua frase de recuperação ou chave privada.</p>
      <a className="text-link" href="#exemplo">Prefiro experimentar sem carteira</a>
    </details>
  </div>;
}

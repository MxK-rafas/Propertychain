import { useEffect, useRef, useState } from 'react';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';
import { checkDevnet, getPhantom, sha256, validatePublicAddress } from './preparation';
import type { PhantomProvider } from './preparation';

export function PreparationPanel({ file, wallet = false }: { file: File | null; wallet?: boolean }) {
  const [digest, setDigest] = useState('');
  const [hashBusy, setHashBusy] = useState(false);
  const [hashError, setHashError] = useState('');
  const [account, setAccount] = useState('');
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletError, setWalletError] = useState('');
  const request = useRef(0);
  const walletRequest = useRef(0);
  const provider = useRef<PhantomProvider | undefined>(undefined);
  const controller = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    request.current++;
    setDigest(''); setHashError(''); setHashBusy(false);
    return () => { request.current++; };
  }, [file]);
  const stopWatching = useRef<(() => void) | undefined>(undefined);
  function watch(p: PhantomProvider) {
    if (provider.current === p && stopWatching.current) return;
    stopWatching.current?.(); provider.current = p;
    const invalidate = () => {
      walletRequest.current++; controller.current?.abort();
      setAccount(''); setWalletBusy(false);
      setWalletError('A carteira foi desconectada ou trocou de conta. Conecte novamente para conferir a rede.');
    };
    p.on('disconnect', invalidate); p.on('accountChanged', invalidate);
    stopWatching.current = () => {
      p.removeListener('disconnect', invalidate); p.removeListener('accountChanged', invalidate);
    };
  }
  useEffect(() => {
    const p = getPhantom();
    if (wallet && p?.isPhantom) watch(p);
    return () => {
      walletRequest.current++; controller.current?.abort();
      stopWatching.current?.(); stopWatching.current = undefined;
    };
  }, [wallet]);
  async function calculate() {
    const id = ++request.current;
    setHashBusy(true); setHashError(''); setDigest('');
    try {
      let bytes: ArrayBuffer;
      if (file) bytes = await file.arrayBuffer();
      else {
        const response = await fetch(samplePdf);
        if (!response.ok) throw new Error('Não foi possível abrir o PDF fictício. Tente novamente.');
        bytes = await response.arrayBuffer();
      }
      const value = await sha256(bytes);
      if (!file && value !== sample.sha256) throw new Error('Não foi possível abrir o PDF fictício correto. Atualize o app e tente novamente.');
      if (id === request.current) setDigest(value);
    } catch (error) {
      if (id === request.current) setHashError(error instanceof Error && /^(Abra o app|Não foi possível abrir o PDF)/.test(error.message) ? error.message : 'Não foi possível ler o arquivo. Selecione-o novamente.');
    } finally { if (id === request.current) setHashBusy(false); }
  }
  async function connect() {
    const p = getPhantom();
    if (!p?.isPhantom) { setWalletError('Phantom não encontrada. No computador, instale a extensão oficial. No celular, abra o app pelo navegador da Phantom. A consulta não exige carteira.'); return; }
    const id = ++walletRequest.current;
    watch(p);
    setWalletBusy(true); setWalletError(''); setAccount('');
    controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await p.connect();
      if (id !== walletRequest.current || abort.signal.aborted) return;
      const publicAddress = await validatePublicAddress(result.publicKey.toString());
      if (id !== walletRequest.current || abort.signal.aborted) return;
      timer = setTimeout(() => abort.abort(), 15000);
      await checkDevnet(abort.signal);
      if (id === walletRequest.current) setAccount(publicAddress);
    } catch (error) {
      const code = (error as { code?: number })?.code;
      const known = error instanceof Error && /Configure somente|servidor configurado|Use um endereço/.test(error.message);
      if (id === walletRequest.current) setWalletError(code === 4001 ? 'Conexão cancelada na Phantom. Você pode tentar novamente.' : known ? (error as Error).message : 'Não foi possível confirmar a conexão e a Devnet. Confira a Phantom e sua internet e tente novamente.');
    } finally { clearTimeout(timer); if (id === walletRequest.current) setWalletBusy(false); }
  }
  async function disconnect() {
    walletRequest.current++; controller.current?.abort(); setAccount(''); setWalletError('');
    try { await provider.current?.disconnect(); setWalletError(''); }
    catch { setWalletError('A conexão foi removida deste app. Confira também os aplicativos conectados na Phantom.'); }
  }
  return <section className="preparation" aria-label="Preparação do documento">
    <h3>Impressão digital do arquivo</h3>
    <p>Um código calculado neste dispositivo. Ele identifica os bytes do arquivo; não comprova sua autenticidade ou propriedade.</p>
    <button className="secondary-action" disabled={hashBusy} onClick={calculate}>{hashBusy ? 'Calculando…' : 'Calcular impressão digital'}</button>
    <div aria-live="polite">{digest && <><span className="field-label">SHA-256 calculado localmente</span><output className="digest">{digest}</output><p>O mesmo arquivo produz o mesmo código. Outra foto do mesmo papel normalmente produz um código diferente.</p></>}</div>
    {hashError && <p role="alert" className="error-message">{hashError}</p>}
    {wallet && <div className="wallet-panel"><h3>Carteira de teste</h3><p>A conexão permite ver seu endereço público. Nesta etapa, não pedimos assinatura nem enviamos transações.</p>
      {account ? <><p role="status">Carteira conectada · RPC Solana Devnet confirmado</p><output className="digest">{account}</output><p>Isso identifica a rede do app; não altera a rede selecionada na interface da Phantom.</p><button className="secondary-action" onClick={disconnect}>Desconectar Phantom</button></> : <button className="secondary-action" disabled={walletBusy} onClick={connect}>{walletBusy ? 'Conectando e conferindo a Devnet…' : 'Conectar Phantom de teste'}</button>}
      {walletError && <p role="alert" className="error-message">{walletError}</p>}
    </div>}
    <p>Nenhum registro enviado. Cadastro e consulta na blockchain ainda são demonstrações.</p>
  </section>;
}

import { useCallback, useEffect, useRef, useState } from 'react';
import sample from '../../fixtures/documento-ficticio.json';
import samplePdf from '../../fixtures/documento-ficticio.pdf?url';
import { checkDevnet, getPhantom, sha256, validatePublicAddress } from './preparation';
import { MemoRegistration } from './MemoRegistration';
import { PhantomHelp, NetworkHelp } from './NetworkHelp';
import { readPending } from './memo-record';
import type { MemoRecord } from './memo-record';
import type { PhantomProvider } from './preparation';

export function PreparationPanel({ file, wallet = false, onRegistered, onBusy, onPendingHash }: { file: File | null; wallet?: boolean; onRegistered?: (record: MemoRecord) => void; onBusy?: (value: boolean) => void; onPendingHash?: (hash: string | null) => void }) {
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const busyChanged = useCallback((value: boolean) => { setRegistrationBusy(value); onBusy?.(value); }, [onBusy]);
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
    if (!p?.isPhantom) { setWalletError('Phantom não encontrada. Abra “Ainda não tenho a Phantom” para saber como começar, ou use o exemplo sem carteira.'); return; }
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
    <h3>Código do arquivo</h3>
    <p>Vamos calcular um código que muda quando o arquivo muda. Ele permite comparar cópias; não comprova autenticidade ou propriedade.</p>
    <button className="secondary-action" disabled={hashBusy || registrationBusy || (wallet && !!readPending())} onClick={calculate}>{hashBusy ? 'Calculando…' : 'Calcular código do arquivo'}</button>
    <div aria-live="polite">{digest && <><span className="field-label">Código calculado neste aparelho (SHA-256)</span><output className="digest">{digest}</output><p>O mesmo arquivo produz o mesmo código. Outra foto do mesmo papel normalmente produz um código diferente.</p></>}</div>
    {hashError && <p role="alert" className="error-message">{hashError}</p>}
    {wallet && <div className="wallet-panel"><PhantomHelp /><NetworkHelp />
      {account ? <><p role="status">Carteira conectada · rede do app: Solana Devnet</p><output className="digest">{account}</output><p>Isso identifica a rede do app; não altera a rede selecionada na interface da Phantom.</p><button className="secondary-action" disabled={registrationBusy} onClick={disconnect}>Desconectar Phantom</button></> : <button className="secondary-action" disabled={walletBusy || registrationBusy} onClick={connect}>{walletBusy ? 'Conectando e conferindo a Devnet…' : 'Conectar Phantom de teste'}</button>}
      {walletError && <p role="alert" className="error-message">{walletError}</p>}
    </div>}
    {wallet ? <MemoRegistration hash={digest} account={account} onRegistered={onRegistered} onBusy={busyChanged} onPendingHash={onPendingHash} /> : <p>O cálculo é local; esta consulta ainda não busca transações na blockchain.</p>}
  </section>;
}

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { App } from './App';
import { savePending } from './memo-record';

afterEach(() => vi.unstubAllGlobals());
function openCadastro() { window.history.replaceState(null, '', '/#cadastro'); }
async function next(label: string) {
  await userEvent.click(screen.getByRole('button', { name: label }));
}
describe('Demonstração do PropertyChain', () => {
  it('não atribui endereço fictício a comprovante recuperado sem o arquivo original', () => {
    savePending({ hash: 'a'.repeat(64), payer: '1'.repeat(32), signature: '1'.repeat(64) });
    openCadastro();
    render(<App />);
    expect(screen.getByText('Arquivo do registro')).toBeVisible();
    expect(screen.queryByText(/Rua das Palmeiras/)).not.toBeInTheDocument();
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Conferir registro existente' })).toBeEnabled();
  });
  it('vai do cadastro e cartório à consulta real, sem inventar resultado', async () => {
    openCadastro();
    render(<App />);
    expect(screen.getByRole('heading', { name: /Cadastre seu documento/ })).toBeVisible();
    window.location.hash = 'validacao';
    await screen.findByRole('heading', { name: /Validação pelo cartório/ });
    await next('Ver validação simulada');
    expect(await screen.findByRole('heading', { name: 'Verificar documento' })).toBeVisible();
    expect(screen.getByLabelText('Link do registro ou código da transação')).toHaveValue('');
    expect(screen.getByText('ETAPA 3 DE 4')).toBeVisible();
    await next('Verificar documento');
    expect(await screen.findByRole('alert')).toHaveTextContent('Cole o link completo');
    expect(screen.queryByRole('heading', { name: 'Resultado da verificação' })).not.toBeInTheDocument();
    await next('Trocar perfil');
    expect(await screen.findByRole('heading', { name: /Como deseja entrar/ })).toBeVisible();
  });

  it('mantém arquivo local sem rede e remove dados fictícios em todo o percurso', async () => {
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    openCadastro();
    render(<App />);
    const file = new File(['imagem fictícia de teste'], 'foto-de-teste.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    expect(screen.getByText(file.name)).toBeVisible();
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(screen.queryByText(/Rua das Palmeiras/)).not.toBeInTheDocument();
    window.location.hash = 'validacao';
    await screen.findByRole('heading', { name: /Validação pelo cartório/ });
    await next('Ver validação simulada');
    await screen.findByRole('heading', { name: 'Verificar documento' });
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Link do registro ou código da transação')).toHaveValue('');
    expect(screen.queryByText('João Oliveira')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Histórico fictício' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Rua das Palmeiras/)).not.toBeInTheDocument();
    expect(request).not.toHaveBeenCalled();
  });

  it('permite retornar ao exemplo e selecionar novamente o mesmo arquivo', async () => {
    openCadastro();
    render(<App />);
    const file = new File(['pdf fictício'], 'teste.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    await next('Usar exemplo fictício');
    expect(screen.getByText('Maria Oliveira')).toBeVisible();
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
  });

  it('recusa arquivo vazio ou incompatível sem descartar o anterior', async () => {
    openCadastro();
    render(<App />);
    const upload = userEvent.setup({ applyAccept: false });
    const input = screen.getByLabelText('Escolher foto ou PDF local');
    await upload.upload(input, new File(['teste'], 'primeiro.png', { type: 'image/png' }));
    await upload.upload(input, new File(['<script>teste</script>'], 'invalido.html', { type: 'text/html' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Escolha um arquivo PDF, JPEG ou PNG');
    expect(screen.getByText('primeiro.png')).toBeVisible();
    await upload.upload(input, new File([], 'vazio.pdf', { type: 'application/pdf' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Este arquivo está vazio');
    expect(screen.getByText('primeiro.png')).toBeVisible();
  });

  it('suporta rota direta, alteração de hash e rota desconhecida', async () => {
    window.history.replaceState(null, '', '/#consulta');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Verificar documento' })).toBeVisible();
    window.location.hash = 'rota-inexistente';
    await waitFor(() => expect(screen.getByRole('heading', { name: /Como deseja entrar/ })).toBeVisible());
  });

  it('não mantém seleção do arquivo após desmontar e abrir o app novamente', async () => {
    openCadastro();
    const { unmount } = render(<App />);
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), new File(['exemplo'], 'local.jpeg', { type: 'image/jpeg' }));
    unmount();
    openCadastro();
    render(<App />);
    expect(screen.queryByText('local.jpeg')).not.toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira')).toBeVisible();
  });
});


describe('Entrada demonstrativa por perfil', () => {
  it.each([
    ['Proprietário', /Cadastre seu documento/],
    ['Comprador \/ verificador', /^Verificar documento$/],
    ['Cartório', /Validação pelo cartório/],
  ])('abre o caminho de %s sem autenticação', async (profile, destination) => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Como deseja entrar/ })).toBeVisible();
    await userEvent.click(screen.getByRole('radio', { name: new RegExp(String(profile)) }));
    await next('Entrar na demonstração');
    expect(await screen.findByRole('heading', { name: destination as RegExp })).toBeVisible();
    await next('Trocar perfil');
    expect(await screen.findByRole('heading', { name: /Como deseja entrar/ })).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

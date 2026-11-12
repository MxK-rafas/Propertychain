import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { App } from './App';

afterEach(() => vi.unstubAllGlobals());
async function next(label: string) {
  await userEvent.click(screen.getByRole('button', { name: label }));
}
describe('Demonstração do PropertyChain', () => {
  it('percorre as quatro telas, volta e repete a consulta sem alegar sucesso real', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Cadastre seu documento/ })).toBeVisible();
    await next('Cadastrar documento');
    expect(await screen.findByRole('heading', { name: /Validação pelo cartório/ })).toBeVisible();
    await next('Ver validação simulada');
    expect(await screen.findByRole('heading', { name: /Conheça a origem do documento/ })).toBeVisible();
    await next('Verificar documento');
    expect(await screen.findByRole('heading', { name: /Exemplo de resultado/ })).toBeVisible();
    expect(screen.getByText(/Nenhum registro foi consultado na Solana Devnet/)).toBeVisible();
    expect(screen.getAllByText('Maria Oliveira')[0]).toBeVisible();
    expect(screen.getByText('João Oliveira')).toBeVisible();
    await next('Fazer nova consulta');
    expect(await screen.findByRole('heading', { name: /Conheça a origem/ })).toBeVisible();
    await next('Voltar à tela anterior');
    expect(await screen.findByRole('heading', { name: /Validação pelo cartório/ })).toBeVisible();
  });

  it('mantém arquivo local sem rede e remove dados fictícios em todo o percurso', async () => {
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    render(<App />);
    const file = new File(['imagem fictícia de teste'], 'foto-de-teste.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    expect(screen.getByText(file.name)).toBeVisible();
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(screen.queryByText(/Rua das Palmeiras/)).not.toBeInTheDocument();
    await next('Cadastrar documento');
    await screen.findByRole('heading', { name: /Validação pelo cartório/ });
    await next('Ver validação simulada');
    await screen.findByRole('heading', { name: /Conheça a origem/ });
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    await next('Verificar documento');
    await screen.findByRole('heading', { name: /Exemplo de resultado/ });
    expect(screen.getByText('Não identificado pelo app')).toBeVisible();
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
    expect(screen.queryByText('João Oliveira')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Histórico fictício' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Rua das Palmeiras/)).not.toBeInTheDocument();
    expect(request).not.toHaveBeenCalled();
  });

  it('permite retornar ao exemplo e selecionar novamente o mesmo arquivo', async () => {
    render(<App />);
    const file = new File(['pdf fictício'], 'teste.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    await next('Usar exemplo fictício');
    expect(screen.getByText('Maria Oliveira')).toBeVisible();
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), file);
    expect(screen.queryByText('Maria Oliveira')).not.toBeInTheDocument();
  });

  it('recusa arquivo vazio ou incompatível sem descartar o anterior', async () => {
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
    expect(screen.getByRole('heading', { name: /Conheça a origem/ })).toBeVisible();
    window.location.hash = 'rota-inexistente';
    await waitFor(() => expect(screen.getByRole('heading', { name: /Cadastre seu documento/ })).toBeVisible());
  });

  it('não mantém seleção do arquivo após desmontar e abrir o app novamente', async () => {
    const { unmount } = render(<App />);
    await userEvent.upload(screen.getByLabelText('Escolher foto ou PDF local'), new File(['exemplo'], 'local.jpeg', { type: 'image/jpeg' }));
    unmount();
    render(<App />);
    expect(screen.queryByText('local.jpeg')).not.toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira')).toBeVisible();
  });
});

import { PDFDocument, PDFString, StandardFonts, rgb } from 'pdf-lib';
import type { PDFFont } from 'pdf-lib';
import { publicLookupUrl } from './consultation-link';
import { explorerUrl, validRecord } from './memo-record';
import { comparisonText } from './verification-result';
import type { VerificationResult } from './verification-result';

/** Only whitelisted public fields are rendered. No File, file name, image or document bytes. */
export async function createVerificationReport(result: VerificationResult): Promise<Uint8Array> {
  if (!result || result.status !== 'confirmed' || !validRecord(result.record) ||
      !Object.hasOwn(comparisonText, result.comparison) || !Number.isFinite(Date.parse(result.checkedAt))) {
    throw new Error('Faça uma consulta confirmada antes de gerar o relatório.');
  }
  const pdf = await PDFDocument.create();
  pdf.setTitle('PropertyChain — Relatório de verificação na Devnet');
  pdf.setAuthor('PropertyChain');
  pdf.setSubject('Resultado de consulta de teste; sem valor legal');
  pdf.setCreator('PropertyChain — geração local');
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const page = pdf.addPage([595.28, 841.89]);
  const margin = 44, width = 507.28;
  const green = rgb(.13, .30, .24), ink = rgb(.14, .20, .17), muted = rgb(.36, .41, .38);
  let y = 795;

  function lines(text: string, font: PDFFont, size: number) {
    const output: string[] = [];
    let line = '';
    for (const char of text) {
      if (font.widthOfTextAtSize(line + char, size) > width) {
        const space = line.lastIndexOf(' ');
        if (space > line.length / 2) { output.push(line.slice(0, space)); line = line.slice(space + 1); }
        else { output.push(line); line = ''; }
      }
      line += char;
    }
    if (line) output.push(line);
    return output;
  }
  function text(value: string, font = body, size = 11, color = ink, leading = 15) {
    for (const line of lines(value, font, size)) {
      page.drawText(line, { x: margin, y, size, font, color }); y -= leading;
    }
  }
  function field(label: string, value: string, font = body, size = 11) {
    text(label.toUpperCase(), bold, 8.5, muted, 13);
    text(value, font, size); y -= 12;
  }
  function link(label: string, uri: string) {
    const top = y;
    text(label, bold, 10.5, green);
    text(uri, mono, 8.1, muted, 12);
    const annotation = pdf.context.obj({
      Type: 'Annot', Subtype: 'Link', Rect: [margin, y + 3, margin + width, top + 11],
      Border: [0, 0, 0], A: { Type: 'Action', S: 'URI', URI: PDFString.of(uri) },
    });
    page.node.addAnnot(pdf.context.register(annotation));
    y -= 12;
  }

  text('PROPERTYCHAIN', bold, 11, green, 24);
  text('Relatório de verificação', bold, 23, green, 30);
  text('Solana Devnet | Rede de testes', body, 11, muted, 25);
  page.drawLine({ start: { x: margin, y: y + 10 }, end: { x: 551.28, y: y + 10 }, thickness: 1, color: green });
  text('SEM VALOR LEGAL — não é certidão de registro de imóveis.', bold, 10, ink); y -= 14;
  field('Registro na rede', 'Registro confirmado na Solana Devnet.');
  field('Comparação do arquivo', comparisonText[result.comparison]);
  field('SHA-256 registrado', result.record.hash, mono, 10);
  field('Identificação pública da transação', result.record.signature, mono, 9);
  const checkedAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', timeStyle: 'medium', timeZone: 'UTC',
  }).format(new Date(result.checkedAt));
  field('Data/hora da consulta — relógio do aparelho', `${checkedAt} UTC`);
  link('Abrir consulta no PropertyChain', publicLookupUrl(result.record.signature));
  link('Ver transação no explorador Devnet', explorerUrl(result.record.signature));
  y -= 3;
  text('Nenhum cartório real analisou este documento. O cartório e o histórico da demonstração são fictícios.', body, 10, muted, 14); y -= 9;
  text('O registro do hash não comprova autenticidade do documento, identidade do titular ou propriedade do imóvel. O relatório descreve a consulta realizada, não uma nova leitura da rede ao abrir este PDF.', body, 10, muted, 14);
  page.drawText('Gerado neste dispositivo, sem anexar o arquivo original. Página 1 de 1.', {
    x: margin, y: 35, font: body, size: 8.5, color: muted,
  });
  // No embedded files, external fonts, images or additional network requests.
  if (y < 60) throw new Error('Não foi possível montar o relatório.');
  return pdf.save();
}

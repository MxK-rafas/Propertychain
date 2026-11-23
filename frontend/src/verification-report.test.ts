// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PDFArray, PDFDocument, PDFName, PDFRawStream, PDFDict, PDFString, StandardFonts, decodePDFRawStream } from 'pdf-lib';
import { createVerificationReport } from './verification-report';
import { comparisonText } from './verification-result';
import type { VerificationResult } from './verification-result';
import { publicLookupUrl } from './consultation-link';
import { explorerUrl } from './memo-record';

const result: VerificationResult = {
  status: 'confirmed', comparison: 'none', checkedAt: '2026-11-23T15:00:00.000Z', elapsedMs: 500,
  record: { hash: 'a'.repeat(64), payer: '1'.repeat(32), signature: '3qbZwzqBuqoyyJHT8yPMqZjJ4tFKRsDUBHnWxznw7iH5XBCQhzp84HnWFGmYmiDdMwPzGJEXsuDTvm2E6UoXYU7m' },
};
describe('PDF do resultado confirmado', () => {
  it.each(['none', 'match', 'different'] as const)('gera um PDF legível e links corretos para %s', async comparison => {
    const pdf = await PDFDocument.load(await createVerificationReport({ ...result, comparison }));
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getTitle()).toContain('Relatório de verificação');
    const page = pdf.getPage(0);
    const streams = page.node.lookup(PDFName.of('Contents'), PDFArray);
    const text = Array.from({ length: streams.size() }, (_, i) => new TextDecoder().decode(decodePDFRawStream(streams.lookup(i, PDFRawStream)).decode())).join('');
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const mono = await pdf.embedFont(StandardFonts.Courier);
    expect(text).toContain(font.encodeText(comparisonText[comparison]).toString());
    expect(text).toContain(mono.encodeText(result.record.hash).toString());
    expect(text).toContain(mono.encodeText(result.record.signature).toString());
    expect(text).toContain(font.encodeText('23/11/2026, 15:00:00 UTC').toString());
    const annotations = page.node.lookup(PDFName.of('Annots'), PDFArray);
    const urls = Array.from({ length: annotations.size() }, (_, i) => annotations.lookup(i, PDFDict).lookup(PDFName.of('A'), PDFDict).lookup(PDFName.of('URI'), PDFString).decodeText());
    expect(urls).toEqual([publicLookupUrl(result.record.signature), explorerUrl(result.record.signature)]);
    expect(pdf.catalog.has(PDFName.of('Names'))).toBe(false);
  });

  it.each([
    { ...result, status: 'missing' }, { ...result, status: 'pending' },
    { ...result, status: 'invalid' }, { ...result, checkedAt: 'inválido' },
    { ...result, comparison: 'approved' }, { ...result, record: { ...result.record, hash: 'inválido' } },
  ])('não gera sucesso para estado sem confirmação ou incompleto', async input => {
    await expect(createVerificationReport(input as VerificationResult)).rejects.toThrow('consulta confirmada');
  });

  it('ignora conteúdo privado extra e não incorpora arquivos', async () => {
    const bytes = await createVerificationReport({ ...result, fileName: 'SEGREDO_ORIGINAL.pdf', content: 'CONTEUDO_PRIVADO', titular: 'TITULAR_PRIVADO' } as VerificationResult);
    const pdf = await PDFDocument.load(bytes);
    const streams = pdf.getPage(0).node.lookup(PDFName.of('Contents'), PDFArray);
    const text = new TextDecoder().decode(decodePDFRawStream(streams.lookup(0, PDFRawStream)).decode());
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    for (const privateText of ['SEGREDO_ORIGINAL.pdf', 'CONTEUDO_PRIVADO', 'TITULAR_PRIVADO']) expect(text).not.toContain(font.encodeText(privateText).toString());
    expect(pdf.catalog.has(PDFName.of('Names'))).toBe(false);
  });
});

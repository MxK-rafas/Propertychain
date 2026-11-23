import type { MemoLookup } from './memo';

export type VerificationResult = Extract<MemoLookup, { status: 'confirmed' }> & {
  comparison: 'none' | 'match' | 'different';
  checkedAt: string;
};

export const comparisonText = {
  none: 'Arquivo não comparado. Nenhum arquivo foi selecionado.',
  match: 'A impressão digital do arquivo coincide com a do registro.',
  different: 'A impressão digital do arquivo é diferente da que consta no registro.',
} as const;

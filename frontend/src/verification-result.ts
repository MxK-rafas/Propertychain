import type { MemoLookup } from './memo';

export type VerificationResult = Extract<MemoLookup, { status: 'confirmed' }> & {
  comparison: 'none' | 'match' | 'different';
  checkedAt: string;
};

export const comparisonText = {
  none: 'Nenhum arquivo foi selecionado para comparar.',
  match: 'Esta cópia é igual ao arquivo registrado.',
  different: 'Esta cópia é diferente do arquivo registrado.',
} as const;

export const comparisonTitle = {
  none: 'Arquivo não comparado', match: 'Mesmo arquivo', different: 'Arquivo diferente',
} as const;

/** Public diagnostics only: never display RPC bodies, wallet payloads or file contents. */
export class MemoStageError extends Error {
  constructor(public readonly diagnostic: string, message: string, cause: unknown) {
    super(message, { cause });
    this.name = 'MemoStageError';
  }
}

export async function memoStage<T>(diagnostic: string, message: string, work: () => Promise<T>): Promise<T> {
  try { return await work(); }
  catch (cause) {
    if ((cause as { code?: number })?.code === 4001) throw cause;
    throw new MemoStageError(diagnostic, message, cause);
  }
}

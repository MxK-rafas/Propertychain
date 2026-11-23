import { describe, expect, it } from 'vitest';
import { OFFICIAL_APP_URL, lookupFragment, publicLookupUrl, transactionFromReference } from './consultation-link';

const tx = '3qbZwzqBuqoyyJHT8yPMqZjJ4tFKRsDUBHnWxznw7iH5XBCQhzp84HnWFGmYmiDdMwPzGJEXsuDTvm2E6UoXYU7m';
describe('Referências da consulta, sem abrir endereços colados', () => {
  it.each([
    tx, `  ${tx}\n`, publicLookupUrl(tx),
    OFFICIAL_APP_URL + lookupFragment(tx, 'resultado'),
    `https://propertychain-9g0563usr-rafael-vinicius.vercel.app/${lookupFragment(tx)}`,
    `https://explorer.solana.com/tx/${tx}?cluster=devnet`,
  ])('extrai a transação de %s', input => {
    expect(transactionFromReference(input)).toBe(tx);
  });
  it.each([
    '', 'a'.repeat(64).replaceAll('a', '0'), 'assinatura cortada',
    `https://site-desconhecido.example/${lookupFragment(tx)}`,
    `https://explorer.solana.com/tx/${tx}?cluster=mainnet-beta`,
    `http://propertychain-theta.vercel.app/${lookupFragment(tx)}`,
    `${publicLookupUrl(tx)}&tx=${tx}`,
    `https://usuario:senha@propertychain-theta.vercel.app/${lookupFragment(tx)}`,
    'javascript:alert(1)',
  ])('recusa referência incompleta ou de outra origem/rede: %s', input => {
    expect(transactionFromReference(input)).toBeNull();
  });
  it('gera compartilhamento sempre no domínio público oficial', () => {
    expect(publicLookupUrl(tx)).toBe('https://propertychain-theta.vercel.app/' + lookupFragment(tx));
  });
});

# ADR 0007 · React, TypeScript, Vite e ethers v6

**Status:** Proposto

## Contexto
É preciso um app web simples, com leitura sem carteira e escrita via MetaMask.

## Decisão
React + TypeScript + Vite no frontend, ethers v6 para leitura (provedor somente leitura) e escrita (carteira conectada).

## Consequências
- Stack comum, com bastante material de apoio.
- Duas formas de provedor (leitura pública e carteira), organizadas em `lib/provider` (#37).
- Deploy estático simples (Vercel ou GitHub Pages, #4).

# Roadmap do PropertyChain

O escopo ativo é [SPEC.md](SPEC.md). Este roadmap substitui o plano de Sepolia/contrato próprio da fase anterior. A implementação funcional ainda não foi iniciada; documentação e referência visual não contam como integração Solana entregue.

## Agora — seis etapas com pausa para o autor testar

| Etapa | Entrega | Pronto quando |
|---|---|---|
| 1 | Modelo fictício, revisão do escopo e plano | Autor revisa o PDF e aprova o plano antes do código |
| 2 | Frontend React/TypeScript/Vite com quatro telas | Fluxo legível no celular; arquivo local não causa upload; dados fictícios não aparecem como extraídos de foto real; build e verificações passam |
| 3 | Phantom e SHA-256 local | Uma carteira Devnet, cancelamento tratado e hash reproduzível pelos mesmos bytes |
| 4 | Registro Memo na Solana Devnet | Link no explorador, transação confirmada sem erro e hash correto; cartório continua simulado |
| 5 | Consulta em outro celular e medição | Sem carteira; arquivo idêntico coincide e diferente não; dez medições frente à meta de 1–5 segundos para leitura de registro confirmado |
| 6 | Publicação Vercel e teste final | HTTPS e consulta em dois aparelhos; nenhum documento real no código, build ou logs |

Não avançar automaticamente entre etapas. Assinatura humana e confirmação da transação não fazem parte da meta de leitura de 1–5 segundos. Medir e informar esses tempos à parte.

## Depois

- Relatórios de verificação.
- Taxa por documento/consulta e planos mensais.
- Piloto com cartórios parceiros.
- Armazenamento seguro para documentos reais e preparação jurídica/LGPD para essa operação.

## Um dia

- Licenciamento da plataforma para cartórios.

## Decisões de escopo

- Antecipados por pedido do autor: registro real de hash na Devnet e seleção local de foto real de teste.
- Fora deste MVP: programa/contrato próprio, painel de validador, aprovação de cartório na blockchain, revogação, atestação de titular, busca por matrícula/salt e QR code.
- O código Solidity existente e seus testes ficam preservados como legado. Não precisam ser migrados para Solana para entregar este MVP.
- [ISSUES.md](ISSUES.md) reconcilia os 41 IDs originais com o escopo atual, sem apresentar tarefas antigas como requisitos extras.

# React Dash

Dashboard em React usado como base de estudo para visualizacao de informacoes, rotas, tabelas e componentes de painel administrativo.

## Stack

- React 18
- TypeScript
- Vite
- Vitest
- MUI
- Recharts
- Sass

## Scripts

No diretorio do projeto, voce pode executar:

### `npm start`

Inicia o ambiente de desenvolvimento com Vite.

Por padrao, a aplicacao fica disponivel em `http://localhost:5173`.

### `npm run build`

Gera o build de producao na pasta `dist/`.

### `npm test`

Executa a suite de testes com Vitest.

### `npm run typecheck`

Executa a verificacao de tipos com TypeScript sem gerar arquivos.

### `npm run preview`

Sobe localmente o build gerado para validacao rapida.

## Estrutura

- `src/components`: componentes reutilizaveis do dashboard
- `src/pages`: paginas principais
- `src/context`: estado global simples para tema
- `src/types.ts`: tipos compartilhados
- `docs/analytics-dashboard-backlog.md`: backlog e contrato de produto para
  transformar o app em dashboard analitico do Sales Event

## Proximos passos sugeridos

- Seguir `docs/analytics-dashboard-backlog.md` para evoluir o dashboard
  analitico por etapas.
- Comecar por fixture local e transformadores puros antes da API real.
- Conectar o endpoint `GET /analytics/export` do `sales-event-project` quando
  a dependencia cross-repo estiver pronta.

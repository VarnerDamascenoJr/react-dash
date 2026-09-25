# React Dash

Dashboard analitico em React para visualizar e exportar dados operacionais do
`sales-event-project`.

O app apresenta o contrato `sales-analytics-export.v1` como uma experiencia de
portfolio: KPIs, series por janela, distribuicao de eventos, tabela analitica e
exportacoes JSON, CSV e PNG. Ele funciona primeiro com fixture local e tambem
esta preparado para consumir a API local do Sales quando o endpoint
`GET /analytics/export` estiver disponivel.

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

## Configuracao local

Copie `.env.example` para `.env.local` quando quiser alterar os valores padrao
da demo.

Variaveis disponiveis:

- `VITE_DEMO_LOGIN_EMAIL`: email aceito pelo login demo.
- `VITE_DEMO_LOGIN_PASSWORD`: senha aceita pelo login demo.
- `VITE_DEMO_USER_NAME`: nome exibido no shell autenticado.
- `VITE_DEMO_USER_ROLE`: papel exibido no shell autenticado.
- `VITE_DEMO_USER_AVATAR`: avatar exibido no shell autenticado.
- `VITE_SALES_API_BASE_URL`: base da API do Sales. O default recomendado e
  `/api`, usando o proxy do Vite para `http://localhost:8080`.

Valores reais de API key nao devem ser gravados em arquivos versionados. Informe
`X-API-Key` na tela do dashboard quando for carregar a API local.

## Fluxo com fixture

1. Instale dependencias:

```bash
npm ci
```

2. Inicie o app:

```bash
npm start
```

3. Abra `http://localhost:5173`.
4. Entre com as credenciais demo configuradas em `.env.example`.
5. A tela inicial ja carrega a fixture local
   `src/analytics/fixtures/sales-analytics-export.v1.json`.
6. Valide KPIs, graficos, tabela e exportacoes JSON, CSV e PNG.

## Fluxo com API local do Sales

Dependencia esperada no `sales-event-project`:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

Contrato esperado:

- autenticar via header `X-API-Key`;
- permitir roles `SUPPORT` e `ADMIN`;
- retornar `schemaVersion: sales-analytics-export.v1`;
- preservar eventos, janelas, funis e sobrevivencia do export analitico.

Execucao local recomendada:

1. Suba a stack do `sales-event-project`, incluindo API, banco e workers.
2. Gere eventos de venda, pagamento, email/ticket e check-in.
3. Inicie o `react-dash` com `VITE_SALES_API_BASE_URL=/api`.
4. Informe uma API key valida no campo `API key`.
5. Clique em `Carregar API`.
6. Se a API falhar ou ainda nao existir, o dashboard volta para a fixture local
   e mostra a mensagem de fallback.

## Validacao

Antes de abrir PR ou usar a demo em portfolio:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

## Estrutura

- `src/components`: componentes reutilizaveis do dashboard
- `src/pages`: paginas principais
- `src/context`: estado global simples para tema
- `src/types.ts`: tipos compartilhados
- `src/analytics`: tipos, fixture, client, transformadores e exportadores do
  contrato `sales-analytics-export.v1`
- `docs/analytics-dashboard-backlog.md`: backlog e contrato de produto para
  transformar o app em dashboard analitico do Sales Event
- `docs/demo-checklist.md`: checklist de smoke para demo local e portfolio

## Proximos passos sugeridos

- Seguir `docs/demo-checklist.md` antes de gravar ou apresentar a demo.
- Implementar o endpoint `GET /analytics/export` no `sales-event-project` para
  substituir o fallback por dados reais.
- Manter a fixture local como caminho reproduzivel para testes e handoff.

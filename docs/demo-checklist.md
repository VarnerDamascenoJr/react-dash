# Demo Checklist

Este checklist prepara o `react-dash` para demonstracao local e handoff do
portfolio. Ele cobre o caminho reproduzivel com fixture e o caminho integrado
com a API local do `sales-event-project`.

## Objetivo Da Demo

Mostrar que eventos operacionais do Sales podem virar um dataset analitico
exploravel e exportavel:

- KPIs de coleta e producao;
- series por janela;
- distribuicao de tipos de evento;
- tabela de eventos brutos;
- exportacoes JSON, CSV e PNG;
- fallback local quando a API ainda nao esta disponivel.

## Pre-check

No `react-dash`:

```bash
git status --short --branch
npm ci
npm test
npm run typecheck
npm run build
git diff --check
```

Resultado esperado:

- working tree limpo antes da demo;
- testes passando;
- typecheck passando;
- build passando;
- apenas o warning conhecido de bundle grande pode aparecer no build.

## Demo Com Fixture

1. Inicie o app:

```bash
npm start
```

2. Abra:

```text
http://localhost:5173
```

3. Faca login com as credenciais demo documentadas em `.env.example`.
4. Confirme que a home mostra `Fixture local` como fonte.
5. Verifique:
   - KPIs de eventos, vendas, receita, tickets e check-ins;
   - grafico de eventos por janela;
   - grafico de tipos de evento;
   - blocos de funil e sobrevivencia com estado vazio quando ausentes;
   - tabela de eventos brutos.
6. Exporte:
   - `JSON bruto`;
   - `CSV eventos`;
   - `CSV janelas`;
   - `PNG janelas`;
   - `PNG tipos`.

## Demo Com API Local Do Sales

Dependencia:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

Passos:

1. No `sales-event-project`, suba a stack local.
2. Gere pelo menos uma venda e eventos relacionados:
   - venda aceita;
   - pagamento processado;
   - ticket/email;
   - check-in quando possivel.
3. Garanta que a API do Sales esteja em:

```text
http://localhost:8080
```

4. No `react-dash`, use:

```env
VITE_SALES_API_BASE_URL=/api
```

5. Inicie o app:

```bash
npm start
```

6. Informe no dashboard:
   - `Base URL`: `/api` com proxy Vite ou a URL absoluta da API;
   - `Sales event`: UUID do evento local;
   - `Start`: limite inferior RFC3339, quando desejar filtrar periodo;
   - `End`: limite superior RFC3339, quando desejar filtrar periodo;
   - `Limite`: limite de eventos;
   - `API key`: chave com role `SUPPORT` ou `ADMIN`.
7. Clique em `Carregar API`.
8. Confirme que a fonte muda para `API local`.
9. Repita as exportacoes JSON, CSV e PNG.

O dashboard pode lembrar `Base URL`, `Sales event`, `Start`, `End` e `Limite`
no navegador. A `API key` nao deve ser persistida.

## Fallback Esperado

Quando a API nao existe, esta fora do ar ou retorna erro:

- o dashboard deve continuar renderizando a fixture local;
- a fonte deve permanecer ou voltar para `Fixture local`;
- a mensagem deve explicar a falha de forma legivel;
- nenhuma tela deve quebrar.

## Evidencia Para Portfolio

Durante a revisao ou gravacao:

- capturar a tela inicial com KPIs e graficos;
- guardar um JSON exportado;
- guardar os dois CSVs;
- guardar pelo menos um PNG de grafico;
- registrar se a fonte usada foi `Fixture local` ou `API local`.

## Criterio De Pronto

A demo esta pronta quando:

- o app roda localmente;
- fixture abre sem servicos externos;
- API local funciona quando o endpoint do Sales estiver disponivel;
- exportacoes geram arquivos legiveis;
- comandos de validacao passam;
- um novo agent consegue seguir este documento sem ler o codigo fonte.

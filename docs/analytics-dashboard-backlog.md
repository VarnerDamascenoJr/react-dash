# Backlog React Dash: Dashboard Analitico Do Sales Event

Este documento e o handoff oficial para agents que forem evoluir o
`react-dash` de dashboard administrativo demonstrativo para dashboard analitico
do portfolio. A etapa atual e apenas planejamento documentado; implementacoes de
componentes, clientes HTTP, backend ou exportacoes devem ser feitas em tarefas
separadas.

## Contexto

O portfolio usa tres projetos como laboratorio aplicado para estatistica,
confiabilidade e decisao operacional:

- `sales-event-project`: fonte observacional de vendas, pagamentos, outbox,
  emails, tickets e check-ins.
- `operational-observability-platform`: laboratorio de observabilidade,
  SLOs, burn rate, series temporais e investigacao operacional.
- `OptiFlow`: simulacao, comparacao de estrategias, incerteza e decisao sob
  risco.

O `sales-event-project` ja possui um contrato analitico versionado,
`sales-analytics-export.v1`, gerado hoje pelo comando `cmd/analytics-export`.
Esse documento inclui eventos individuais, janelas agregadas, funis com
incerteza e analises de sobrevivencia. O `react-dash` deve consumir esse
contrato para apresentar a coleta/producao operacional em uma interface
interativa.

## Objetivo

Transformar o `react-dash` em uma camada analitica para visualizar e exportar
dados reais ou reproduziveis do `sales-event-project`.

O dashboard deve permitir que uma pessoa acompanhe:

- volume de eventos coletados;
- vendas aceitas, pendentes, concluidas e falhas;
- pagamentos e receita observada;
- tickets emitidos e check-ins realizados;
- comportamento de outbox, email e retries;
- funil de conversao com incerteza;
- tempo ate pagamento, email e check-in;
- eventos brutos e janelas agregadas exportaveis.

## Estado Atual

O `react-dash` atualmente e um SPA frontend-only com React 18, TypeScript,
Vite, MUI, MUI Data Grid, Recharts e Sass.

Caracteristicas atuais:

- rotas protegidas com autenticacao demo client-side;
- estado de tema claro/escuro via React Context;
- layout de dashboard reutilizavel com sidebar e navbar;
- paginas genericas para `users` e `products`;
- widgets e graficos com dados mockados;
- nenhuma integracao real com backend;
- nenhuma persistencia server-side;
- testes e scripts existentes: `npm test`, `npm run typecheck`,
  `npm run build`.

Riscos atuais:

- a autenticacao e apenas demonstrativa e pode ser alterada no client;
- varias telas ainda usam linguagem generica de administracao;
- dados atuais nao representam regras de negocio reais;
- algumas rotas e componentes ainda assumem entidades como usuario/produto.

## Fora De Escopo Inicial

Nao incluir no primeiro ciclo:

- relatorio PDF;
- autenticacao backend completa no `react-dash`;
- alteracao de banco de dados;
- substituicao total do design system;
- ingestao direta de Prometheus, Loki, Tempo ou Grafana;
- escrita de dados operacionais pelo dashboard;
- conclusoes estatisticas automaticas alem das metricas ja presentes no
  contrato analitico.

## Principios De Implementacao

- O `react-dash` deve funcionar primeiro com fixture local.
- A API real deve ser adicionada como caminho incremental, sem quebrar a
  fixture.
- Transformacoes de dados devem ser puras e testaveis.
- Componentes devem receber dados ja preparados, evitando logica analitica
  espalhada pela UI.
- Nenhum valor mockado deve ser apresentado como dado real.
- A UI deve preservar o layout existente quando isso reduzir risco, mas deve
  trocar a linguagem visual e textual para o dominio de operacoes do Sales.

## Contrato De Produto RD0

### Publico-alvo

O dashboard e voltado para uma pessoa revisando o portfolio tecnico e
estatistico. Ele deve mostrar, sem exigir leitura do backend, como os eventos
operacionais do `sales-event-project` viram dados analisaveis.

Publicos secundarios:

- agents futuros que precisam continuar a implementacao;
- avaliadores do portfolio que querem ver coleta, funil, incerteza e
  exportabilidade;
- o proprio autor do portfolio durante demos locais.

### Fonte De Verdade Dos Dados

A fonte de verdade para o dashboard analitico e o contrato
`sales-analytics-export.v1`.

Prioridade de consumo:

1. fixture local versionada no `react-dash`;
2. endpoint local `GET /analytics/export` no `sales-event-project`, quando
   existir;
3. nenhum outro backend ou fonte observacional deve ser introduzido no ciclo
   inicial.

### O Que O Dashboard Deve Responder

- O que foi coletado no periodo analisado?
- Quais etapas do fluxo de venda estao produzindo eventos?
- Onde existe perda no funil de venda ate check-in?
- Quanto tempo leva ate pagamento, email e check-in?
- Quais dados podem ser exportados para estudo reproduzivel?

### O Que Nao Deve Responder Ainda

- Previsao futura de demanda.
- Decisao operacional otima.
- Comparacao de estrategias do OptiFlow.
- Investigacao de logs/traces em profundidade.
- Auditoria financeira completa.

## Mapa De Telas Atuais

| Area atual | Destino no dashboard analitico | Decisao |
| --- | --- | --- |
| `/` `Home` | Overview analitico com KPIs, series, funil, sobrevivencia e eventos recentes | Reaproveitar rota e estrutura |
| `/login` | Login demo para proteger a experiencia local | Manter com texto ajustado depois |
| `DashboardLayout` | Shell autenticado do dashboard | Manter |
| `Sidebar` | Navegacao de dominio: Overview, Eventos, Funil, Sobrevivencia, Exportacoes, Configuracao | Reaproveitar e renomear |
| `Navbar` | Busca/acoes globais, tema e status de dados | Reaproveitar |
| `Widget` | Cards de KPI operacional | Reaproveitar conceito, trocar props e dados |
| `Chart` | Graficos Recharts de series temporais e metricas analiticas | Reaproveitar biblioteca, refatorar contrato |
| `Featured` | Resumo visual de funil ou saude da coleta | Reaproveitar se ainda ajudar a leitura |
| `Datatable` | Tabela de eventos analiticos | Reaproveitar MUI Data Grid |
| `Table` | Tabela menor de eventos/janelas recentes | Reaproveitar ou substituir por Data Grid |
| `/users`, `/products` | Nao fazem parte do dominio analitico | Remover ou redirecionar em RD3 |
| `/users/new`, `/products/new` | Criacao generica de entidades mockadas | Remover em RD3 |
| `/users/:userId`, `/products/:productId` | Detalhe generico mockado | Remover ou substituir por drilldown futuro |

## Menu Final Planejado

- Overview: resumo operacional e estatistico do periodo.
- Eventos: tabela exploravel de eventos brutos.
- Funil: conversoes e incerteza por etapa.
- Sobrevivencia: tempo ate pagamento, email e check-in.
- Exportacoes: JSON, CSV e PNG.
- Configuracao: API base, API key em memoria/tela, filtros padrao e fonte
  fixture/API.

No primeiro ciclo, essas entradas podem apontar para secoes dentro da mesma
pagina ou para rotas dedicadas. A decisao tecnica deve favorecer a menor
mudanca segura no `react-dash`.

## Backlog

### RD0 - Baseline E Contrato Do Produto

Objetivo: fixar o escopo do dashboard analitico antes de alterar runtime.

Tarefas:

- Manter este arquivo como backlog central do `react-dash`.
- Atualizar a documentacao do projeto quando a implementacao comecar.
- Registrar explicitamente que `react-dash` consome dados analiticos do
  `sales-event-project`.
- Mapear quais telas atuais serao mantidas, removidas ou reaproveitadas.
- Definir nomes finais das secoes do menu:
  - Overview;
  - Eventos;
  - Funil;
  - Sobrevivencia;
  - Exportacoes;
  - Configuracao.

Criterios de aceite:

- O backlog existe em `docs/analytics-dashboard-backlog.md`.
- O escopo deixa claro que a primeira implementacao deve funcionar com fixture.
- A dependencia do endpoint `GET /analytics/export` esta documentada.
- O contrato de produto, o mapa de telas e o menu final estao documentados.

Validacoes:

- `git diff --check`.
- Confirmar que somente documentacao foi alterada nesta etapa.

Status:

- Concluido quando este arquivo contiver o contrato de produto, mapa de telas,
  menu final e dependencia cross-repo.

### RD1 - Modelo TypeScript, Fixture E Transformadores Puros

Objetivo: criar a base de dados tipada e testavel antes da UI real.

Tarefas:

- Adicionar tipos TypeScript para o contrato `sales-analytics-export.v1`.
- Incluir tipos principais:
  - `SalesAnalyticsDocument`;
  - `SalesAnalyticsEvent`;
  - `WindowAggregate`;
  - `AggregateCounts`;
  - `FunnelSegment`;
  - `SurvivalAnalysis`;
  - tipos auxiliares para intervalos, probabilidades e tabelas.
- Criar fixture local baseada em
  `sales-event-project/tests/fixtures/sales-analytics-export.v1.json`.
- Criar transformadores puros para:
  - KPIs principais;
  - series temporais por janela;
  - funil de conversao;
  - resumo de sobrevivencia;
  - linhas da tabela de eventos;
  - dados para exportacao CSV.
- Garantir que os transformadores aceitam dataset vazio sem quebrar a UI.

Criterios de aceite:

- A fixture local permite desenvolver sem API real.
- Transformadores nao dependem de React.
- Transformadores retornam estruturas estaveis para componentes.
- Datasets vazios retornam zeros, listas vazias e estados explicitos.

Validacoes:

- Testes unitarios dos transformadores.
- `npm test`.
- `npm run typecheck`.

Status:

- Concluido com o modulo `src/analytics`, fixture local
  `sales-analytics-export.v1`, tipos do contrato, transformadores puros e
  testes unitarios cobrindo fixture e dataset vazio.

### RD2 - Integracao Com API Local Do Sales

Objetivo: permitir que o dashboard busque dados reais quando o backend estiver
disponivel.

Tarefas no `react-dash`:

- Adicionar `VITE_SALES_API_BASE_URL` ao ambiente, com default `/api`.
- Configurar proxy do Vite para encaminhar `/api` para
  `http://localhost:8080`.
- Criar client HTTP para:
  `GET /analytics/export?salesEventId=&start=&end=&limit=`.
- Enviar `X-API-Key` informado pelo usuario em tela ou configuracao local.
- Persistir apenas configuracoes nao secretas de filtro; evitar salvar API key
  em arquivo versionado.
- Criar estados de carregamento, sucesso, erro e fallback para fixture.
- Mostrar mensagens legiveis para:
  - `400`: filtros invalidos;
  - `401`: API key ausente;
  - `403`: role sem permissao;
  - falha de rede;
  - resposta fora do schema esperado.

Dependencia no `sales-event-project`:

- Expor `GET /analytics/export`.
- Proteger com `X-API-Key`.
- Permitir roles `SUPPORT` e `ADMIN`.
- Reutilizar o contrato `sales-analytics-export.v1`.

Criterios de aceite:

- O dashboard carrega com fixture mesmo sem API.
- Quando a API existir, o dashboard consegue buscar dados reais.
- Erros de API nao quebram a aplicacao.

Validacoes:

- Testes do client com mocks de sucesso e erro.
- `npm test`.
- `npm run typecheck`.
- Smoke manual com API local quando o endpoint existir.

Status:

- Base tecnica implementada com configuracao `VITE_SALES_API_BASE_URL`, proxy
  Vite `/api`, client HTTP testavel para `GET /analytics/export`, envio de
  `X-API-Key`, validacao minima do schema e fallback para fixture local.
- Wiring visual de filtros, API key em tela e estados de carregamento/erro deve
  ser conectado durante o redesenho da UI.

### RD3 - Redesenho Do Dashboard Principal

Objetivo: trocar a experiencia generica por uma visao operacional do Sales.

Tarefas:

- Redesenhar a `Home` como Overview analitico.
- Remover textos e metricas genericas como users, orders, revenue mockado e
  products.
- Criar KPIs:
  - eventos coletados;
  - vendas concluidas;
  - receita observada;
  - tickets emitidos;
  - check-ins realizados.
- Criar grafico temporal por janela, com default `5m`.
- Criar visualizacao de funil com:
  - etapas;
  - trials;
  - successes;
  - probabilidade de conversao;
  - intervalo de confianca quando disponivel.
- Criar visualizacao de sobrevivencia:
  - tempo ate pagamento;
  - tempo ate email;
  - tempo ate check-in;
  - observacoes, eventos, censuras e percentis.
- Criar tabela de eventos com MUI Data Grid:
  - timestamp;
  - tipo;
  - sales event;
  - sale id;
  - status;
  - provider;
  - ticket type;
  - quantidade;
  - valor.
- Atualizar Sidebar para linguagem de dominio.
- Manter tema claro/escuro funcionando.

Criterios de aceite:

- Nenhum widget principal usa dados hardcoded de usuarios ou produtos.
- A tela inicial funciona com fixture e com payload da API.
- Layout se mantem utilizavel em desktop e mobile.
- Estados vazio, carregando e erro estao representados.

Validacoes:

- Testes de renderizacao para Overview com fixture.
- Testes para dataset vazio.
- `npm test`.
- `npm run typecheck`.
- `npm run build`.

### RD4 - Exportacoes JSON, CSV E PNG

Objetivo: permitir que os dados e graficos sejam usados em estudos,
apresentacoes e evidencias do portfolio.

Tarefas:

- Exportar JSON bruto recebido da fixture/API.
- Exportar CSV de eventos.
- Exportar CSV de janelas agregadas.
- Exportar PNG por grafico principal.
- Nomear arquivos com timestamp e filtro ativo.
- Usar nomes previsiveis, por exemplo:
  - `sales-events-2026-09-24-events.csv`;
  - `sales-events-2026-09-24-windows.csv`;
  - `sales-events-2026-09-24-export.json`;
  - `sales-events-2026-09-24-funnel.png`.
- Garantir que exportacoes funcionam tanto com fixture quanto com API real.

Criterios de aceite:

- Export JSON preserva o documento original.
- CSV de eventos inclui uma linha por evento analitico.
- CSV de janelas inclui uma linha por janela agregada.
- PNG exporta o grafico visivel sem exigir backend.
- Quando nao ha dados, a UI evita exportacoes vazias sem contexto.

Validacoes:

- Testes unitarios para serializacao CSV.
- Smoke manual de download JSON, CSV e PNG.
- `npm test`.
- `npm run typecheck`.
- `npm run build`.

### RD5 - Demo Local E Checklist De Portfolio

Objetivo: deixar o projeto pronto para apresentacao e handoff.

Tarefas:

- Atualizar `README.md` com:
  - objetivo do dashboard;
  - variaveis de ambiente;
  - login demo;
  - fluxo com fixture;
  - fluxo com API local do Sales;
  - comandos de validacao.
- Documentar a dependencia do endpoint `GET /analytics/export`.
- Criar checklist de smoke:
  - subir stack do Sales;
  - gerar eventos de venda/pagamento/check-in;
  - abrir `react-dash`;
  - informar API key;
  - carregar dados;
  - filtrar por evento e janela;
  - exportar JSON;
  - exportar CSV;
  - exportar PNG.
- Atualizar docs existentes se ficarem desatualizadas.

Criterios de aceite:

- Um agent novo consegue rodar a demo seguindo a documentacao.
- O dashboard pode ser apresentado sem explicar detalhes internos do codigo.
- A fixture continua disponivel como caminho reproduzivel.

Validacoes:

- `npm test`.
- `npm run typecheck`.
- `npm run build`.
- Smoke manual documentado.

## Dependencia Cross-Repo

O `react-dash` depende de um endpoint futuro no `sales-event-project` para
buscar dados reais:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

Requisitos esperados:

- autenticar via header `X-API-Key`;
- permitir roles `SUPPORT` e `ADMIN`;
- retornar `schemaVersion: sales-analytics-export.v1`;
- aceitar filtros opcionais:
  - `salesEventId`;
  - `start` em RFC3339;
  - `end` em RFC3339;
  - `limit`;
- preservar o contrato ja usado pelo comando `cmd/analytics-export`.

Enquanto esse endpoint nao existir, o `react-dash` deve operar com fixture
local. A fixture nao e um detalhe temporario: ela e parte da estrategia de
reprodutibilidade do portfolio.

## Ordem Recomendada

1. Concluir RD0 com este backlog.
2. Implementar RD1 para criar tipos, fixture e transformadores testaveis.
3. Redesenhar a UI com base na fixture em RD3.
4. Implementar RD4 para exportacoes usando a mesma fixture.
5. Implementar a dependencia cross-repo no `sales-event-project`.
6. Conectar API real no RD2.
7. Fechar RD5 com README, checklist e validacoes finais.

A ordem coloca a fixture antes da API para reduzir acoplamento e permitir que
agents trabalhem no frontend mesmo se o backend ainda nao estiver pronto.

## Validacoes Gerais

Para alteracoes somente documentais:

```bash
git diff --check
```

Para alteracoes de codigo no `react-dash`:

```bash
npm test
npm run typecheck
npm run build
```

Para alteracoes no `sales-event-project`:

```bash
go test ./...
```

Validacoes manuais esperadas ao final do ciclo:

- dashboard abre com fixture sem API;
- dashboard carrega dados da API quando o Sales esta localmente disponivel;
- filtros alteram a consulta ou a visualizacao;
- exportacoes JSON, CSV e PNG geram arquivos legiveis;
- erro de API key ausente ou invalida e apresentado sem quebrar a tela.

## Criterio Final De Pronto

O ciclo do dashboard analitico esta pronto quando:

- `react-dash` nao depende mais de dados mockados de usuarios/produtos na tela
  principal;
- existe fixture local do contrato `sales-analytics-export.v1`;
- dados reais podem ser buscados do `sales-event-project`;
- KPIs, series, funil, sobrevivencia e tabela de eventos aparecem na UI;
- JSON, CSV e PNG podem ser exportados;
- README e docs permitem que outro agent rode a demo;
- validacoes automatizadas passam;
- o comportamento principal e reproduzivel sem servicos externos alem da stack
  local do portfolio.

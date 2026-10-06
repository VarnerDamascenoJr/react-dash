# Backlog React Dash: Dashboard Analitico Do Sales Event

Este documento e o handoff oficial para agents que forem evoluir o
`react-dash` de dashboard administrativo demonstrativo para dashboard analitico
do portfolio. A implementacao principal do dashboard analitico ja esta presente
no `react-dash`: fixture versionada, tipos, transformadores, client HTTP,
overview operacional, exportacoes e documentacao de demo. A etapa atual e
refinamento de UI/documentacao e preparacao de demo integrada.

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
Vite, MUI, MUI Data Grid, Recharts e Sass. A tela principal ja foi convertida
para um overview analitico do Sales Event e opera com fixture local ou com a API
local do `sales-event-project`.

Caracteristicas atuais:

- rotas protegidas com autenticacao demo client-side;
- estado de tema claro/escuro via React Context;
- layout de dashboard reutilizavel com sidebar e navbar em MUI;
- `Home` redesenhada como overview analitico;
- fixture local versionada do contrato `sales-analytics-export.v1`;
- modulo `src/analytics` com tipos, client HTTP, transformadores puros e
  exportadores;
- integracao opcional com `GET /analytics/export` via `VITE_SALES_API_BASE_URL`
  e header `X-API-Key`;
- fallback para fixture local quando a API falha ou ainda nao esta disponivel;
- exportacoes JSON, CSV e PNG browser-side;
- persistencia apenas de filtros/configuracoes nao secretas em `localStorage`;
- testes e scripts existentes: `npm test`, `npm run typecheck`,
  `npm run build`.

Riscos atuais:

- a autenticacao e apenas demonstrativa e pode ser alterada no client;
- `Home` concentra carregamento, transformacao, persistencia e exportacao;
- a sidebar lista secoes de dominio que ainda nao sao rotas dedicadas;
- componentes legados de users/products/formulario ainda existem no codigo,
  embora tenham sido removidos da navegacao principal;
- o bundle de producao pode emitir warning de chunk grande.

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

Status:

- Concluido com a `Home` redesenhada como overview analitico, KPIs do contrato
  `sales-analytics-export.v1`, graficos por janela/tipo de evento, blocos de
  funil/sobrevivencia tolerantes a dados ausentes, tabela MUI Data Grid de
  eventos e navegacao lateral reorientada para o dominio do Sales.
- Rotas genericas de users/products foram removidas da navegacao principal e
  redirecionadas para o Overview.

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

Status:

- Concluido com exportacao de JSON bruto, CSV de eventos, CSV de janelas e PNG
  dos graficos principais da tela. A camada `src/analytics/exporters` cobre
  serializacao CSV, nomes de arquivos deterministas e downloads browser-side.

### RD4.1 - Refatoracao Frontend Com Material UI E Dicionario De Textos

Objetivo: padronizar a camada visual depois da primeira entrega funcional,
reduzindo HTML estrutural manual e facilitando manutencao dos textos.

Tarefas:

- Revisar componentes do dashboard e substituir HTML estrutural por componentes
  MUI quando houver equivalente claro.
- Manter MUI X Data Grid como padrao para tabelas analiticas.
- Consolidar textos por pagina em dicionarios locais ou compartilhados,
  evitando labels soltos nos componentes.
- Revisar responsividade de cards, paineis, formularios, graficos e tabelas.
- Modularizar padroes de painel/grafico para reuso em novas telas de Eventos,
  Funil, Sobrevivencia, Exportacoes e Configuracao.

Criterios de aceite:

- Componentes de UI seguem Material UI de forma consistente.
- Textos da Home analitica ficam centralizados em dicionario.
- Layout mobile e desktop nao apresenta sobreposicao de textos ou controles.
- Mudancas de design nao alteram o contrato analitico nem o client de API.

Validacoes:

- `npm test`.
- `npm run typecheck`.
- `npm run check:style-units`.
- `npm run build`.

Status:

- Em andamento. A Home analitica ja usa dicionario de textos, componentes MUI
  para paineis principais e graficos modularizados. O shell autenticado tambem
  passou a usar componentes MUI em `DashboardLayout`, `Sidebar` e `Navbar`,
  com textos centralizados em dicionario proprio.
- Avanco adicional: paineis analiticos de graficos, insights e tabela passaram
  a compartilhar um componente `AnalyticsPanel`; a Data Grid passou a rolar
  dentro do proprio painel em telas estreitas; e o smoke Playwright valida que a
  pagina nao cria overflow horizontal em desktop e mobile.
- Avanco adicional: os headers e mensagens da tabela de eventos estao
  centralizados no dicionario `homeCopy`, reduzindo labels soltos na UI da Home.
- Avanco adicional: a sidebar passou a navegar para secoes reais da Home por
  ancoras versionadas em codigo (`overview`, `events`, `funnel`, `survival`,
  `windows`, `exports` e `settings`), preservando a rota unica enquanto as telas
  dedicadas ainda nao forem necessarias.
- Avanco adicional: novas mudancas de estilo de frontend passaram a ter
  validacao incremental para evitar introducao de `px`, mantendo `rem` como
  unidade padrao documentada para a camada visual.
- Avanco adicional: `src/pages/home/home.scss` passou a usar `rem` para
  espacamentos, tamanhos, bordas, raios e breakpoints da Home analitica,
  reduzindo a divida visual ativa sem alterar o contrato de dados.
- Avanco adicional: tokens e estruturas globais em `src/index.css` e
  `src/style/dark.scss` tambem passaram a usar `rem`, alinhando raios, sombras,
  hero generico e breakpoint base ao padrao visual do frontend.
- Avanco adicional: `src/pages/login/login.scss` passou a usar `rem` no layout
  de autenticacao demo, cobrindo o primeiro ponto visivel do fluxo protegido.
- Avanco adicional: componentes reutilizaveis e legados em `src/components`
  (`chart`, `datatable`, `featured`, `table` e `widgets`) passaram a usar
  `rem`, reduzindo a divida visual antes de migrar paginas legadas.
- Avanco adicional: paginas legadas em `src/pages` (`list`, `new` e `single`)
  passaram a usar `rem`, eliminando `px` dos estilos de pagina.

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

Status:

- Concluido com README atualizado, checklist de demo em
  `docs/demo-checklist.md`, integracoes documentadas e caminho de fixture/API
  descrito para handoff de portfolio.

## Backlog De Correcoes Descobertas No Ensaio Integrado De 2026-10-06

Este bloco registra problemas reais encontrados ao subir o
`sales-event-project`, carregar o `react-dash` com API local e gerar evidencias
visuais com uma massa grande de operacoes. As evidencias desse ensaio ficam em:

```text
/Users/varnerdamasceno/github-varner/evidence/react-dash-sales-api-simulation-2026-10-06/
```

### CFX1 - Corrigir NaN No Export Analitico Grande Do Sales

Projeto principal: `sales-event-project`.

Problema observado:

- Depois de gerar dezenas de vendas, pagamentos, emails, tickets e check-ins,
  `GET /analytics/export?salesEventId=...&limit=10000` retornou `200 OK` com
  corpo vazio.
- O CLI equivalente `cmd/analytics-export` mostrou o erro real:
  `json: unsupported value: NaN`.
- A causa provavel esta na estatistica de risco de stockout, quando a
  aproximacao Poisson recebe demanda esperada alta e/ou estoque alto o
  suficiente para gerar `NaN` ou `Inf` durante a soma da CDF.

O que deve ser feito:

- Tornar todos os valores numericos do contrato `sales-analytics-export.v1`
  seguros para JSON.
- Saturar probabilidades em `[0, 1]` quando calculos numericos produzirem
  `NaN`, `+Inf` ou `-Inf`.
- Corrigir especificamente `poissonStockoutProbability` para:
  - retornar `0` para demanda invalida/nao observada;
  - retornar `1` quando o calculo estourar para demanda extrema;
  - nunca propagar `NaN` para `StockoutRisk`, `StockoutProbabilityPoint` ou
    `SimulationPriors`.
- Revisar `clampProbability` para tratar `NaN` e infinitos de forma
  deterministica.
- Verificar outros calculos estatisticos que entram no JSON:
  - funil Wilson;
  - sobrevivencia/hazard;
  - forecast de demanda;
  - priors de simulacao.

Como implementar:

- Adicionar guards com `math.IsNaN` e `math.IsInf` nos pontos de fronteira
  numerica, preferindo helpers pequenos e testaveis.
- Evitar esconder erro de modelagem silenciosamente fora dos helpers: se um
  valor for sanitizado, a regra deve ser clara no nome ou comentario curto do
  helper.
- Rodar o export com dataset pequeno e com dataset volumoso antes/depois da
  alteracao.

Testes a implementar:

- Unitario em `internal/analytics/stockout_risk_test.go` cobrindo demanda
  extrema, por exemplo `poissonStockoutProbability(1_000_000, 1_000) == 1`.
- Unitario para `clampProbability` com `math.NaN()`, `math.Inf(1)` e
  `math.Inf(-1)`.
- Teste de serializacao JSON para `BuildDocumentWithInventory` com estoque e
  demanda suficientes para reproduzir o caso extremo.
- Teste do CLI ou pacote `analyticsdb` garantindo que `json.Marshal` do
  documento completo nao falha.

Validacoes esperadas:

```bash
docker run --rm -v "$PWD":/app -w /app golang:1.22-alpine go test ./internal/analytics
docker run --rm --network sales-event-project_default \
  -v "$PWD":/app -w /app \
  -e DATABASE_URL='postgres://sales:sales@postgres:5432/sales_event?sslmode=disable' \
  golang:1.22-alpine \
  go run ./cmd/analytics-export \
    -sales-event-id 11111111-1111-1111-1111-111111111111 \
    -limit 10000 \
    -pretty=false
```

Criterios de aceite:

- O endpoint nao retorna mais `200` com corpo vazio para massa grande.
- O CLI nao falha com `json: unsupported value: NaN`.
- O payload final continua no schema `sales-analytics-export.v1`.
- O `react-dash` consegue carregar `limit=10000` com fonte `API local`.

### CFX2 - Fazer A API Nao Responder 200 Vazio Em Falha De JSON

Projeto principal: `sales-event-project`.

Problema observado:

- Quando a serializacao JSON falhou, o endpoint de analytics respondeu
  `HTTP/1.1 200 OK` e `Content-Length: 0`.
- Isso mascara o erro no frontend: o problema real nao aparece como `500`, e a
  UI so ve uma resposta vazia/invalida.

O que deve ser feito:

- Garantir que rotas que retornam documentos grandes validem a serializacao
  antes de enviar status `200`.
- Retornar erro HTTP apropriado quando o payload nao puder ser serializado.
- Logar o erro com contexto suficiente:
  - rota;
  - `salesEventId`;
  - `limit`;
  - causa de serializacao.

Como implementar:

- No handler `GET /analytics/export`, substituir o envio direto via `c.JSON`
  por um fluxo que:
  - chama o exporter;
  - faz `json.Marshal` ou `json.MarshalIndent` antes de escrever headers;
  - em caso de erro, retorna `500` com mensagem segura;
  - em sucesso, escreve `Content-Type: application/json` e o payload.
- Se houver helper HTTP comum no projeto, centralizar esse padrao para evitar
  divergencia entre rotas.

Testes a implementar:

- Teste de rota com exporter fake que retorna documento contendo `math.NaN()`
  em campo numerico e espera `500`, nao `200`.
- Teste de rota feliz garantindo que o corpo nao fica vazio.
- Teste de client no `react-dash` para resposta `200` com corpo vazio, exibindo
  fallback legivel em vez de quebrar parse.

Validacoes esperadas:

```bash
docker run --rm -v "$PWD":/app -w /app golang:1.22-alpine go test ./internal/httpapi ./internal/analytics
npm test
```

Criterios de aceite:

- Falha de serializacao vira erro HTTP observavel.
- O frontend mostra mensagem de falha/fallback quando a resposta e vazia.
- Logs da API explicam a causa sem vazar segredo.

### CFX3 - Unificar Chaves Demo Documentadas E Seeds Locais

Projetos: `sales-event-project` e `react-dash`.

Problema observado:

- A documentacao do dashboard orienta usar `support-key`.
- O seed local atual do `sales-event-project` aceita `dev-support-key`.
- Durante o ensaio, `support-key` retornou `api key is invalid`; somente
  `dev-support-key` carregou a API local.

O que deve ser feito:

- Escolher um padrao canonico para chaves locais de desenvolvimento.
- Atualizar a documentacao dos dois repositorios para refletir o mesmo padrao.
- Atualizar exemplos de curl, checklist de demo e scripts de smoke.
- Garantir que fixtures/testes nao usem nomes que confundam chave fake de teste
  com chave seedada local.

Como implementar:

- Conferir `migrations/00003_create_api_keys.sql` e mapear as chaves reais:
  - `dev-admin-key`;
  - `dev-support-key`;
  - `dev-check-in-key`;
  - `dev-payment-provider-key`.
- Atualizar em `react-dash`:
  - `docs/demo-checklist.md`;
  - `docs/integrations.md`;
  - qualquer README ou troubleshooting que cite `support-key`.
- Atualizar em `sales-event-project`:
  - `docs/analytics-export.md`;
  - exemplos de API key em docs de suporte/admin.
- Decidir se testes unitarios continuam com `support-key` como chave fake
  isolada; se sim, deixar claro que e fake de teste e nao chave local.

Testes a implementar:

- Teste ou smoke script que consulta:
  `GET /analytics/export?...` com `dev-support-key` e espera `200`.
- Teste/smoke que consulta com chave invalida e espera `401`.
- Se houver script de demo, parametrizar `SALES_SUPPORT_API_KEY` com default
  `dev-support-key`.

Validacoes esperadas:

```bash
curl -sS -H 'X-API-Key: dev-support-key' \
  'http://localhost:8080/analytics/export?salesEventId=11111111-1111-1111-1111-111111111111&limit=10'

npm test
```

Criterios de aceite:

- Um agent novo segue a documentacao e consegue carregar `API local` no
  dashboard sem descobrir a chave por tentativa e erro.
- Docs dos dois repositorios usam a mesma chave local.
- Nenhuma API key real/secreta e versionada.

### CFX4 - Criar Script Versionado Para Massa De Dados De Demo

Projetos: `sales-event-project` e `react-dash`.

Problema observado:

- A massa grande usada na evidencia foi gerada por script ad hoc fora do repo.
- O ensaio precisou lidar manualmente com:
  - estoque demo zerado por execucoes anteriores;
  - rate limit do `POST /sales`;
  - mistura de tickets General/VIP;
  - pagamentos aprovados/falhos;
  - eventos de email;
  - check-ins usando QR codes lidos no banco.

O que deve ser feito:

- Criar um script versionado e reproduzivel para gerar dados analiticos ricos
  para o dashboard.
- O script deve aceitar parametros para volume e comportamento, por exemplo:
  - quantidade de vendas;
  - taxa de falha de pagamento;
  - quantidade de check-ins;
  - envio de eventos de email;
  - reset opcional do estoque demo;
  - base URL e chaves locais.
- O script deve imprimir um resumo JSON final com contagens geradas.

Como implementar:

- Preferir script em Go ou Bash/Python versionado no
  `sales-event-project/scripts/`.
- Usar endpoints publicos sempre que possivel.
- Para QR code de check-in, escolher uma das abordagens:
  - expor endpoint de suporte para listar tickets emitidos em ambiente local;
  - ou documentar que o script local usa Postgres via `docker compose exec`.
- Implementar backoff para `429 rate limit exceeded`, preservando o
  comportamento real da API.
- Evitar apagar dados por padrao; qualquer reset deve exigir flag explicita,
  por exemplo `--reset-demo-inventory`.

Testes a implementar:

- Teste de unidade para geracao de payloads de venda, pagamento e email.
- Smoke manual documentado:
  - subir compose;
  - rodar script com `--sales 50`;
  - consultar analytics export;
  - abrir `react-dash` e confirmar KPIs.
- Se o script for Go, adicionar testes para parser de flags e resumo.

Validacoes esperadas:

```bash
scripts/generate-analytics-demo-data.sh --sales 50 --reset-demo-inventory
curl -sS -H 'X-API-Key: dev-support-key' \
  'http://localhost:8080/analytics/export?salesEventId=11111111-1111-1111-1111-111111111111&limit=10000'
```

Criterios de aceite:

- A massa de demo pode ser recriada sem copiar codigo de uma sessao antiga.
- O resumo mostra vendas, pagamentos aprovados, pagamentos falhos, emails,
  tickets e check-ins.
- O dashboard mostra volume substancial de dados com fonte `API local`.

### CFX5 - Automatizar Evidencias Visuais Da API Local

Projeto principal: `react-dash`.

Problema observado:

- As evidencias visuais foram geradas com um script temporario fora do repo.
- Os E2E existentes cobrem fixture e autenticacao, mas nao validam o caminho
  integrado pesado com API local do Sales.

O que deve ser feito:

- Versionar uma automacao opcional para capturar screenshots completos do
  dashboard com API local.
- A automacao deve gerar:
  - screenshot desktop full-page;
  - viewport da tabela de eventos;
  - viewport do funil;
  - full-page em tema escuro;
  - full-page mobile.
- O script deve salvar saida em pasta parametrizavel, preferencialmente fora do
  fluxo normal de build, para nao poluir commits acidentais.

Como implementar:

- Criar um teste E2E ou script Playwright em `tests/e2e/` ou `scripts/`.
- Usar variaveis de ambiente:
  - `REACT_DASH_BASE_URL`;
  - `SALES_EVENT_ID`;
  - `SALES_SUPPORT_API_KEY`;
  - `EVIDENCE_OUTPUT_DIR`.
- Limpar a API key do input antes de capturar screenshots.
- Nao depender de um caminho absoluto de Chromium. Usar Playwright instalado
  pelo projeto ou documentar `npm run test:e2e:install`.

Testes a implementar:

- E2E que carrega API local e valida textos/numeros principais sem depender de
  screenshots.
- Script de screenshot separado, executado manualmente, com checagem de que os
  PNGs existem e nao estao vazios.
- Opcional: teste que verifica ausencia de overflow horizontal no dashboard
  carregado com API local.

Validacoes esperadas:

```bash
npm run test:e2e
SALES_SUPPORT_API_KEY=dev-support-key npm run evidence:sales-api
```

Criterios de aceite:

- O caminho API local e testado por E2E, nao apenas por smoke manual.
- Screenshots podem ser regenerados de forma documentada.
- A API key nao aparece nos prints finais.

### CFX6 - Tornar Playwright Local Reprodutivel

Projeto principal: `react-dash`.

Problema observado:

- Depois de restaurar dependencias com `npm ci`, o pacote Playwright esperava
  uma versao de browser diferente da que estava em cache local.
- Foi necessario apontar manualmente para um Chromium antigo em cache para
  capturar evidencias e rodar E2E.

O que deve ser feito:

- Padronizar a instalacao e execucao local do Playwright.
- Garantir que um agent novo consiga rodar E2E sem descobrir paths de cache.

Como implementar:

- Manter script documentado:
  `npm run test:e2e:install`.
- Considerar adicionar um script de pre-check, por exemplo:
  `npm run test:e2e:doctor`, que valida se o browser esperado existe.
- Documentar no `docs/testing.md` e `docs/demo-checklist.md`:
  - quando rodar `npm run test:e2e:install`;
  - como usar `PLAYWRIGHT_BROWSERS_PATH`, se necessario;
  - como reaproveitar servidor Vite existente.
- Evitar configs temporarias com caminho absoluto em comandos oficiais.

Testes a implementar:

- Rodar `npm run test:e2e` em ambiente limpo depois de
  `npm run test:e2e:install`.
- Validar que os E2E existentes continuam passando com Chromium instalado pelo
  projeto.

Validacoes esperadas:

```bash
npm ci
npm run test:e2e:install
npm run test:e2e
```

Criterios de aceite:

- E2E local nao depende de cache antigo.
- Documentacao explica o setup completo.
- Nenhum path absoluto de maquina local entra no repo.

### CFX7 - Reduzir Ruido De Recharts Nos Testes Unitarios

Projeto principal: `react-dash`.

Problema observado:

- `npm test` passa, mas emite avisos repetidos de Recharts:
  `The width(0) and height(0) of chart should be greater than 0`.
- O ruido dificulta identificar erros reais em testes de UI.

O que deve ser feito:

- Ajustar ambiente de teste para fornecer dimensoes estaveis aos containers de
  graficos ou mockar componentes de chart em testes unitarios.
- Preservar testes E2E para validar renderizacao real dos graficos no browser.

Como implementar:

- Revisar `src/setupTests.ts` e mocks de `ResizeObserver`.
- Definir `getBoundingClientRect`, `offsetWidth` e `offsetHeight` consistentes
  para containers de chart em JSDOM, se necessario.
- Alternativamente, mockar Recharts nos testes unitarios de App/Home e deixar
  cobertura visual para Playwright.

Testes a implementar:

- Manter `src/App.test.tsx` cobrindo renderizacao do overview.
- Adicionar teste especifico para estados com dados vazios sem gerar warning.
- Rodar `npm test` e confirmar que stderr nao tem warnings de dimensao.

Validacoes esperadas:

```bash
npm test
npm run test:e2e
```

Criterios de aceite:

- Testes unitarios passam sem warnings repetitivos.
- Graficos continuam renderizando no browser real.

### CFX8 - Mostrar Dados Mais Recentes Na Tabela Analitica Por Padrao

Projeto principal: `react-dash`.

Problema observado:

- Depois de gerar dados novos, a tabela do dashboard mostrou primeiro eventos
  antigos porque o payload vem ordenado em ordem crescente por timestamp.
- Para demo, isso esconde as operacoes recem-geradas e obriga a pessoa a
  navegar/sortear manualmente.

O que deve ser feito:

- Definir ordenacao inicial da tabela analitica para eventos mais recentes
  primeiro.
- Preservar a possibilidade de ordenar por outras colunas via Data Grid.
- Garantir que export CSV/JSON nao seja alterado indevidamente pela ordenacao
  visual.

Como implementar:

- Ajustar `EventsTable` ou o transformador de linhas para separar:
  - ordem do documento bruto;
  - ordem visual default.
- Configurar `initialState.sorting.sortModel` da MUI Data Grid para
  `Timestamp desc`, se a coluna estiver tipada corretamente.
- Se o timestamp estiver formatado como string local, manter campo bruto
  separado para sort.

Testes a implementar:

- Teste unitario do transformador ou componente garantindo que evento mais
  recente aparece antes no estado visual.
- Teste E2E simples que carrega fixture/API e confirma ordenacao inicial.
- Teste de export CSV garantindo que a decisao de ordem e explicita.

Validacoes esperadas:

```bash
npm test
npm run typecheck
npm run test:e2e
```

Criterios de aceite:

- Operacoes recem-geradas aparecem no topo da tabela.
- Usuario ainda consegue ordenar manualmente.
- Exportacoes continuam previsiveis.

### CFX9 - Isolar Estado De Demo Entre Execucoes

Projetos: `sales-event-project` e `react-dash`.

Problema observado:

- A primeira simulacao falhou porque o estoque local de `General Admission`
  estava zerado por execucoes anteriores.
- Foi necessario atualizar o estoque diretamente no Postgres local para
  continuar a geracao de massa.

O que deve ser feito:

- Criar um modo seguro de preparar ambiente de demo sem depender de SQL manual.
- O reset deve ser explicito e limitado aos dados demo conhecidos.

Como implementar:

- Adicionar comando/script no `sales-event-project` para:
  - garantir evento demo seedado;
  - recompor estoque dos tickets demo;
  - opcionalmente limpar somente vendas geradas por um `runId` especifico;
  - nunca apagar dados fora do evento demo sem flag extra.
- Documentar no checklist do `react-dash` quando usar esse reset.
- Preferir idempotencia: rodar duas vezes deve deixar o ambiente em estado
  conhecido.

Testes a implementar:

- Teste de script em ambiente de compose local, validando estoque antes/depois.
- Smoke que roda reset, gera uma venda, e confirma export analytics nao vazio.

Validacoes esperadas:

```bash
scripts/reset-demo-analytics-state.sh --sales-event-id 11111111-1111-1111-1111-111111111111
scripts/generate-analytics-demo-data.sh --sales 20
```

Criterios de aceite:

- Demo nao falha por estoque remanescente de ensaios antigos.
- O reset e seguro, documentado e limitado ao ambiente local/demo.

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

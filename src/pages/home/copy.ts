export const homeCopy = {
  controls: {
    apiKey: 'API key',
    baseUrl: 'Base URL',
    end: 'End',
    loadApi: 'Carregar API',
    loading: 'Carregando',
    salesEvent: 'Sales event',
    start: 'Start',
    limit: 'Limite',
  },
  emptyStates: {
    funnel: 'Sem segmentos de funil neste export.',
    survival: 'Sem analises de sobrevivencia neste export.',
  },
  exportPanel: {
    ariaLabel: 'Exportar dados analiticos',
    csvEvents: 'CSV eventos',
    csvWindows: 'CSV janelas',
    defaultMessage: 'Baixe o documento bruto, CSVs ou os graficos visiveis.',
    json: 'JSON bruto',
    pngEventTypes: 'PNG tipos',
    pngWindows: 'PNG janelas',
    subtitle: 'Dados e graficos',
    title: 'Exportacoes',
  },
  exportStatus: {
    csvEvents: 'CSV de eventos exportado.',
    csvWindows: 'CSV de janelas exportado.',
    json: 'JSON exportado com o documento bruto.',
    png: 'PNG do grafico exportado.',
  },
  header: {
    eyebrow: 'Sales Event Analytics',
    source: 'Fonte',
    title: 'Coleta operacional pronta para analise.',
  },
  kpis: {
    checkIns: 'Check-ins',
    completedSales: 'Vendas concluidas',
    eventCount: 'Eventos coletados',
    issuedTickets: 'Tickets emitidos',
    observedRevenue: 'Receita observada',
  },
  loadStatus: {
    api: 'Dados carregados da API local do Sales.',
    fixture: 'Fixture local carregada para desenvolvimento reproduzivel.',
    fallback: 'API indisponivel; usando fixture local.',
  },
  panels: {
    eventTypes: {
      title: 'Distribuicao coletada',
      eyebrow: 'Tipos de evento',
    },
    events: {
      title: 'Tabela analitica',
      eyebrow: 'Eventos brutos',
    },
    eventsTable: {
      noRows: 'Sem eventos para o filtro atual',
      toolbarColumns: 'Colunas',
      toolbarFilters: 'Filtros',
    },
    funnel: {
      title: 'Conversao com incerteza',
      eyebrow: 'Funil',
    },
    survival: {
      title: 'Tempo ate evento',
      eyebrow: 'Sobrevivencia',
    },
    windows: {
      title: 'Eventos por janela',
      eyebrow: 'Janelas 5m',
    },
  },
  placeholders: {
    apiKey: 'X-API-Key',
    baseUrl: '/api',
    end: '2026-09-02T00:00:00Z',
    salesEvent: 'salesEventId',
    start: '2026-09-01T10:00:00Z',
  },
  source: {
    api: 'API local',
    fixture: 'Fixture local',
  },
} as const;

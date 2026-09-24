import type {
  AggregateCounts,
  AnalyticsEventRow,
  AnalyticsKpis,
  CountMap,
  EventCsvRow,
  FunnelStepRow,
  SalesAnalyticsDocument,
  SalesAnalyticsEvent,
  SurvivalSummaryRow,
  WindowAggregate,
  WindowCsvRow,
  WindowSeriesPoint,
} from './types';

export const emptySalesAnalyticsDocument: SalesAnalyticsDocument = {
  schemaVersion: 'sales-analytics-export.v1',
  generatedAt: '',
  source: {
    service: 'sales-event-project',
    windowSizes: [],
  },
  summary: {
    eventCount: 0,
    windowCount: 0,
    eventTypeCounts: {},
  },
  events: [],
  windows: [],
  funnels: [],
  survivalAnalyses: [],
};

export function buildAnalyticsKpis(
  document: SalesAnalyticsDocument
): AnalyticsKpis {
  const completedSales = new Set<string>();
  let observedRevenueCents = 0;
  let issuedTickets = 0;
  let checkIns = 0;

  for (const event of document.events) {
    if (isCompletedSaleEvent(event)) {
      completedSales.add(event.saleId ?? event.eventId ?? event.occurredAt);
    }

    if (event.eventType === 'payment.processed' && isApproved(event.status)) {
      observedRevenueCents += event.amountCents ?? 0;
      if (event.saleId) {
        completedSales.add(event.saleId);
      }
    }

    if (event.eventType === 'ticket.issued') {
      issuedTickets += positiveQuantityOrOne(event.quantity);
    }

    if (event.eventType === 'checkin.completed') {
      checkIns += positiveQuantityOrOne(event.quantity);
    }
  }

  return {
    eventCount: document.summary.eventCount || document.events.length,
    completedSales: completedSales.size,
    observedRevenueCents,
    issuedTickets,
    checkIns,
  };
}

export function buildWindowSeries(
  document: SalesAnalyticsDocument,
  windowSize = '5m'
): WindowSeriesPoint[] {
  return document.windows
    .filter((window) => window.windowSize === windowSize)
    .slice()
    .sort(sortWindowsByStart)
    .map((window) => {
      const counts = window.counts;

      return {
        id: `${window.windowSize}-${window.windowStart}`,
        windowSize: window.windowSize,
        windowStart: window.windowStart,
        windowEnd: window.windowEnd,
        totalEvents: counts.totalEvents,
        salesCreated: countValue(counts.eventTypeCounts, 'sale.created'),
        paymentsApproved: countValue(counts.paymentStatusCounts, 'APPROVED'),
        emailsSent: countValue(counts.emailStatusCounts, 'SENT'),
        checkIns: counts.checkInCount ?? 0,
        ticketQuantity: sumCountMap(counts.ticketQuantityByType),
        revenueCents: counts.totalAmountCents ?? 0,
      };
    });
}

export function buildFunnelRows(
  document: SalesAnalyticsDocument
): FunnelStepRow[] {
  return (document.funnels ?? []).flatMap((segment, segmentIndex) =>
    segment.steps.map((step, stepIndex) => ({
      id: `${segmentIndex}-${stepIndex}-${step.from}-${step.to}`,
      salesEventId: segment.salesEventId ?? '',
      ticketType: segment.ticketType ?? '',
      provider: segment.provider,
      windowSize: segment.windowSize,
      windowStart: segment.windowStart,
      from: step.from,
      to: step.to,
      trials: step.trials,
      successes: step.successes,
      conversionProbability: step.conversionProbability,
      confidenceLower: step.confidenceInterval.lower,
      confidenceUpper: step.confidenceInterval.upper,
      posteriorMean: step.bayesian.posteriorMean,
    }))
  );
}

export function buildSurvivalSummaryRows(
  document: SalesAnalyticsDocument
): SurvivalSummaryRow[] {
  return (document.survivalAnalyses ?? []).map((analysis) => ({
    id: analysis.eventName,
    eventName: analysis.eventName,
    fromStage: analysis.fromStage,
    toStage: analysis.toStage,
    unitOfAnalysis: analysis.unitOfAnalysis,
    observationCount: analysis.observationCount,
    eventCount: analysis.eventCount,
    censoredCount: analysis.censoredCount,
    p50Seconds: analysis.percentilesSeconds?.p50 ?? null,
    p90Seconds: analysis.percentilesSeconds?.p90 ?? null,
    p95Seconds: analysis.percentilesSeconds?.p95 ?? null,
  }));
}

export function buildEventRows(
  document: SalesAnalyticsDocument
): AnalyticsEventRow[] {
  return document.events.map((event, index) => ({
    id: event.eventId || `${event.eventType}-${event.occurredAt}-${index}`,
    occurredAt: event.occurredAt,
    eventType: event.eventType,
    salesEventId: event.salesEventId ?? '',
    saleId: event.saleId ?? '',
    ticketId: event.ticketId ?? '',
    ticketType: event.ticketType ?? '',
    status: event.status ?? '',
    provider: event.provider ?? '',
    outboxEventType: event.outboxEventType ?? '',
    amountCents: event.amountCents ?? 0,
    quantity: event.quantity ?? 0,
    attempts: event.attempts ?? 0,
  }));
}

export function buildEventCsvRows(
  document: SalesAnalyticsDocument
): EventCsvRow[] {
  return document.events.map((event) => ({
    occurredAt: event.occurredAt,
    eventType: event.eventType,
    salesEventId: event.salesEventId ?? '',
    saleId: event.saleId ?? '',
    ticketId: event.ticketId ?? '',
    ticketType: event.ticketType ?? '',
    status: event.status ?? '',
    provider: event.provider ?? '',
    amountCents: event.amountCents ?? 0,
    quantity: event.quantity ?? 0,
    attempts: event.attempts ?? 0,
    requestId: event.requestId ?? '',
    correlationId: event.correlationId ?? '',
    transactionId: event.transactionId ?? '',
  }));
}

export function buildWindowCsvRows(
  document: SalesAnalyticsDocument
): WindowCsvRow[] {
  return document.windows.map((window) => ({
    windowSize: window.windowSize,
    windowStart: window.windowStart,
    windowEnd: window.windowEnd,
    totalEvents: window.counts.totalEvents,
    totalAmountCents: window.counts.totalAmountCents ?? 0,
    checkInCount: window.counts.checkInCount ?? 0,
    eventTypeCounts: encodeCountMap(window.counts.eventTypeCounts),
    saleStatusCounts: encodeCountMap(window.counts.saleStatusCounts),
    paymentStatusCounts: encodeCountMap(window.counts.paymentStatusCounts),
    outboxStatusCounts: encodeCountMap(window.counts.outboxStatusCounts),
    emailStatusCounts: encodeCountMap(window.counts.emailStatusCounts),
    ticketQuantityByType: encodeCountMap(window.counts.ticketQuantityByType),
  }));
}

function isCompletedSaleEvent(event: SalesAnalyticsEvent) {
  return event.eventType.startsWith('sale.') && event.status === 'COMPLETED';
}

function isApproved(status: string | undefined) {
  return status === 'APPROVED';
}

function positiveQuantityOrOne(value: number | undefined) {
  return value && value > 0 ? value : 1;
}

function countValue(map: CountMap | undefined, key: string) {
  return map?.[key] ?? 0;
}

function sumCountMap(map: CountMap | undefined) {
  if (!map) {
    return 0;
  }

  return Object.values(map).reduce((sum, value) => sum + value, 0);
}

function sortWindowsByStart(left: WindowAggregate, right: WindowAggregate) {
  return left.windowStart.localeCompare(right.windowStart);
}

function encodeCountMap(map: CountMap | undefined) {
  if (!map || Object.keys(map).length === 0) {
    return '';
  }

  return Object.entries(map)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
}

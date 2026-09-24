export type ISODateTimeString = string;

export type CountMap = Record<string, number>;

export interface SalesAnalyticsDocument {
  schemaVersion: 'sales-analytics-export.v1';
  generatedAt: ISODateTimeString;
  source: SalesAnalyticsSource;
  summary: SalesAnalyticsSummary;
  events: SalesAnalyticsEvent[];
  windows: WindowAggregate[];
  funnels?: FunnelSegment[];
  survivalAnalyses?: SurvivalAnalysis[];
}

export interface SalesAnalyticsSource {
  service: string;
  salesEventId?: string;
  filter?: string;
  windowSizes: string[];
}

export interface SalesAnalyticsSummary {
  eventCount: number;
  windowCount: number;
  eventTypeCounts: CountMap;
}

export interface SalesAnalyticsEvent {
  eventId?: string;
  eventType: string;
  occurredAt: ISODateTimeString;
  salesEventId?: string;
  saleId?: string;
  ticketId?: string;
  ticketType?: string;
  status?: string;
  provider?: string;
  outboxEventType?: string;
  amountCents?: number;
  quantity?: number;
  attempts?: number;
  requestId?: string;
  correlationId?: string;
  transactionId?: string;
}

export interface WindowAggregate {
  windowSize: string;
  windowStart: ISODateTimeString;
  windowEnd: ISODateTimeString;
  counts: AggregateCounts;
}

export interface AggregateCounts {
  totalEvents: number;
  eventTypeCounts: CountMap;
  saleStatusCounts?: CountMap;
  paymentStatusCounts?: CountMap;
  outboxStatusCounts?: CountMap;
  emailStatusCounts?: CountMap;
  checkInCount?: number;
  ticketQuantityByType?: CountMap;
  totalAmountCents?: number;
}

export interface FunnelSegment {
  salesEventId?: string;
  ticketId?: string;
  ticketType?: string;
  provider: string;
  windowSize: string;
  windowStart: ISODateTimeString;
  windowEnd: ISODateTimeString;
  steps: FunnelStep[];
}

export interface FunnelStep {
  from: string;
  to: string;
  trials: number;
  successes: number;
  conversionProbability: number;
  confidenceInterval: ConfidenceInterval;
  bayesian: BetaBinomial;
}

export interface ConfidenceInterval {
  method: string;
  level: number;
  lower: number;
  upper: number;
}

export interface BetaBinomial {
  priorAlpha: number;
  priorBeta: number;
  posteriorAlpha: number;
  posteriorBeta: number;
  posteriorMean: number;
}

export interface SurvivalAnalysis {
  eventName: string;
  fromStage: string;
  toStage: string;
  unitOfAnalysis: string;
  observationCount: number;
  eventCount: number;
  censoredCount: number;
  percentilesSeconds?: Record<string, number>;
  hazardTable: SurvivalHazardBucket[];
}

export interface SurvivalHazardBucket {
  intervalStartSeconds: number;
  intervalEndSeconds?: number;
  atRisk: number;
  events: number;
  censored: number;
  hazard: number;
  survivalProbability: number;
}

export interface AnalyticsKpis {
  eventCount: number;
  completedSales: number;
  observedRevenueCents: number;
  issuedTickets: number;
  checkIns: number;
}

export interface WindowSeriesPoint {
  id: string;
  windowSize: string;
  windowStart: ISODateTimeString;
  windowEnd: ISODateTimeString;
  totalEvents: number;
  salesCreated: number;
  paymentsApproved: number;
  emailsSent: number;
  checkIns: number;
  ticketQuantity: number;
  revenueCents: number;
}

export interface FunnelStepRow {
  id: string;
  salesEventId: string;
  ticketType: string;
  provider: string;
  windowSize: string;
  windowStart: ISODateTimeString;
  from: string;
  to: string;
  trials: number;
  successes: number;
  conversionProbability: number;
  confidenceLower: number;
  confidenceUpper: number;
  posteriorMean: number;
}

export interface SurvivalSummaryRow {
  id: string;
  eventName: string;
  fromStage: string;
  toStage: string;
  unitOfAnalysis: string;
  observationCount: number;
  eventCount: number;
  censoredCount: number;
  p50Seconds: number | null;
  p90Seconds: number | null;
  p95Seconds: number | null;
}

export interface AnalyticsEventRow {
  id: string;
  occurredAt: ISODateTimeString;
  eventType: string;
  salesEventId: string;
  saleId: string;
  ticketId: string;
  ticketType: string;
  status: string;
  provider: string;
  outboxEventType: string;
  amountCents: number;
  quantity: number;
  attempts: number;
}

export interface EventCsvRow {
  occurredAt: ISODateTimeString;
  eventType: string;
  salesEventId: string;
  saleId: string;
  ticketId: string;
  ticketType: string;
  status: string;
  provider: string;
  amountCents: number;
  quantity: number;
  attempts: number;
  requestId: string;
  correlationId: string;
  transactionId: string;
}

export interface WindowCsvRow {
  windowSize: string;
  windowStart: ISODateTimeString;
  windowEnd: ISODateTimeString;
  totalEvents: number;
  totalAmountCents: number;
  checkInCount: number;
  eventTypeCounts: string;
  saleStatusCounts: string;
  paymentStatusCounts: string;
  outboxStatusCounts: string;
  emailStatusCounts: string;
  ticketQuantityByType: string;
}

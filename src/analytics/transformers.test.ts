import {
  buildAnalyticsKpis,
  buildEventCsvRows,
  buildEventRows,
  buildFunnelRows,
  buildSurvivalSummaryRows,
  buildWindowCsvRows,
  buildWindowSeries,
  emptySalesAnalyticsDocument,
  localSalesAnalyticsFixture,
} from './index';

describe('analytics transformers', () => {
  it('builds KPI values from the local sales analytics fixture', () => {
    expect(buildAnalyticsKpis(localSalesAnalyticsFixture)).toEqual({
      eventCount: 4,
      completedSales: 1,
      observedRevenueCents: 10000,
      issuedTickets: 0,
      checkIns: 1,
    });
  });

  it('builds default 5m window series points', () => {
    const series = buildWindowSeries(localSalesAnalyticsFixture);

    expect(series).toHaveLength(2);
    expect(series[0]).toMatchObject({
      windowSize: '5m',
      windowStart: '2026-09-01T13:00:00Z',
      totalEvents: 2,
      salesCreated: 1,
      paymentsApproved: 1,
      revenueCents: 20000,
    });
    expect(series[1]).toMatchObject({
      windowStart: '2026-09-01T13:05:00Z',
      emailsSent: 1,
      checkIns: 1,
    });
  });

  it('builds event table and CSV rows', () => {
    const rows = buildEventRows(localSalesAnalyticsFixture);
    const csvRows = buildEventCsvRows(localSalesAnalyticsFixture);

    expect(rows).toHaveLength(4);
    expect(rows[1]).toMatchObject({
      eventType: 'payment.processed',
      saleId: 'sale-001',
      provider: 'credit_card',
      amountCents: 10000,
    });
    expect(csvRows[0]).toMatchObject({
      occurredAt: '2026-09-01T13:00:30Z',
      eventType: 'sale.created',
      requestId: '',
      correlationId: '',
      transactionId: '',
    });
  });

  it('builds window CSV rows with encoded count maps', () => {
    const rows = buildWindowCsvRows(localSalesAnalyticsFixture);

    expect(rows).toHaveLength(5);
    expect(rows[1]).toMatchObject({
      windowSize: '5m',
      eventTypeCounts: 'payment.processed:1|sale.created:1',
      paymentStatusCounts: 'APPROVED:1',
    });
  });

  it('returns empty structures when optional analytics blocks are missing', () => {
    expect(buildFunnelRows(localSalesAnalyticsFixture)).toEqual([]);
    expect(buildSurvivalSummaryRows(localSalesAnalyticsFixture)).toEqual([]);
  });

  it('handles an empty analytics document without throwing', () => {
    expect(buildAnalyticsKpis(emptySalesAnalyticsDocument)).toEqual({
      eventCount: 0,
      completedSales: 0,
      observedRevenueCents: 0,
      issuedTickets: 0,
      checkIns: 0,
    });
    expect(buildWindowSeries(emptySalesAnalyticsDocument)).toEqual([]);
    expect(buildEventRows(emptySalesAnalyticsDocument)).toEqual([]);
    expect(buildEventCsvRows(emptySalesAnalyticsDocument)).toEqual([]);
    expect(buildWindowCsvRows(emptySalesAnalyticsDocument)).toEqual([]);
  });
});

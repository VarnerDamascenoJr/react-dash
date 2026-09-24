import salesAnalyticsFixture from './fixtures/sales-analytics-export.v1.json';
import type { SalesAnalyticsDocument } from './types';

export const localSalesAnalyticsFixture =
  salesAnalyticsFixture as SalesAnalyticsDocument;

import { expectTypeOf, test } from 'vitest';
import type { ComponentProps } from 'react';
import type { EventTypeDistributionPoint, WindowSeriesPoint } from '../../../analytics';
import type TimeSeriesAreaChart from './TimeSeriesAreaChart';
import type VerticalDistributionBarChart from './VerticalDistributionBarChart';

type SeriesProps = ComponentProps<typeof TimeSeriesAreaChart<WindowSeriesPoint>>;
type DistributionProps = ComponentProps<typeof VerticalDistributionBarChart<EventTypeDistributionPoint>>;

test('time-series keys select existing numeric metrics and string axis values', () => {
  expectTypeOf<'totalEvents'>().toMatchTypeOf<SeriesProps['dataKey']>();
  expectTypeOf<'windowStart'>().toMatchTypeOf<SeriesProps['xDataKey']>();
  expectTypeOf<'windowStart'>().not.toMatchTypeOf<SeriesProps['dataKey']>();
  expectTypeOf<'totalEvents'>().not.toMatchTypeOf<SeriesProps['xDataKey']>();
  expectTypeOf<'missingMetric'>().not.toMatchTypeOf<SeriesProps['dataKey']>();
});

test('distribution keys keep categories and numeric values distinct', () => {
  expectTypeOf<'name'>().toMatchTypeOf<DistributionProps['categoryKey']>();
  expectTypeOf<'total'>().toMatchTypeOf<DistributionProps['valueKey']>();
  expectTypeOf<'name'>().not.toMatchTypeOf<DistributionProps['valueKey']>();
  expectTypeOf<'total'>().not.toMatchTypeOf<DistributionProps['categoryKey']>();
  expectTypeOf<'missingCategory'>().not.toMatchTypeOf<DistributionProps['categoryKey']>();
});

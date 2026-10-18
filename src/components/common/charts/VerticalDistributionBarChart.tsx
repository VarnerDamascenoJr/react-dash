import type { VerticalDistributionBarChartProps } from './charts.types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function VerticalDistributionBarChart<TData extends object>({
  barColor,
  categoryKey,
  data,
  label,
  valueFormatter,
  valueKey,
  yAxisWidth = 132,
}: VerticalDistributionBarChartProps<TData>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis allowDecimals={false} type="number" tickFormatter={valueFormatter} />
        <YAxis dataKey={categoryKey} type="category" width={yAxisWidth} />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Bar
          dataKey={valueKey}
          fill={barColor}
          name={label}
          radius={[0, 6, 6, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

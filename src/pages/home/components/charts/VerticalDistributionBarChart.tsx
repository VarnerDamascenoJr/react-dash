import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface VerticalDistributionBarChartProps {
  barColor: string;
  categoryKey: string;
  data: object[];
  label: string;
  valueKey: string;
  yAxisWidth?: number;
}

export default function VerticalDistributionBarChart({
  barColor,
  categoryKey,
  data,
  label,
  valueKey,
  yAxisWidth = 132,
}: VerticalDistributionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis allowDecimals={false} type="number" />
        <YAxis dataKey={categoryKey} type="category" width={yAxisWidth} />
        <Tooltip />
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

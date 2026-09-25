import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TimeSeriesAreaChartProps {
  data: object[];
  dataKey: string;
  gradientId: string;
  label: string;
  stroke: string;
  tooltipLabelFormatter: (value: string) => string;
  xDataKey: string;
  xTickFormatter: (value: string) => string;
}

export default function TimeSeriesAreaChart({
  data,
  dataKey,
  gradientId,
  label,
  stroke,
  tooltipLabelFormatter,
  xDataKey,
  xTickFormatter,
}: TimeSeriesAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.55} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis dataKey={xDataKey} tickFormatter={xTickFormatter} />
        <YAxis allowDecimals={false} width={36} />
        <Tooltip labelFormatter={(value) => tooltipLabelFormatter(String(value))} />
        <Area
          dataKey={dataKey}
          fill={`url(#${gradientId})`}
          name={label}
          stroke={stroke}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

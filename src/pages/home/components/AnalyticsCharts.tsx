import type { RefObject } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WindowSeriesPoint } from '../../../analytics';
import { formatDateTime, formatInteger, formatShortTime } from '../formatters';

interface AnalyticsChartsProps {
  eventTypeData: Array<{
    name: string;
    total: number;
  }>;
  eventTypesChartRef: RefObject<HTMLDivElement>;
  eventsChartRef: RefObject<HTMLDivElement>;
  windowSeries: WindowSeriesPoint[];
}

export default function AnalyticsCharts({
  eventTypeData,
  eventTypesChartRef,
  eventsChartRef,
  windowSeries,
}: AnalyticsChartsProps) {
  const latestWindow = windowSeries[windowSeries.length - 1];

  return (
    <section className="analyticsGrid">
      <article className="panel panelLarge">
        <div className="panelHeader">
          <div>
            <span>Janelas 5m</span>
            <h3>Eventos por janela</h3>
          </div>
          <strong>
            {latestWindow ? formatInteger(latestWindow.totalEvents) : '0'}
          </strong>
        </div>
        <div className="chartFrame" ref={eventsChartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={windowSeries}
              margin={{ top: 12, right: 18, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2c7be5" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#2c7be5" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
              <XAxis dataKey="windowStart" tickFormatter={formatShortTime} />
              <YAxis allowDecimals={false} width={36} />
              <Tooltip labelFormatter={formatDateTime} />
              <Area
                dataKey="totalEvents"
                fill="url(#eventsGradient)"
                name="Eventos"
                stroke="#2c7be5"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel">
        <div className="panelHeader">
          <div>
            <span>Tipos de evento</span>
            <h3>Distribuicao coletada</h3>
          </div>
        </div>
        <div className="chartFrame compact" ref={eventTypesChartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={eventTypeData}
              layout="vertical"
              margin={{ left: 8, right: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
              <XAxis allowDecimals={false} type="number" />
              <YAxis dataKey="name" type="category" width={132} />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#f05d5e"
                name="Eventos"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

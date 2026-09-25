import type { FunnelStepRow, SurvivalSummaryRow } from '../../../analytics';
import { formatPercent, formatSeconds } from '../formatters';

interface InsightPanelsProps {
  funnelRows: FunnelStepRow[];
  survivalRows: SurvivalSummaryRow[];
}

export default function InsightPanels({
  funnelRows,
  survivalRows,
}: InsightPanelsProps) {
  return (
    <section className="insightGrid">
      <article className="panel">
        <div className="panelHeader">
          <div>
            <span>Funil</span>
            <h3>Conversao com incerteza</h3>
          </div>
        </div>
        {funnelRows.length === 0 ? (
          <EmptyState text="Sem segmentos de funil neste export." />
        ) : (
          <ul className="metricList">
            {funnelRows.slice(0, 5).map((row) => (
              <li key={row.id}>
                <span>
                  {row.from} → {row.to}
                </span>
                <strong>{formatPercent(row.conversionProbability)}</strong>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="panel">
        <div className="panelHeader">
          <div>
            <span>Sobrevivencia</span>
            <h3>Tempo ate evento</h3>
          </div>
        </div>
        {survivalRows.length === 0 ? (
          <EmptyState text="Sem analises de sobrevivencia neste export." />
        ) : (
          <ul className="metricList">
            {survivalRows.map((row) => (
              <li key={row.id}>
                <span>{row.eventName}</span>
                <strong>{formatSeconds(row.p50Seconds)}</strong>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="emptyState">{text}</div>;
}

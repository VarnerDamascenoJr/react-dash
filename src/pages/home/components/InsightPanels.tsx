import type { FunnelStepRow, SurvivalSummaryRow } from '../../../analytics';
import { homeCopy } from '../copy';
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
            <span>{homeCopy.panels.funnel.eyebrow}</span>
            <h3>{homeCopy.panels.funnel.title}</h3>
          </div>
        </div>
        {funnelRows.length === 0 ? (
          <EmptyState text={homeCopy.emptyStates.funnel} />
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
            <span>{homeCopy.panels.survival.eyebrow}</span>
            <h3>{homeCopy.panels.survival.title}</h3>
          </div>
        </div>
        {survivalRows.length === 0 ? (
          <EmptyState text={homeCopy.emptyStates.survival} />
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

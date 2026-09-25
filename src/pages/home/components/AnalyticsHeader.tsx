import { homeCopy } from '../copy';
import { formatDateTime } from '../formatters';

interface AnalyticsHeaderProps {
  generatedAt: string;
  loadMessage: string;
  service: string;
  source: 'fixture' | 'api';
}

export default function AnalyticsHeader({
  generatedAt,
  loadMessage,
  service,
  source,
}: AnalyticsHeaderProps) {
  return (
    <section className="analyticsHeader">
      <div className="analyticsHeader__copy">
        <span className="analyticsHeader__eyebrow">{homeCopy.header.eyebrow}</span>
        <h2>{homeCopy.header.title}</h2>
        <p>
          {service} · gerado em {formatDateTime(generatedAt)}
        </p>
      </div>
      <div className={`sourceBadge ${source}`}>
        <span>{homeCopy.header.source}</span>
        <strong>
          {source === 'api' ? homeCopy.source.api : homeCopy.source.fixture}
        </strong>
        <small>{loadMessage}</small>
      </div>
    </section>
  );
}

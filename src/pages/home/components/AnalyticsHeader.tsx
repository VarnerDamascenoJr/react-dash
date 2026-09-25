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
        <span className="analyticsHeader__eyebrow">Sales Event Analytics</span>
        <h2>Coleta operacional pronta para analise.</h2>
        <p>
          {service} · gerado em {formatDateTime(generatedAt)}
        </p>
      </div>
      <div className={`sourceBadge ${source}`}>
        <span>Fonte</span>
        <strong>{source === 'api' ? 'API local' : 'Fixture local'}</strong>
        <small>{loadMessage}</small>
      </div>
    </section>
  );
}

import type { InsightPanelsProps } from '../home.types';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAnalyticsFormatters } from '../useAnalyticsFormatters';
import SectionPanel from '../../../components/common/layout/SectionPanel';
import MetricList from '../../../components/common/data-display/MetricList';

export default function InsightPanels({
  funnelId,
  funnelRows,
  survivalId,
  survivalRows,
}: InsightPanelsProps) {
  const { t } = useTranslation('home');
  const { formatPercent, formatSeconds } = useAnalyticsFormatters();
  return (
    <Box className="insightGrid" component="section">
      <SectionPanel
        eyebrow={t('panels.funnel.eyebrow')}
        id={funnelId}
        title={t('panels.funnel.title')}
      >
        <MetricList
          emptyText={t('emptyStates.funnel')}
          items={funnelRows.slice(0, 5).map((row) => ({
            id: row.id,
            label: `${row.from} -> ${row.to}`,
            value: formatPercent(row.conversionProbability),
          }))}
        />
      </SectionPanel>

      <SectionPanel
        eyebrow={t('panels.survival.eyebrow')}
        id={survivalId}
        title={t('panels.survival.title')}
      >
        <MetricList
          emptyText={t('emptyStates.survival')}
          items={survivalRows.map((row) => ({
            id: row.id,
            label: row.eventName,
            value: formatSeconds(row.p50Seconds),
          }))}
        />
      </SectionPanel>
    </Box>
  );
}

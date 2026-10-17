import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import type { FunnelStepRow, SurvivalSummaryRow } from '../../../analytics';
import { useTranslation } from 'react-i18next';
import { useAnalyticsFormatters } from '../useAnalyticsFormatters';
import AnalyticsPanel from './AnalyticsPanel';

interface InsightPanelsProps {
  funnelId?: string;
  funnelRows: FunnelStepRow[];
  survivalId?: string;
  survivalRows: SurvivalSummaryRow[];
}

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
      <AnalyticsPanel
        eyebrow={t('panels.funnel.eyebrow')}
        id={funnelId}
        title={t('panels.funnel.title')}
      >
        {funnelRows.length === 0 ? (
          <EmptyState text={t('emptyStates.funnel')} />
        ) : (
          <List className="metricList" disablePadding>
            {funnelRows.slice(0, 5).map((row) => (
              <ListItem disableGutters key={row.id}>
                <ListItemText
                  primary={
                    <Typography component="span" variant="body2">
                      {row.from} -&gt; {row.to}
                    </Typography>
                  }
                />
                <Typography component="strong" variant="subtitle1">
                  {formatPercent(row.conversionProbability)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </AnalyticsPanel>

      <AnalyticsPanel
        eyebrow={t('panels.survival.eyebrow')}
        id={survivalId}
        title={t('panels.survival.title')}
      >
        {survivalRows.length === 0 ? (
          <EmptyState text={t('emptyStates.survival')} />
        ) : (
          <List className="metricList" disablePadding>
            {survivalRows.map((row) => (
              <ListItem disableGutters key={row.id}>
                <ListItemText
                  primary={
                    <Typography component="span" variant="body2">
                      {row.eventName}
                    </Typography>
                  }
                />
                <Typography component="strong" variant="subtitle1">
                  {formatSeconds(row.p50Seconds)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </AnalyticsPanel>
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Box className="emptyState">
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}

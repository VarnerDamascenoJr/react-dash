import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import type { FunnelStepRow, SurvivalSummaryRow } from '../../../analytics';
import { homeCopy } from '../copy';
import { formatPercent, formatSeconds } from '../formatters';
import AnalyticsPanel from './AnalyticsPanel';

interface InsightPanelsProps {
  funnelRows: FunnelStepRow[];
  survivalRows: SurvivalSummaryRow[];
}

export default function InsightPanels({
  funnelRows,
  survivalRows,
}: InsightPanelsProps) {
  return (
    <Box className="insightGrid" component="section">
      <AnalyticsPanel
        eyebrow={homeCopy.panels.funnel.eyebrow}
        title={homeCopy.panels.funnel.title}
      >
        {funnelRows.length === 0 ? (
          <EmptyState text={homeCopy.emptyStates.funnel} />
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
        eyebrow={homeCopy.panels.survival.eyebrow}
        title={homeCopy.panels.survival.title}
      >
        {survivalRows.length === 0 ? (
          <EmptyState text={homeCopy.emptyStates.survival} />
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

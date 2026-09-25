import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
    <Box className="insightGrid" component="section">
      <Paper className="panel" component="article" elevation={0}>
        <Stack className="panelHeader" direction="row">
          <Box>
            <Typography component="span" variant="overline">
              {homeCopy.panels.funnel.eyebrow}
            </Typography>
            <Typography component="h3" variant="h6">
              {homeCopy.panels.funnel.title}
            </Typography>
          </Box>
        </Stack>
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
      </Paper>

      <Paper className="panel" component="article" elevation={0}>
        <Stack className="panelHeader" direction="row">
          <Box>
            <Typography component="span" variant="overline">
              {homeCopy.panels.survival.eyebrow}
            </Typography>
            <Typography component="h3" variant="h6">
              {homeCopy.panels.survival.title}
            </Typography>
          </Box>
        </Stack>
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
      </Paper>
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

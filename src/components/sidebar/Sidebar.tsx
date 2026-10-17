import './sidebar.scss';
import {
  Box,
  List,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import { useTranslation } from 'react-i18next';
import SidebarNavSection from './SidebarNavSection';
import { homeSectionHrefs } from '../../pages/home/sections';

const Sidebar = () => {
  const { t } = useTranslation('shell');
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);
  const navSections = [
    {
      title: t('sidebar.sections.overview'),
      items: [
        {
          end: true,
          icon: <DashboardIcon className="icon" />,
          label: t('sidebar.items.overview'),
          to: homeSectionHrefs.overview,
        },
      ],
    },
    {
      title: t('sidebar.sections.analytics'),
      items: [
        {
          icon: <EventNoteOutlinedIcon className="icon" />,
          label: t('sidebar.items.events'),
          to: homeSectionHrefs.events,
        },
        {
          icon: <FilterAltOutlinedIcon className="icon" />,
          label: t('sidebar.items.funnel'),
          to: homeSectionHrefs.funnel,
        },
        {
          icon: <TimelineOutlinedIcon className="icon" />,
          label: t('sidebar.items.survival'),
          to: homeSectionHrefs.survival,
        },
      ],
    },
    {
      title: t('sidebar.sections.outputs'),
      items: [
        {
          icon: <AssessmentIcon className="icon" />,
          label: t('sidebar.items.windows'),
          to: homeSectionHrefs.windows,
        },
        {
          icon: <FileDownloadOutlinedIcon className="icon" />,
          label: t('sidebar.items.exports'),
          to: homeSectionHrefs.exports,
        },
        {
          icon: <SettingsApplicationsIcon className="icon" />,
          label: t('sidebar.items.settings'),
          to: homeSectionHrefs.settings,
        },
      ],
    },
    {
      title: t('sidebar.sections.account'),
      items: [
        {
          icon: <AccountCircleOutlinedIcon className="icon" />,
          label: t('sidebar.items.profile'),
        },
        {
          className: 'logoutItem',
          icon: <ExitToAppOutlinedIcon className="icon" />,
          label: t('sidebar.items.logout'),
          onClick: logout,
        },
      ],
    },
  ];

  return (
    <Box className="sidebar" component="aside">
      <Box className="top">
        <NavLink to="/" className="brand">
          <Box className="brandMark">{t('brand.mark')}</Box>
          <Stack className="brandText">
            <Typography component="strong">{t('brand.name')}</Typography>
            <Typography component="span">{t('brand.subtitle')}</Typography>
          </Stack>
        </NavLink>
      </Box>
      <Stack className="center">
        <Paper className="workspaceCard" elevation={0}>
          <Typography
            className="workspaceLabel"
            component="span"
            variant="overline"
          >
            {t('sidebar.signedInAs')}
          </Typography>
          <Typography component="strong">{user?.name}</Typography>
          <Typography component="span">{user?.role}</Typography>
        </Paper>
        <List disablePadding>
          {navSections.map((section) => (
            <SidebarNavSection
              items={section.items}
              key={section.title}
              title={section.title}
            />
          ))}
        </List>
      </Stack>
      <Box className="bottom">
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={darkMode ? 'dark' : 'light'}
        >
          <ToggleButton
            className="themeToggle"
            value="light"
            onClick={() => dispatch({ type: 'LIGHT' })}
          >
            {t('sidebar.theme.light')}
          </ToggleButton>
          <ToggleButton
            className="themeToggle"
            value="dark"
            onClick={() => dispatch({ type: 'DARK' })}
          >
            {t('sidebar.theme.dark')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default Sidebar;

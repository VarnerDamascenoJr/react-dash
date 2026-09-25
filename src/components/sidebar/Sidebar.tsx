import './sidebar.scss';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
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
import { shellCopy } from '../layout/shellCopy';
import SidebarNavSection from './SidebarNavSection';

const Sidebar = () => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);
  const navSections = [
    {
      title: shellCopy.sidebar.sections.overview,
      items: [
        {
          end: true,
          icon: <DashboardIcon className="icon" />,
          label: shellCopy.sidebar.items.overview,
          to: '/',
        },
      ],
    },
    {
      title: shellCopy.sidebar.sections.analytics,
      items: [
        {
          icon: <EventNoteOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.events,
        },
        {
          icon: <FilterAltOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.funnel,
        },
        {
          icon: <TimelineOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.survival,
        },
      ],
    },
    {
      title: shellCopy.sidebar.sections.outputs,
      items: [
        {
          icon: <AssessmentIcon className="icon" />,
          label: shellCopy.sidebar.items.windows,
        },
        {
          icon: <FileDownloadOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.exports,
        },
        {
          icon: <SettingsApplicationsIcon className="icon" />,
          label: shellCopy.sidebar.items.settings,
        },
      ],
    },
    {
      title: shellCopy.sidebar.sections.account,
      items: [
        {
          icon: <AccountCircleOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.profile,
        },
        {
          className: 'logoutItem',
          icon: <ExitToAppOutlinedIcon className="icon" />,
          label: shellCopy.sidebar.items.logout,
          onClick: logout,
        },
      ],
    },
  ];

  return (
    <Box className="sidebar" component="aside">
      <Box className="top">
        <NavLink to="/" className="brand">
          <Box className="brandMark">{shellCopy.brand.mark}</Box>
          <Stack className="brandText">
            <Typography component="strong">{shellCopy.brand.name}</Typography>
            <Typography component="span">{shellCopy.brand.subtitle}</Typography>
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
            {shellCopy.sidebar.signedInAs}
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
            {shellCopy.sidebar.theme.light}
          </ToggleButton>
          <ToggleButton
            className="themeToggle"
            value="dark"
            onClick={() => dispatch({ type: 'DARK' })}
          >
            {shellCopy.sidebar.theme.dark}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default Sidebar;

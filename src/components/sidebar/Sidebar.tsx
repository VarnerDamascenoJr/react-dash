import './sidebar.scss';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
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

const Sidebar = () => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);

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
          <ListSubheader className="title" component="div" disableSticky>
            {shellCopy.sidebar.sections.overview}
          </ListSubheader>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
          >
            <ListItemButton className="navItemButton" component="span">
              <ListItemIcon>
                <DashboardIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary={shellCopy.sidebar.items.overview} />
            </ListItemButton>
          </NavLink>

          <ListSubheader className="title" component="div" disableSticky>
            {shellCopy.sidebar.sections.analytics}
          </ListSubheader>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <EventNoteOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.events} />
          </ListItemButton>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <FilterAltOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.funnel} />
          </ListItemButton>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <TimelineOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.survival} />
          </ListItemButton>

          <ListSubheader className="title" component="div" disableSticky>
            {shellCopy.sidebar.sections.outputs}
          </ListSubheader>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <AssessmentIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.windows} />
          </ListItemButton>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <FileDownloadOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.exports} />
          </ListItemButton>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <SettingsApplicationsIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.settings} />
          </ListItemButton>

          <ListSubheader className="title" component="div" disableSticky>
            {shellCopy.sidebar.sections.account}
          </ListSubheader>
          <ListItemButton className="navStatic" component="div">
            <ListItemIcon>
              <AccountCircleOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.profile} />
          </ListItemButton>
          <ListItemButton className="navStatic logoutItem" onClick={logout}>
            <ListItemIcon>
              <ExitToAppOutlinedIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={shellCopy.sidebar.items.logout} />
          </ListItemButton>
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

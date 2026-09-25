import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import './navbar.scss';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import { shellCopy } from '../layout/shellCopy';

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <Box className="navbar" component="header">
      <Paper className="wrapper" elevation={0}>
        <Box className="heading">
          <Typography className="eyebrow" component="span" variant="overline">
            {shellCopy.navbar.eyebrow}
          </Typography>
          <Typography component="h1" variant="h4">
            {shellCopy.navbar.title}
          </Typography>
        </Box>
        <Stack className="items" direction="row">
          <Box className="search">
            <InputBase
              fullWidth
              placeholder={shellCopy.navbar.searchPlaceholder}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlinedIcon className="icon" />
                </InputAdornment>
              }
            />
          </Box>
          <Chip
            className="pill"
            icon={<CalendarMonthOutlinedIcon className="icon" />}
            label={shellCopy.navbar.demoWindow}
          />
          <Tooltip title={shellCopy.navbar.toggleTheme}>
            <IconButton
              aria-label={shellCopy.navbar.toggleTheme}
              className="iconButton"
              onClick={() => dispatch({ type: 'TOGGLE' })}
            >
              <DarkModeOutlinedIcon className="icon" />
            </IconButton>
          </Tooltip>
          <Tooltip title={shellCopy.navbar.notifications}>
            <IconButton
              aria-label={shellCopy.navbar.notifications}
              className="iconButton"
            >
              <NotificationsNoneOutlinedIcon className="icon" />
            </IconButton>
          </Tooltip>
          <Tooltip title={shellCopy.navbar.messages}>
            <IconButton
              aria-label={shellCopy.navbar.messages}
              className="iconButton"
            >
              <ChatBubbleOutlineOutlinedIcon className="icon" />
            </IconButton>
          </Tooltip>
          <Paper className="profileCard" elevation={0}>
            <Avatar
              alt={user?.name}
              className="avatar"
              src={user?.avatar}
            />
            <Stack className="profileCopy">
              <Typography component="strong">{user?.name}</Typography>
              <Typography component="span">{user?.role}</Typography>
            </Stack>
          </Paper>
          <Button
            className="logoutButton"
            onClick={logout}
            startIcon={<LogoutOutlinedIcon className="icon" />}
            type="button"
            variant="outlined"
          >
            {shellCopy.navbar.signOut}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Navbar;

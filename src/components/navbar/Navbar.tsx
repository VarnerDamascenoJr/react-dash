import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import './navbar.scss';
import LanguageSelector from '../common/LanguageSelector';
import TooltipIconButton from '../common/TooltipIconButton';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation('shell');
  const { dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <Box className="navbar" component="header">
      <Paper className="wrapper" elevation={0}>
        <Box className="heading">
          <Typography className="eyebrow" component="span" variant="overline">
            {t('navbar.eyebrow')}
          </Typography>
          <Typography component="h1" variant="h4">
            {t('navbar.title')}
          </Typography>
        </Box>
        <Stack className="items" direction="row">
          <LanguageSelector />
          <Box className="search">
            <InputBase
              inputProps={{ 'aria-label': t('navbar.searchLabel') }}
              fullWidth
              placeholder={t('navbar.searchPlaceholder')}
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
            label={t('navbar.demoWindow')}
          />
          <TooltipIconButton
            label={t('navbar.toggleTheme')}
            className="iconButton"
            onClick={() => dispatch({ type: 'TOGGLE' })}
          >
            <DarkModeOutlinedIcon className="icon" />
          </TooltipIconButton>
          <TooltipIconButton label={t('navbar.notifications')} className="iconButton">
            <NotificationsNoneOutlinedIcon className="icon" />
          </TooltipIconButton>
          <TooltipIconButton label={t('navbar.messages')} className="iconButton">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
          </TooltipIconButton>
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
            {t('navbar.signOut')}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Navbar;

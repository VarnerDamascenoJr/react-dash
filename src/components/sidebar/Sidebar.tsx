import './sidebar.scss';
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

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" className="brand">
          <span className="brandMark">RD</span>
          <div className="brandText">
            <strong>React Dash</strong>
            <span>Sales analytics</span>
          </div>
        </NavLink>
      </div>
      <div className="center">
        <div className="workspaceCard">
          <span className="workspaceLabel">Signed in as</span>
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
        <ul>
          <p className="title">Overview</p>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
          >
            <DashboardIcon className="icon" />
            <span>Overview</span>
          </NavLink>

          <p className="title">Analytics</p>
          <li className="navStatic">
            <EventNoteOutlinedIcon className="icon" />
            <span>Eventos</span>
          </li>
          <li className="navStatic">
            <FilterAltOutlinedIcon className="icon" />
            <span>Funil</span>
          </li>
          <li className="navStatic">
            <TimelineOutlinedIcon className="icon" />
            <span>Sobrevivencia</span>
          </li>

          <p className="title">Outputs</p>
          <li className="navStatic">
            <AssessmentIcon className="icon" />
            <span>Janelas</span>
          </li>
          <li className="navStatic">
            <FileDownloadOutlinedIcon className="icon" />
            <span>Exportacoes</span>
          </li>
          <li className="navStatic">
            <SettingsApplicationsIcon className="icon" />
            <span>Configuracao</span>
          </li>

          <p className="title">Account</p>
          <li className="navStatic">
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li className="navStatic logoutItem" onClick={logout}>
            <ExitToAppOutlinedIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <button
          type="button"
          className="themeToggle"
          onClick={() => dispatch({ type: 'LIGHT' })}
        >
          Light
        </button>
        <button
          type="button"
          className="themeToggle"
          onClick={() => dispatch({ type: 'DARK' })}
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

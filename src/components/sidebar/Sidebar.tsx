import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import PsychologyOutlinedIcond from '@mui/icons-material/PsychologyOutlined';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
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
            <span>Ops command center</span>
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
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
          >
            <PersonOutlineOutlinedIcon className="icon" />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
          >
            <StoreOutlinedIcon className="icon" />
            <span>Products</span>
          </NavLink>

          <p className="title">Operations</p>
          <li className="navStatic">
            <CreditCardOutlinedIcon className="icon" />
            <span>Orders</span>
          </li>
          <li className="navStatic">
            <LocalShippingOutlinedIcon className="icon" />
            <span>Delivery</span>
          </li>
          <li className="navStatic">
            <AutoGraphOutlinedIcon className="icon" />
            <span>Growth</span>
          </li>

          <p className="title">System</p>
          <li className="navStatic">
            <AssessmentIcon className="icon" />
            <span>Reporting</span>
          </li>
          <li className="navStatic">
            <NotificationsOutlinedIcon className="icon" />
            <span>Notifications</span>
          </li>
          <li className="navStatic">
            <MonitorHeartOutlinedIcon className="icon" />
            <span>Health</span>
          </li>
          <li className="navStatic">
            <PsychologyOutlinedIcond className="icon" />
            <span>Logs</span>
          </li>
          <li className="navStatic">
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
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

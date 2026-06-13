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

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="heading">
          <span className="eyebrow">Executive snapshot</span>
          <h1>Control room</h1>
        </div>
        <div className="items">
          <div className="search">
            <SearchOutlinedIcon />
            <input type="text" placeholder="Search KPIs, people or products" />
          </div>
          <div className="pill">
            <CalendarMonthOutlinedIcon className="icon" />
            <span>May 31, 2026</span>
          </div>
          <button
            type="button"
            className="iconButton"
            onClick={() => dispatch({ type: 'TOGGLE' })}
            aria-label="Toggle theme"
          >
            <DarkModeOutlinedIcon className="icon" />
          </button>
          <div className="iconButton badgeButton">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">3</div>
          </div>
          <div className="iconButton badgeButton">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">5</div>
          </div>
          <div className="profileCard">
            <img src={user?.avatar} alt={user?.name} className="avatar" />
            <div className="profileCopy">
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
          <button type="button" className="logoutButton" onClick={logout}>
            <LogoutOutlinedIcon className="icon" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

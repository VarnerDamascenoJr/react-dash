import './sidebar.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon  from '@mui/icons-material/PersonOutlineOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import CreditCardOutlinedIcon  from '@mui/icons-material/CreditCardOutlined';
import LocalShippingOutlinedIcon  from '@mui/icons-material/LocalShippingOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import PsychologyOutlinedIcond from '@mui/icons-material/PsychologyOutlined';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import {Link} from "react-router-dom"
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';


const Sidebar = ()=>{

    const {dispatch} = useContext(DarkModeContext)
    return(
        <div className="sidebar">
            <div className="top">
                <Link to='/' style={{textDecoration:"none"}}>
                    <span className='logo' >Admin</span>
                </Link>
            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="title">Main</p>
                    <li>
                        <DashboardIcon className='icon' />
                        <span>Dashboard</span>
                    </li>
                    <p className="title">Lists</p>

                    <Link to='/users' style={{textDecoration:"none"}}>
                        <li>
                            <PersonOutlineOutlinedIcon className='icon'/>
                            <span>Users</span>
                        </li>
                    </Link>
                    <Link to='/products' style={{textDecoration:"none"}}>
                        <li>
                            <StoreOutlinedIcon className='icon'/>
                            <span>Products</span>
                        </li>
                    </Link>
                    
                    <li>
                        <CreditCardOutlinedIcon className='icon'/>
                        <span>Orders</span>
                    </li>
                    <li>
                        <LocalShippingOutlinedIcon className='icon'/>
                        <span>Delivery</span>
                    </li>
                    <p className="title">Useful</p>
                    <li>
                        <AssessmentIcon className='icon'/>
                        <span>Stats</span>
                    </li>
                    <li>
                        <NotificationsOutlinedIcon className='icon'/>
                        <span>Notifications</span>
                    </li>
                    <p className="title">Service</p>
                    <li>
                        <MonitorHeartOutlinedIcon className='icon'/>
                        <span>System Health</span>
                    </li>
                    <li>
                        <PsychologyOutlinedIcond className='icon'/>
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsApplicationsIcon className='icon'/>
                        <span>Settings</span>
                    </li>
                    <p className="title">User</p>
                    <li>
                        <AccountCircleOutlinedIcon className='icon'/>
                        <span>Profile</span>
                    </li>
                    <li>
                        <ExitToAppOutlinedIcon className='icon'/>
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={()=>dispatch({type:"LIGHT"})}></div>
                <div className="colorOption"onClick={()=>dispatch({type:"DARK"})}></div>
            </div>
        </div>
    )
}

export default Sidebar;
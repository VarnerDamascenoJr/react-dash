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
const Sidebar = ()=>{
    return(
        <div className="sidebar">
            <div className="top">
                <span className='logo' >Admin</span>
            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="title">Main</p>
                    <li>
                        <DashboardIcon className='icon' />
                        <span>Dash</span>
                    </li>
                    <p className="title">Lists</p>
                    <li>
                        <PersonOutlineOutlinedIcon className='icon'/>
                        <span>Users</span>
                    </li>
                    <li>
                        <StoreOutlinedIcon className='icon'/>
                        <span>Products</span>
                    </li>
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
                <div className="colorOption"></div>
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    )
}

export default Sidebar;
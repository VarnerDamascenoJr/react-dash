import './sidebar.scss'
import DashboardIcon from '@mui/icons-material/Dashboard';
import {PersonOutlineOutlinedIcon as UserIcon} from '@mui/icons-material/PersonOutlineOutlined';
import {StoreOutlinedIcon as ProductsIcon} from '@mui/icons-material/StoreOutlined';
import {CreditCardOutlinedIcon as CreditCardIcon} from '@mui/icons-material/CreditCardOutlined';
import {LocalShippingOutlinedIcon as DeliveryIcon} from '@mui/icons-material/LocalShippingOutlined';
import {AssessmentIcon as StatsIcon} from '@mui/icons-material/Assessment';
import {NotificationsOutlinedIcon as NotificationsIcon} from '@mui/icons-material/NotificationsOutlined';
import {MonitorHeartOutlinedIcon as HealthIcon} from '@mui/icons-material/MonitorHeartOutlined';
import {PsychologyOutlinedIcond as LogsIcon} from '@mui/icons-material/PsychologyOutlined';
import {SettingsApplicationsIcon as SettingsIcon} from '@mui/icons-material/SettingsApplications';
import {AccountCircleOutlinedIcon as ProfileIcon} from '@mui/icons-material/AccountCircleOutlined';
import {ExitToAppOutlinedIcon as LogoutIcon} from '@mui/icons-material/ExitToAppOutlined';
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
                        <UserIcon className='icon'/>
                        <span>Users</span>
                    </li>
                    <li>
                        <ProductsIcon className='icon'/>
                        <span>Products</span>
                    </li>
                    <li>
                        <CreditCardIcon className='icon'/>
                        <span>Orders</span>
                    </li>
                    <li>
                        <DeliveryIcon className='icon'/>
                        <span>Delivery</span>
                    </li>
                    <p className="title">Useful</p>
                    <li>
                        <StatsIcon className='icon'/>
                        <span>Stats</span>
                    </li>
                    <li>
                        <NotificationsIcon className='icon'/>
                        <span>Notifications</span>
                    </li>
                    <p className="title">Service</p>
                    <li>
                        <HealthIcon className='icon'/>
                        <span>System Health</span>
                    </li>
                    <li>
                        <LogsIcon className='icon'/>
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsIcon className='icon'/>
                        <span>Settings</span>
                    </li>
                    <p className="title">User</p>
                    <li>
                        <ProfileIcon className='icon'/>
                        <span>Profile</span>
                    </li>
                    <li>
                        <LogoutIcon className='icon'/>
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
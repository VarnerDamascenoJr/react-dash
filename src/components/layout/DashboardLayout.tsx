import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import './dashboardLayout.scss';

const DashboardLayout = () => {
  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="dashboardLayout__main">
        <Navbar />
        <div className="dashboardLayout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

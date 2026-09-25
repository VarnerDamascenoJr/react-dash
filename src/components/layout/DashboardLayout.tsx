import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import './dashboardLayout.scss';

const DashboardLayout = () => {
  return (
    <Box className="dashboardLayout">
      <Sidebar />
      <Box className="dashboardLayout__main" component="main">
        <Navbar />
        <Box className="dashboardLayout__content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

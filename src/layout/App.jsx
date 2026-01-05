import React, { useEffect } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
// import { getAdminLoginStatus, getAdmin, AdminLogout } from '../redux/features/Admin/adminSlice';
import { ToastContainer } from 'react-toastify';
import theme from '../themes';
import Routes from '../routes/index';
import NavigationScroll from './NavigationScroll';

// Import for DatePicker support
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getTeamLoginStatus, getTeam, TeamLogout } from '../redux/features/Team/TeamSlice';
// import { getTeam, getTeamLoginStatus, TeamLogout } from '../redux/features/Team/TeamSlice';

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const { isLoggedIn, Team } = useSelector((state) => state.team);

  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('access_token');
      const expiry = localStorage.getItem('token_expiry');
      const isValidToken = token && expiry && Date.now() < parseInt(expiry, 10);

      if (!isValidToken) {
        console.warn('No valid token. Skipping session check.');
        dispatch(TeamLogout());
        return;
      }

      try {
        const status = await dispatch(getTeamLoginStatus()).unwrap();
        console.log('Login status:', status);

        if (status && !Team) {
          await dispatch(getTeam()).unwrap();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        dispatch(TeamLogout());
      }
    };

    initSession();
  }, [dispatch]);

  return (
    <NavigationScroll>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme(customization)}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <Routes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </NavigationScroll>
  );
};

export default App;

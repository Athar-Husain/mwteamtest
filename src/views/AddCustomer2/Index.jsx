import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, alpha, useTheme } from '@mui/material';
import { PersonAddTwoTone as NewIcon, GroupAddTwoTone as ExistingIcon } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// We will create these next
import NewCustomerWizard from './NewCustomer/NewCustomerWizard';
import ExistingCustomerWizard from './ExistingCustomer/ExistingCustomerWizard';
// import ExistingCustomerWizard from './ExistingCustomer/ExistingCustomer';

const AddCustomer = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-1px' }}>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Register a new client or expand services for existing subscribers.
        </Typography>
      </Box>

      {/* MODERN TAB NAVIGATION */}
      <Paper
        elevation={0}
        sx={{
          p: 0.5,
          mb: 4,
          borderRadius: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              borderRadius: 3,
              minHeight: 48,
              fontWeight: 700,
              textTransform: 'none',
              transition: 'all 0.2s',
              '&.Mui-selected': {
                bgcolor: '#fff',
                color: theme.palette.primary.main,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }
            }
          }}
        >
          <Tab icon={<NewIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="New Customer" />
          <Tab icon={<ExistingIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Existing Customer" />
        </Tabs>
      </Paper>

      {/* DYNAMIC CONTENT AREA */}
      <Box sx={{ width: '100%', minHeight: '500px' }}>{tabIndex === 0 ? <NewCustomerWizard /> : <ExistingCustomerWizard />}</Box>

      {/* GLOBAL NOTIFICATIONS */}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" toastStyle={{ borderRadius: '12px', fontWeight: 600 }} />
    </Container>
  );
};

export default AddCustomer;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Typography, Paper, InputAdornment, alpha, useTheme, CircularProgress } from '@mui/material';
import {
  PersonOutline as NameIcon,
  EmailOutlined as EmailIcon,
  PhoneIphoneOutlined as PhoneIcon,
  LockOutlined as LockIcon
} from '@mui/icons-material';
import { registerCustomer } from '../../../redux/features/Customers/CustomerSlice';

const Step1_Profile = ({ onNext }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.customer);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(registerCustomer(data)).unwrap();
      // result should contain the new customer object { id, firstName, etc }
      onNext(result);
    } catch (error) {
      // Toast is handled in the Slice or Parent
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Basic Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step 1: Create the customer account
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName', { required: 'Required' })}
              error={!!errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NameIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Last Name" {...register('lastName', { required: 'Required' })} error={!!errors.lastName} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('email', { required: 'Required' })}
              error={!!errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              {...register('phone', { required: 'Required' })}
              error={!!errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Account Password"
              type="password"
              {...register('password', { required: 'Required' })}
              error={!!errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 4,
            py: 1.8,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Continue'}
        </Button>
      </form>
    </Paper>
  );
};

export default Step1_Profile;

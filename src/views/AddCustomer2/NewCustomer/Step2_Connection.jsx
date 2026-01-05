import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  FormHelperText
} from '@mui/material';
import {
  RouterOutlined as RouterIcon,
  SettingsInputComponentOutlined as STBIcon,
  MapOutlined as AreaIcon,
  PersonOutlined as PersonIcon,
  ArrowBackIosNew as BackIcon
} from '@mui/icons-material';
import { getAllServiceAreas } from '../../../redux/features/Area/AreaSlice';
import { createConnection } from '../../../redux/features/Connection/ConnectionSlice';

const Step2_Connection = ({ customer, onNext, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.area);
  const { isLoading } = useSelector((state) => state.connection);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      connectionType: 'Fiber',
      aliasName: 'Home'
    }
  });

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      // We inject the ID from Step 1 into the payload
      const payload = { ...data, customerId: customer.id };
      const result = await dispatch(createConnection(payload)).unwrap();
      // result.connection contains the newly created connection object
      onNext(result.connection);
    } catch (error) {
      // Error handled by Redux/Toast
    }
  };

  return (
    <Box>
      {/* COMPACT CUSTOMER CONTEXT CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="caption" fontWeight={800} color="info.main" sx={{ letterSpacing: 1 }}>
            ASSIGNING HARDWARE TO
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {customer?.firstName} {customer?.lastName}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>
            Hardware Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Step 2: Link STB and Box details
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Box ID"
                {...register('boxId', { required: 'Required' })}
                error={!!errors.boxId}
                helperText={errors.boxId?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="STB Number"
                {...register('stbNumber', { required: 'Required' })}
                error={!!errors.stbNumber}
                helperText={errors.stbNumber?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="User Name (PPPoE)"
                {...register('userName', { required: 'Required' })}
                error={!!errors.userName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.serviceArea}>
                <InputLabel>Service Area</InputLabel>
                <Select label="Service Area" defaultValue="" {...register('serviceArea', { required: 'Required' })}>
                  {areas.map((area) => (
                    <MenuItem key={area._id} value={area._id}>
                      {area.region}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.serviceArea?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Connection Type" {...register('connectionType')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Alias (e.g. Office, Home)" {...register('aliasName')} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<BackIcon sx={{ fontSize: 14 }} />}
              onClick={onBack}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {isLoading ? 'Provisioning...' : 'Provision Hardware'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Step2_Connection;

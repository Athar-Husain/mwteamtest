import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  MapOutlined as RegionIcon,
  DnsOutlined as StatusIcon,
  DescriptionOutlined as NotesIcon,
  ArrowBackIosNewRounded as BackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

import { getServiceAreaById } from '../../redux/features/Area/AreaSlice';

const RegionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // TEAM = VIEW ONLY
  const isView = true;

  const { area: selectedArea, isAreaLoading } = useSelector((state) => state.serviceArea || state.area || {});

  const { control, reset } = useForm({
    defaultValues: {
      region: '',
      description: '',
      networkStatus: 'Good',
      isActive: true
    }
  });

  // Fetch service area by ID
  useEffect(() => {
    if (id) {
      dispatch(getServiceAreaById(id));
    }
  }, [dispatch, id]);

  // Populate form once data is loaded
  useEffect(() => {
    if (selectedArea) {
      reset({
        region: selectedArea.region || '',
        description: selectedArea.description || '',
        networkStatus: selectedArea.networkStatus || 'Good',
        isActive: selectedArea.isActive ?? true
      });
    }
  }, [selectedArea, reset]);

  if (isAreaLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh'
        }}
      >
        <CircularProgress sx={{ color: '#4F46E5' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, mb: 6, px: 2 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<BackIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => navigate('/areas')}
          sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
        >
          Back to List
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
          bgcolor: '#FFFFFF'
        }}
      >
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} color="#1E1B4B" gutterBottom>
            Region Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Viewing assigned service area information.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        <Stack spacing={3.5}>
          {/* Region */}
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Region Identity"
                disabled={isView}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RegionIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  )
                }}
                sx={inputStyles(isView)}
              />
            )}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3
            }}
          >
            {/* Network Status */}
            <FormControl fullWidth disabled>
              <InputLabel>Network Health</InputLabel>
              <Controller
                name="networkStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Network Health"
                    startAdornment={<StatusIcon sx={{ mr: 1, ml: -0.5, color: 'text.disabled' }} />}
                    sx={{ borderRadius: 2.5 }}
                  >
                    <MenuItem value="Good">🟢 Stable (Good)</MenuItem>
                    <MenuItem value="Low">🟡 Degraded (Low)</MenuItem>
                    <MenuItem value="Moderate">🟠 Issues (Moderate)</MenuItem>
                    <MenuItem value="Down">🔴 Outage (Down)</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            {/* Active Status */}
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                px: 2,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} disabled color="success" />}
                    label={
                      <Typography variant="body2" fontWeight={600} color={field.value ? 'success.main' : 'text.disabled'}>
                        {field.value ? 'REGION ACTIVE' : 'REGION INACTIVE'}
                      </Typography>
                    }
                  />
                )}
              />
            </Paper>
          </Box>

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Technical Notes"
                disabled={isView}
                fullWidth
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <NotesIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  )
                }}
                sx={inputStyles(isView)}
              />
            )}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

// Input styles
const inputStyles = (isView) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    bgcolor: isView ? '#F8FAFC' : '#fff',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' }
  }
});

export default RegionForm;

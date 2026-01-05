import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
  alpha,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  VisibilityOutlined as VisibilityIcon,
  CellTowerRounded as NetworkIcon,
  CheckCircleRounded as ActiveIcon,
  ErrorOutlineRounded as InactiveIcon,
  PeopleOutlineRounded as CustomerIcon,
  BuildCircleOutlined as MaintenanceIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getMyAreasTeam } from '../../redux/features/Area/AreaSlice';

const RegionList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safety fallbacks for theme colors
  const colors = {
    primary: theme.palette?.primary?.main || '#4318FF',
    success: theme.palette?.success?.main || '#05CD99',
    error: theme.palette?.error?.main || '#EE5D50',
    warning: theme.palette?.warning?.main || '#FFB800',
    info: theme.palette?.info?.main || '#01B574',
    grey: theme.palette?.grey?.[400] || '#A3AED0'
  };

  const { areas = [], isAreaLoading } = useSelector((state) => state.serviceArea || state.area || {});

  useEffect(() => {
    dispatch(getMyAreasTeam());
  }, [dispatch]);

  const activeAreasCount = areas.filter((a) => a.isActive).length;
  const criticalAreasCount = areas.filter((a) => a.networkStatus === 'Down').length;

  const columns = [
    {
      field: 'region',
      headerName: 'Assigned Service Area',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
          <Box
            sx={{
              p: 1,
              bgcolor: alpha(colors.primary, 0.1),
              borderRadius: 1.5,
              display: 'flex'
            }}
          >
            <NetworkIcon sx={{ fontSize: 18, color: colors.primary }} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#1B2559">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row._id?.slice(-6).toUpperCase()}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'customers', // Assuming this field exists or can be derived
      headerName: 'Load',
      width: 140,
      renderCell: (params) => (
        <Stack spacing={0.5} sx={{ width: '100%', pr: 2 }}>
          <Typography variant="caption" fontWeight={700}>
            85% Capacity
          </Typography>
          <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 5, bgcolor: alpha(colors.primary, 0.1) }} />
        </Stack>
      )
    },
    {
      field: 'networkStatus',
      headerName: 'Signal Health',
      width: 160,
      renderCell: (params) => {
        const status = params.value || 'Good';
        const statusColors = {
          Good: colors.success,
          Low: colors.warning,
          Moderate: colors.info,
          Down: colors.error
        };
        return (
          <Chip
            label={status.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '10px',
              bgcolor: alpha(statusColors[status] || colors.success, 0.1),
              color: statusColors[status] || colors.success,
              border: '1px solid',
              borderColor: alpha(statusColors[status] || colors.success, 0.2)
            }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Operations',
      flex: 0.8,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ height: '100%' }}>
          <Tooltip title="Monitor Network">
            <IconButton
              size="small"
              onClick={() => navigate(`/areas/${params.row._id}/view`)}
              sx={{ color: 'primary.main', bgcolor: alpha(colors.primary, 0.05), borderRadius: '10px' }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log Maintenance">
            <IconButton size="small" sx={{ color: colors.warning, bgcolor: alpha(colors.warning, 0.05), borderRadius: '10px' }}>
              <MaintenanceIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fe', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559', letterSpacing: '-0.02em' }}>
            Network Regions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Real-time status of your assigned MW-Fibernet zones.
          </Typography>
        </Box>
        <Chip
          icon={<ActiveIcon sx={{ color: colors.success }} />}
          label="All Systems Operational"
          sx={{ bgcolor: '#fff', fontWeight: 700, p: 1, boxShadow: '0px 4px 12px rgba(0,0,0,0.03)' }}
        />
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="My Areas" value={areas.length} icon={<NetworkIcon />} color={colors.primary} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Active Signals" value={activeAreasCount} icon={<ActiveIcon />} color={colors.success} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Critical Failures"
            value={criticalAreasCount}
            icon={<InactiveIcon />}
            color={colors.error}
            isAlert={criticalAreasCount > 0}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          p: 2,
          bgcolor: '#fff',
          boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
          border: '1px solid #E9EDF7'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700} color="#1B2559">
            Regional Overview
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="Fiber" size="small" variant="outlined" sx={{ borderRadius: '6px' }} />
            <Chip label="On-Site" size="small" variant="outlined" sx={{ borderRadius: '6px' }} />
          </Stack>
        </Box>
        <DataGrid
          rows={areas.map((r) => ({ ...r, id: r._id || Math.random() }))}
          columns={columns}
          loading={isAreaLoading}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'transparent',
              borderBottom: `1px solid #F4F7FE`,
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, color: '#A3AED0', fontSize: '12px' }
            },
            '& .MuiDataGrid-cell': { borderBottom: `1px solid #F4F7FE`, color: '#1B2559', fontWeight: 500 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F4F7FE', cursor: 'pointer' }
          }}
        />
      </Paper>
    </Box>
  );
};

const SummaryCard = ({ title, value, icon, color, isAlert }) => (
  <Card
    sx={{
      borderRadius: '20px',
      boxShadow: 'none',
      border: isAlert ? `2px solid ${alpha(color, 0.5)}` : '1px solid #E9EDF7',
      animation: isAlert ? 'pulse 2s infinite' : 'none'
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: '24px !important' }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          bgcolor: alpha(color || '#000', 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2.5
        }}
      >
        {icon ? React.cloneElement(icon, { sx: { fontSize: 28 } }) : null}
      </Box>
      <Box>
        <Typography variant="caption" fontWeight={700} color="#A3AED0" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} color="#1B2559">
          {value}
        </Typography>
      </Box>
    </CardContent>
    <style>
      {`
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(238, 93, 80, 0); }
                100% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0); }
            }
        `}
    </style>
  </Card>
);

export default RegionList;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  InputAdornment,
  Avatar,
  Card,
  CardContent,
  Grid,
  TableContainer,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Redeem as RedeemIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { getMyReferrals } from '../../redux/features/Leads/LeadSlice';
import CreateLeadModal from './CreateLeadModal';

// import { getMyReferrals } from '@/features/lead/leadsSlice';

/* ============================
   Status Mapping (Lead Schema)
============================ */

const statusConfig = {
  new: { color: 'warning', icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />, label: 'Processing', bg: '#fff4e5' },
  contacted: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Contacted', bg: '#e0f2fe' },
  follow_up: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Follow Up', bg: '#e0f2fe' },
  converted: { color: 'success', icon: <RedeemIcon sx={{ fontSize: 16 }} />, label: 'Completed', bg: '#ecfdf5' },
  lost: { color: 'error', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Not Feasible', bg: '#fee2e2' }
};

/* ============================
   Component
============================ */

const ReferralHistory = () => {
  const dispatch = useDispatch();
  const { leads, isLeadLoading } = useSelector((state) => state.lead);

  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getMyReferrals());
  }, [dispatch]);

  /* ============================
     Filtered Data
  ============================ */

  const filteredReferrals = useMemo(() => {
    return leads
      .filter((l) => (filterStatus ? l.status === filterStatus : true))
      .filter((l) => [l.name, l.email, l.phone].some((v) => v && v.toLowerCase().includes(search.toLowerCase())));
  }, [leads, filterStatus, search]);

  /* ============================
     Stats
  ============================ */

  const stats = useMemo(() => {
    return [
      {
        label: 'Total Referrals',
        count: leads.length,
        color: 'primary.main',
        icon: <GroupIcon />
      },
      {
        label: 'In Progress',
        count: leads.filter((l) => ['new', 'contacted', 'follow_up'].includes(l.status)).length,
        color: 'warning.main',
        icon: <HourglassEmptyIcon />
      },
      {
        label: 'Converted',
        count: leads.filter((l) => l.status === 'converted').length,
        color: 'success.main',
        icon: <RedeemIcon />
      }
    ];
  }, [leads]);

  /* ============================
     Loading
  ============================ */

  if (isLeadLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={10}>
        <CircularProgress thickness={5} size={50} />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>Fetching referrals...</Typography>
      </Box>
    );
  }

  /* ============================
     UI
  ============================ */

  return (
    <Box sx={{ py: 2 }}>
      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: `${stat.color.split('.')[0]}.50`, color: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {stat.count}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }} variant="outlined">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.keys(statusConfig).map((s) => (
              <MenuItem key={s} value={s}>
                {statusConfig[s].label}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" color="secondary" onClick={() => setCreateModalOpen(true)}>
            Refer Customer
          </Button>
        </Stack>
      </Paper>

      {/* Table / Empty */}
      {filteredReferrals.length === 0 ? (
        <Box textAlign="center" py={8}>
          <GroupIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
          <Typography variant="h6" fontWeight={700}>
            No Referrals Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start referring customers to see them here.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Share Referral
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell>CONTACT</TableCell>
                <TableCell>PHONE</TableCell>
                <TableCell>CREATED</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReferrals.map((ref) => (
                <TableRow key={ref._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{ref.name?.[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={700}>{ref.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ref.email || '—'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{ref.phone}</TableCell>
                  <TableCell>{new Date(ref.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig[ref.status]?.icon}
                      label={statusConfig[ref.status]?.label}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        color: `${statusConfig[ref.status]?.color}.main`,
                        bgcolor: statusConfig[ref.status]?.bg
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateLeadModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};

export default ReferralHistory;

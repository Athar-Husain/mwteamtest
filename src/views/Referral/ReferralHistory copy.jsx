import React, { useEffect, useState, useMemo } from 'react';
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
  Divider,
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

// Mock data
const mockReferralHistory = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-1234', date: '2025-06-15', status: 'Registered' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1-555-5678', date: '2025-06-10', status: 'Pending' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1-555-8765', date: '2025-05-20', status: 'Rewarded' },
  { id: 4, name: 'Dana Lee', email: 'dana@example.com', phone: '+1-555-4321', date: '2025-04-30', status: 'Registered' }
];

const statusConfigold = {
  Pending: { color: 'warning', icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />, label: 'Waitlist', bg: '#fff4e5' },
  Registered: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Joined', bg: '#e0f2fe' },
  Rewarded: { color: 'success', icon: <RedeemIcon sx={{ fontSize: 16 }} />, label: 'Completed', bg: '#ecfdf5' }
};

const statusConfig = {
  new: { color: 'warning', icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />, label: 'Processing', bg: '#fff4e5' },
  contacted: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Contacted', bg: '#e0f2fe' },
  follow_up: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Follow Up', bg: '#e0f2fe' },
  converted: { color: 'success', icon: <RedeemIcon sx={{ fontSize: 16 }} />, label: 'Completed', bg: '#ecfdf5' },
  lost: { color: 'error', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Not Feasible', bg: '#fee2e2' }
};

const ReferralHistory = () => {
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReferrals(mockReferralHistory);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredReferrals = useMemo(() => {
    return referrals
      .filter((r) => (filterStatus ? r.status === filterStatus : true))
      .filter((r) => [r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  }, [referrals, filterStatus, search]);

  const stats = useMemo(() => {
    return [
      { label: 'Total Invitations', count: referrals.length, color: 'primary.main', icon: <GroupIcon /> },
      {
        label: 'Pending',
        count: referrals.filter((r) => r.status === 'Pending').length,
        color: 'warning.main',
        icon: <HourglassEmptyIcon />
      },
      { label: 'Successful', count: referrals.filter((r) => r.status === 'Rewarded').length, color: 'success.main', icon: <RedeemIcon /> }
    ];
  }, [referrals]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10}>
        <CircularProgress thickness={5} size={50} />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>Fetching history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* 1. Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }} key={index}>
            <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                <Avatar sx={{ bgcolor: `${stat.color.split('.')[0]}.50`, color: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
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

      {/* 2. Filters & Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search by name, email, or phone..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Registered">Registered</MenuItem>
            <MenuItem value="Rewarded">Rewarded</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* 3. Data Table */}
      {filteredReferrals.length === 0 ? (
        <Box textAlign="center" py={8}>
          <GroupIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
          <Typography variant="h6" fontWeight={700}>
            No Referrals Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            You haven't invited anyone yet. Start sharing your <br /> code to earn points and climb the tiers!
          </Typography>
          <Button variant="outlined" sx={{ mt: 2, borderRadius: 3 }}>
            View Share Options
          </Button>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflowX: 'scroll' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>JOINED DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReferrals.map((ref) => (
                <TableRow key={ref.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14, fontWeight: 700, bgcolor: 'primary.light' }}>
                        {ref.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {ref.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ref.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {ref.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(ref.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig[ref.status]?.icon}
                      label={statusConfig[ref.status]?.label}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        color: `${statusConfig[ref.status]?.color}.main`,
                        bgcolor: statusConfig[ref.status]?.bg,
                        border: '1px solid',
                        borderColor: `${statusConfig[ref.status]?.color}.light`,
                        borderRadius: 2
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReferralHistory;

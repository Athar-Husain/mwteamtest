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
  Card,
  Grid,
  Avatar,
  TableContainer
} from '@mui/material';
import {
  AddCircleOutline as EarnedIcon,
  RemoveCircleOutline as RedeemedIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon
} from '@mui/icons-material';

// Mock points data with Running Balance logic
const mockPointsHistory = [
  { id: 1, description: 'Referral: Alice Johnson', points: 100, type: 'Earned', date: '2025-06-15', balanceAfter: 300 },
  { id: 2, description: 'Referral: Charlie Davis', points: 150, type: 'Earned', date: '2025-05-20', balanceAfter: 200 },
  { id: 3, description: 'Gift Card Redemption', points: -200, type: 'Redeemed', date: '2025-05-05', balanceAfter: 50 },
  { id: 4, description: 'Referral Bonus', points: 50, type: 'Earned', date: '2024-04-30', balanceAfter: 250 }
];

const typeConfig = {
  Earned: {
    color: '#2e7d32',
    bg: '#e8f5e9',
    icon: <EarnedIcon sx={{ fontSize: 16 }} />,
    symbol: '+'
  },
  Redeemed: {
    color: '#d32f2f',
    bg: '#ffebee',
    icon: <RedeemedIcon sx={{ fontSize: 16 }} />,
    symbol: ''
  }
};

const PointsHistory = () => {
  const [points, setPoints] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPoints(mockPointsHistory);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredPoints = useMemo(() => {
    return points
      .filter((p) => (filterType ? p.type === filterType : true))
      .filter((p) => p.description.toLowerCase().includes(search.toLowerCase()));
  }, [points, filterType, search]);

  const stats = useMemo(() => {
    const earned = points.filter((p) => p.type === 'Earned').reduce((s, p) => s + p.points, 0);
    const redeemed = Math.abs(points.filter((p) => p.type === 'Redeemed').reduce((s, p) => s + p.points, 0));
    return { earned, redeemed, balance: earned - redeemed };
  }, [points]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={10}>
        <CircularProgress thickness={5} size={45} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading ledger...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
      {/* 1. Summary Scorecards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Current Balance', val: stats.balance, color: 'primary', icon: <WalletIcon /> },
          { label: 'Total Earned', val: stats.earned, color: 'success', icon: <TrendingUpIcon /> },
          { label: 'Total Redeemed', val: stats.redeemed, color: 'error', icon: <RedeemedIcon /> }
        ].map((item, idx) => (
          <Grid size={{ xs: 12, sm: 4 }} key={idx}>
            <Card variant="outlined" sx={{ borderRadius: 4, border: '1px solid #e0e6ed' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: `${item.color}.main`, mr: 2, width: 40, height: 40 }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {item.val} <small style={{ fontSize: '0.8rem' }}>PTS</small>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 2. Interactive Filter Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Search by description (e.g. Alice, Gift Card)..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          select
          size="small"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ minWidth: 180, bgcolor: 'white' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        >
          <MenuItem value="">All Transactions</MenuItem>
          <MenuItem value="Earned">Earned Only</MenuItem>
          <MenuItem value="Redeemed">Redeemed Only</MenuItem>
        </TextField>
      </Stack>

      {/* 3. The Ledger Table */}
      {filteredPoints.length === 0 ? (
        <Box textAlign="center" py={10}>
          <HistoryIcon sx={{ fontSize: 48, color: 'divider', mb: 2 }} />
          <Typography color="text.secondary">No transactions match your filters.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee', overflow: 'hidden' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>DESCRIPTION</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }} align="right">
                  AMOUNT
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }} align="right">
                  BALANCE
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }} align="center">
                  TYPE
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPoints.map((p) => {
                const config = typeConfig[p.type];
                return (
                  <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {p.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 800, color: config.color }}>
                        {config.symbol}
                        {p.points}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        {p.balanceAfter}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={config.icon}
                        label={p.type}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          color: config.color,
                          bgcolor: config.bg,
                          borderRadius: 1.5,
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PointsHistory;

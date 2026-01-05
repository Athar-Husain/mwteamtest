// screens/customer/CustomerReferralDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  EmojiEvents as TrophyIcon,
  GroupAdd as GroupIcon,
  Redeem as RedeemIcon,
  Stars as StarsIcon,
  Share as ShareIcon
} from '@mui/icons-material';
// import { fetchReferralData } from '../../store/slices/referralSlice';
// import { getAllLeads } from '../../redux/features/Leads/LeadSlice';
import ReferralHistory from './ReferralHistory';
import PointsHistory from './PointsHistory';
import RedeemDialog from './RedeemDialog';
import CreateLeadModal from './CreateLeadModal';

const CustomerReferralDashboard = () => {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.referral);
  // const { isLeadLoading } = useSelector((state) => state.lead);
  const dummyStats = {
    referralCode: 'FIBER-123',
    successfulReferrals: 4,
    availablePoints: 420,
    lifetimePoints: 860,
    totalReferrals: 7
  };
  const loading = false;
  const stats = dummyStats;
  const { Customer } = useSelector((state) => state.customer);
  // const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [openRedeem, setOpenRedeem] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  // useEffect(() => {
  //   // dispatch(fetchReferralData());
  //   dispatch(getAllLeads());
  // }, [dispatch]);

  const milestones = [
    { count: 5, bonus: 250 },
    { count: 10, bonus: 500 },
    { count: 25, bonus: 1000 }
  ];

  const tiers = [
    { name: 'Starter', req: 0, emoji: '⭐' },
    { name: 'Bronze', req: 1, emoji: '🥉' },
    { name: 'Silver', req: 3, emoji: '🥈' },
    { name: 'Gold', req: 6, emoji: '🥇' },
    { name: 'Platinum', req: 12, emoji: '💎' }
  ];

  const currentTier = tiers.reduce((acc, tier) => (stats.successfulReferrals >= tier.req ? tier : acc), tiers[0]);

  const copyCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    // Show toast
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Typography>Loading your rewards...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={800} mb={1}>
        Referral Rewards Center
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Share your code. Earn points. Get free internet upgrades!
      </Typography>

      {/* Hero Section */}
      <Grid container spacing={4} mb={5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 5,
              borderRadius: 5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Invite Friends & Earn Big
            </Typography>
            <Typography sx={{ opacity: 0.95, mb: 4 }}>
              Every successful connection earns you points. Redeem for bill credits or speed boosts!
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Paper
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  flexGrow: 1
                }}
              >
                <Typography variant="h5" fontWeight={800} letterSpacing={3}>
                  {stats.referralCode || 'FIBER-XXX'}
                </Typography>
              </Paper>
              <Button
                variant="contained"
                size="large"
                startIcon={<CopyIcon />}
                onClick={copyCode}
                sx={{ bgcolor: 'white', color: '#6366f1', fontWeight: 800 }}
              >
                Copy
              </Button>
              <Tooltip title="Share">
                <IconButton size="large" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
          <CreateLeadModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 5, textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
              <RedeemIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              Available Points
            </Typography>
            <Typography variant="h3" fontWeight={900} color="primary" my={1}>
              {stats.availablePoints}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Lifetime: {stats.lifetimePoints} pts
            </Typography>
            <Button fullWidth variant="contained" size="large" onClick={() => setOpenRedeem(true)} disabled={stats.availablePoints < 100}>
              Redeem Now
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Gamification Row */}
      <Grid container spacing={4} mb={5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', borderRadius: 5 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} mb={3} display="flex" alignItems="center">
                <TrophyIcon sx={{ mr: 1, color: 'orange' }} /> Milestone Bonuses
              </Typography>
              {milestones.map((m) => (
                <Box key={m.count} mb={3}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography fontWeight={700}>{m.count} Successful Referrals</Typography>
                    <Typography color="primary" fontWeight={800}>
                      +{m.bonus} pts
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((stats.successfulReferrals / m.count) * 100, 100)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', borderRadius: 5 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} mb={3} display="flex" alignItems="center">
                <StarsIcon sx={{ mr: 1, color: '#8b5cf6' }} /> Your Current Tier
              </Typography>
              <Box textAlign="center" py={4}>
                <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                  {currentTier.emoji}
                </Typography>
                <Typography variant="h5" fontWeight={800} mt={2}>
                  {currentTier.name}
                </Typography>
                <Typography color="text.secondary">
                  {stats.successfulReferrals} / {tiers[tiers.indexOf(currentTier) + 1]?.req || '∞'} referrals
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs: History */}
      <Paper sx={{ borderRadius: 5, overflow: 'hidden' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} centered>
          <Tab label="My Referrals" />
          <Tab label="Points Ledger" />
        </Tabs>
        <Box p={4}>{tabValue === 0 ? <ReferralHistory /> : <PointsHistory />}</Box>
      </Paper>

      <RedeemDialog open={openRedeem} onClose={() => setOpenRedeem(false)} />
    </Box>
  );
};

export default CustomerReferralDashboard;

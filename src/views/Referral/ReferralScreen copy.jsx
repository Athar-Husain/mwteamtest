import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid, // Using Grid2 for better spacing handling in latest MUI
  Paper,
  Stack,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  EmojiEvents as TrophyIcon,
  GroupAdd as GroupIcon,
  Redeem as RedeemIcon,
  Stars as StarsIcon
} from '@mui/icons-material';
import RedeemDialog from './RedeemDialog';
import ReferralHistory from './ReferralHistory';
import PointsHistory from './PointsHistory';
import CreateLeadModal from './CreateLeadModal';

const ReferralScreen = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openRedeem, setOpenRedeem] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Mock Data
  const stats = { availablePoints: 450, lifetimePoints: 1250, successful: 2, referralCode: 'FIBER-MAX-99' };

  const milestones = [
    { count: 5, bonus: 250 },
    { count: 10, bonus: 500 },
    { count: 25, bonus: 1000 }
  ];

  const tiers = [
    { name: 'Getting Started', req: 0, icon: '🌟' },
    { name: 'Bronze', req: 1, icon: '🥉' },
    { name: 'Silver', req: 3, icon: '🥈' },
    { name: 'Gold', req: 6, icon: '🥇' }
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* 1. HEADER SECTION: Stats & Referral Code */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{ p: 4, height: '100%', borderRadius: 5, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' }}
          >
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Invite friends, earn rewards
            </Typography>
            <Typography sx={{ mb: 3, opacity: 0.9 }}>Share your code and get points for every successful connection.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  p: 1,
                  borderRadius: 3,
                  display: 'flex',
                  flex: 1,
                  border: '1px border rgba(255,255,255,0.2)'
                }}
              >
                <Typography sx={{ ml: 2, fontWeight: 700, letterSpacing: 2, flex: 1, alignSelf: 'center' }}>
                  {stats.referralCode}
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<CopyIcon />}>
                  Copy
                </Button>
              </Box>

              <CreateLeadModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 5, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Avatar sx={{ bgcolor: 'orange', width: 60, height: 60, mx: 'auto', mb: 2 }}>
              <RedeemIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              Available Points
            </Typography>
            <Typography variant="h3" fontWeight={900} color="primary">
              {stats.availablePoints}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary', fontWeight: 600 }}>
              Lifetime Earned: {stats.lifetimePoints}
            </Typography>
            <Button fullWidth variant="contained" sx={{ borderRadius: 3, mt: 2, py: 1.5 }} onClick={() => setOpenRedeem(true)}>
              Redeem Points
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 2. MIDDLE SECTION: Side-by-Side Gamification */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Milestone Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', borderRadius: 5, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TrophyIcon sx={{ mr: 1, color: '#f59e0b' }} /> Milestone Bonuses
              </Typography>
              <Stack spacing={3}>
                {milestones.map((m, i) => (
                  <Box key={i}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {m.count} Referrals
                      </Typography>
                      <Typography variant="caption" fontWeight={800} color="primary">
                        +{m.bonus} pts bonus
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((stats.successful / m.count) * 100, 100)}
                      sx={{ height: 8, borderRadius: 5, bgcolor: '#f1f5f9' }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {stats.successful}/{m.count} completed
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Ambassador Tiers Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', borderRadius: 5, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <StarsIcon sx={{ mr: 1, color: '#8b5cf6' }} /> Ambassador Tiers
              </Typography>
              <Stack spacing={1}>
                {tiers.map((t, i) => {
                  const isCurrent = stats.successful >= t.req && (tiers[i + 1] ? stats.successful < tiers[i + 1].req : true);
                  return (
                    <Box
                      key={i}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: isCurrent ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                        border: isCurrent ? '1px solid #ddd6fe' : '1px solid transparent'
                      }}
                    >
                      <Typography variant="h5" sx={{ mr: 2 }}>
                        {t.icon}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={800}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.req} Referrals required
                        </Typography>
                      </Box>
                      {isCurrent && <Chip label="Current" size="small" color="secondary" sx={{ fontWeight: 800, height: 20 }} />}
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': { py: 2, fontWeight: 700 }
              }}
            >
              <Tab label="Referral History" />
              <Tab label="Points History" />
            </Tabs>

            <Box sx={{ p: 4, minHeight: 300 }}>{tabValue === 0 ? <ReferralHistory /> : <PointsHistory />}</Box>
          </Paper>
        </Grid>
      </Grid>

      <RedeemDialog open={openRedeem} onClose={() => setOpenRedeem(false)} />
    </Box>
  );
};

export default ReferralScreen;

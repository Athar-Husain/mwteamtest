// screens/team/TeamPerformanceDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Badge,
  useTheme
} from '@mui/material';
import {
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  PhoneForwarded as CallIcon,
  CurrencyRupee as EarningsIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  CheckCircle as ConvertedIcon
} from '@mui/icons-material';
import { fetchTeamPerformance } from '../../store/slices/teamDashboardSlice';
import { Link } from 'react-router-dom';

const TeamPerformanceDashboard = () => {
  const dispatch = useDispatch();
  const { performance, recentLeads, loading } = useSelector((state) => state.teamDashboard);
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchTeamPerformance());
  }, [dispatch]);

  const progress = (performance.conversionsThisMonth / performance.monthlyTarget) * 100;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Welcome back, {user.firstName}!
          </Typography>
          <Typography color="text.secondary">Track your sales performance and crush your targets</Typography>
        </Box>
        {performance.rank && (
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', boxShadow: 3 }}>
            <Stack alignItems="center">
              <TrophyIcon sx={{ fontSize: 50, color: '#ffd700' }} />
              <Typography variant="h5" fontWeight={900}>
                #{performance.rank}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of {performance.totalTeamMembers} agents
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Monthly Target
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {performance.conversionsThisMonth} / {performance.monthlyTarget}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                  <TargetIcon />
                </Avatar>
              </Stack>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 10, borderRadius: 5, bgcolor: '#e0e0e0' }} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }} color={progress >= 100 ? 'success.main' : 'text.secondary'}>
                {progress.toFixed(0)}% achieved
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Earnings This Month
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="success.main">
                    ₹{performance.earningsThisMonth?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}>
                  <EarningsIcon />
                </Avatar>
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={1}>
                ₹500 per successful connection
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Pending Follow-ups
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color="warning.main">
                    {performance.pendingFollowUps}
                  </Typography>
                </Box>
                <Badge badgeContent={performance.pendingFollowUps} color="error">
                  <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}>
                    <TimerIcon />
                  </Avatar>
                </Badge>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Leads Contacted
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {performance.leadsContacted}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}>
                  <CallIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={4}>
        {/* Recent Leads */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ borderRadius: 4, p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={800}>
                Your Recent Leads
              </Typography>
              <Button component={Link} to="/leads" variant="outlined">
                View All Leads
              </Button>
            </Stack>
            <List>
              {recentLeads.length === 0 ? (
                <Typography textAlign="center" py={6} color="text.secondary">
                  No recent activity. Go get some leads!
                </Typography>
              ) : (
                recentLeads.map((lead, i) => (
                  <React.Fragment key={lead._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#bbdefb' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography fontWeight={700}>{lead.name}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {lead.phone} • {lead.area?.name}
                            </Typography>
                            <br />
                            <Chip
                              label={lead.status.replace('_', ' ')}
                              size="small"
                              color={lead.status === 'converted' ? 'success' : lead.status === 'follow_up' ? 'warning' : 'default'}
                              sx={{ mt: 1 }}
                            />
                          </>
                        }
                      />
                      {lead.status === 'converted' && <Chip icon={<ConvertedIcon />} label="₹500 Earned" color="success" />}
                    </ListItem>
                    {i < recentLeads.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Motivational Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ borderRadius: 4, p: 4, textAlign: 'center', bgcolor: '#fff8e1' }}>
            <TrendingUpIcon sx={{ fontSize: 60, color: '#ff8f00', mb: 2 }} />
            <Typography variant="h5" fontWeight={800} mb={2}>
              Keep Pushing!
            </Typography>
            <Typography color="text.secondary" mb={3}>
              {performance.conversionsThisMonth >= performance.monthlyTarget ? (
                <>You've hit your target! Amazing work! 🎉</>
              ) : (
                <>Only {performance.monthlyTarget - performance.conversionsThisMonth} more conversions to go!</>
              )}
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              component={Link}
              to="/leads?status=follow_up"
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Follow Up Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamPerformanceDashboard;

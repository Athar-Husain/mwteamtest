import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { useSelector } from 'react-redux';
import ApexCharts from 'react-apexcharts';

// Icons
import {
  PeopleAltTwoTone as PeopleIcon,
  RouterTwoTone as RouterIcon,
  ConfirmationNumberTwoTone as TicketIcon,
  MapTwoTone as MapIcon,
  AssignmentTurnedInTwoTone as ResolvedIcon,
  TimerTwoTone as TimerIcon,
  ErrorOutlineTwoTone as ErrorIcon,
  FlashOnTwoTone as SystemIcon,
  ArrowForwardRounded as ArrowIcon,
  EngineeringTwoTone as TechnicianIcon,
  NotificationsActiveTwoTone as AlertIcon,
  LocationOnTwoTone as LocationIcon
} from '@mui/icons-material';

// --- Secondary Mini KPI Component ---
const MiniResourceCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      bgcolor: '#fff',
      border: '1px solid #E9EDF7',
      '&:hover': { boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' },
      transition: 'all 0.3s ease'
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 42, height: 42, borderRadius: '10px' }}>
      {React.cloneElement(icon, { sx: { fontSize: 22 } })}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={800} color="#1B2559">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme();
  // Using selector as per your request, defaulting to 'Technician'
  const { Team } = useSelector((state) => state.team || {});

  // Data structure tailored for MW-Fibernet Technician
  const data = {
    openTickets: '14',
    resolvedToday: '06',
    avgResolutionTime: '1.2h',
    totalAssignedAreas: '04',
    assignedNodes: '124',
    activeAlerts: ['Node Failure - Sector 7', 'High Latency - Block B'],
    recentTickets: [
      { id: 1, customer: 'Amit Sharma', issue: 'No Internet Connection', area: 'Koramangala', time: '10m ago', priority: 'High' },
      { id: 2, customer: 'Sneha Rao', issue: 'Slow Speed / Buffer', area: 'HSR Layout', time: '45m ago', priority: 'Medium' },
      { id: 3, customer: 'John Doe', issue: 'Router Config Reset', area: 'Indiranagar', time: '2h ago', priority: 'Low' }
    ]
  };

  const ticketChartOptions = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels: ['Resolved', 'Pending', 'In Progress'],
    colors: ['#05CD99', '#EE5D50', '#FFB547'],
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontWeight: 600, labels: { colors: '#A3AED0' } },
    plotOptions: { pie: { donut: { size: '75%' } } },
    stroke: { show: false }
  };

  const performanceOptions = {
    chart: { toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisBorder: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { borderColor: alpha(theme.palette.divider, 0.1), strokeDashArray: 4 }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* 1. Header Area */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#1B2559">
            Technician Workspace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, <b>{Team?.firstName || 'Field Tech'}</b>. Here is your current ticket queue.
          </Typography>
        </Box>
        <Chip
          label={data.openTickets > 5 ? 'High Workload' : 'Steady Flow'}
          sx={{
            bgcolor: '#fff',
            fontWeight: 700,
            p: 1,
            borderRadius: '10px',
            border: '1px solid #E9EDF7',
            color: data.openTickets > 5 ? '#EE5D50' : '#05CD99'
          }}
        />
      </Stack>

      {/* 2. Primary KPI Cards - Focus on Tickets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Open Tickets', value: data.openTickets, icon: <TicketIcon />, color: '#EE5D50' },
          { title: 'Resolved Today', value: data.resolvedToday, icon: <ResolvedIcon />, color: '#05CD99' },
          { title: 'Avg. Resolution', value: data.avgResolutionTime, icon: <TimerIcon />, color: '#4318FF' },
          { title: 'My Service Areas', value: data.totalAssignedAreas, icon: <MapIcon />, color: '#FFB547' }
        ].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #F1F4F9', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha(kpi.color, 0.1), color: kpi.color, width: 56, height: 56, borderRadius: '15px' }}>
                  {kpi.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {kpi.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#1B2559">
                    {kpi.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 3. Secondary Resource Metrics */}
      <Typography variant="subtitle1" fontWeight={800} color="#1B2559" sx={{ mb: 2, ml: 1 }}>
        Infrastructure Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Assigned Nodes" value={data.assignedNodes} icon={<RouterIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Customers in Area" value="480" icon={<PeopleIcon />} color="#6AD2FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Active Maintenance" value="02" icon={<SystemIcon />} color="#05CD99" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Network Alerts" value={data.activeAlerts.length} icon={<AlertIcon />} color="#EE5D50" />
        </Grid>
      </Grid>

      {/* 4. Charts & Feeds */}
      <Grid container spacing={3}>
        {/* Weekly Performance Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
              Resolution Activity (Weekly)
            </Typography>
            <ApexCharts
              options={performanceOptions}
              series={[{ name: 'Tickets Resolved', data: [12, 18, 15, 25, 20, 30, 22] }]}
              type="area"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Status Breakdown */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>
              Ticket Status Breakdown
            </Typography>
            <ApexCharts options={ticketChartOptions} series={[65, 20, 15]} type="donut" height={300} />
          </Paper>
        </Grid>

        {/* Auto-Assigned Tickets Feed */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Queue: Auto-Assigned Tickets
              </Typography>
              <Button size="small" variant="contained" sx={{ borderRadius: '10px', bgcolor: '#4318FF' }}>
                View Full List
              </Button>
            </Stack>
            <List disablePadding>
              {data.recentTickets.map((item) => (
                <ListItem key={item.id} divider sx={{ py: 2, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF', fontWeight: 700 }}>{item.customer[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={700}>{item.customer}</Typography>
                        <Chip
                          label={item.priority}
                          size="tiny"
                          sx={{
                            height: 16,
                            fontSize: '10px',
                            bgcolor: item.priority === 'High' ? '#FFE5E5' : '#F4F7FE',
                            color: item.priority === 'High' ? '#EE5D50' : '#4318FF'
                          }}
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          {item.area} • {item.issue}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                      {item.time}
                    </Typography>
                    <IconButton size="small" sx={{ bgcolor: '#F4F7FE' }}>
                      <ArrowIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Local Network Status */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon color="error" /> Area Outage Monitor
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {data.activeAlerts.map((alert, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: '#FFF5F5', borderRadius: '15px', border: '1px solid #FFE5E5' }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#EE5D50">
                    {alert}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Auto-assigned to your team based on location proximity.
                  </Typography>
                  <Button size="small" sx={{ mt: 1, textTransform: 'none', color: '#EE5D50' }}>
                    Acknowledge Alert
                  </Button>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Pulse Animations */}
      <style>
        {`
            @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(238, 93, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0); } }
            .pulse-red { animation: pulse-red 2s infinite; }
        `}
      </style>
    </Box>
  );
};

export default Dashboard;

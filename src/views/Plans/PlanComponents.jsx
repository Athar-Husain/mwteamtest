import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Divider,
  Button,
  Chip,
  Avatar,
  useTheme,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Speed as SpeedIcon,
  DataUsage as DataUsageIcon,
  CalendarToday as CalendarTodayIcon,
  CreditCard as CreditCardIcon,
  Verified as VerifiedIcon,
  AutoAwesome as AutoAwesomeIcon,
  InfoOutlined
} from '@mui/icons-material';
import { getCustomerCurrentPlan } from '../../redux/features/Plan/PlanSlice';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Box, Typography, Stack, Divider, Button, Chip, Avatar, useTheme, Paper, Grid, CircularProgress } from '@mui/material';
// import { CalendarToday as CalendarTodayIcon, Verified as VerifiedIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
// import { getCustomerCurrentPlan } from '../../redux/features/Plan/PlanSlice';

/* ================= ENHANCED CURRENT PLAN CARD ================= */
export const CurrentPlanCard = ({ onRenew }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Loading active plan internally
  const { activePlan, isPlanLoading } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(getCustomerCurrentPlan());
  }, [dispatch]);

  if (isPlanLoading === 'pending') return <CircularProgress size={20} />;
  if (!activePlan?.currentPlan?.plan) return null;

  const { plan, startDate, endDate, price, status } = activePlan.currentPlan;

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        borderRadius: 5,
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* <AutoAwesomeIcon sx={{ position: 'absolute', right: -20, top: -20, fontSize: 200, opacity: 0.1 }} /> */}

      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label="ACTIVE PLAN" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
              {status === 'Paid' && <VerifiedIcon sx={{ color: '#4ade80' }} />}
            </Box>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
              {plan.internetSpeed} {plan.internetSpeedUnit}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, color: 'white' }}>
              {plan.name} • ₹{price} / {plan.duration}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarTodayIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight="bold">
                Subscription Period:
              </Typography>
              <Typography variant="body2">
                {formatDate(startDate)} - {formatDate(endDate)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white'
            }}
          >
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Expires on
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatDate(endDate)}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Payment Status
                </Typography>
                <Typography variant="body2" sx={{ color: status === 'Paid' ? '#4ade80' : '#ffa726', fontWeight: 700 }}>
                  {status}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: 'white', color: 'primary.main', fontWeight: 700, '&:hover': { bgcolor: '#f5f5f5' } }}
                onClick={() => onRenew(plan)}
              >
                Quick Renew
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
/* ================= ENHANCED PLAN CARD ================= */
export const PlanCard = ({ plan, featured, selected, onSelect }) => {
  // Check if plan is featured based on API 'featured' property
  const isFeatured = plan.featured || featured;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : isFeatured ? 'warning.light' : 'divider',
        boxShadow: isFeatured ? '0 10px 30px rgba(255, 165, 0, 0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          borderColor: 'primary.light'
        }
      }}
    >
      {isFeatured && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
            label="POPULAR"
            size="small"
            sx={{
              bgcolor: 'orange',
              color: 'white',
              fontWeight: 800,
              fontSize: '10px',
              boxShadow: '0 4px 10px rgba(255, 165, 0, 0.4)'
            }}
          />
        </Box>
      )}

      <CardContent sx={{ p: 4, flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
          {plan.duration?.replace('-', ' ').toUpperCase()}
        </Typography>

        <Typography variant="h3" fontWeight={900} sx={{ mt: 1, mb: 0.5, color: '#1a1d23' }}>
          {plan.internetSpeed}
          <Typography component="span" variant="h5" sx={{ ml: 0.5, fontWeight: 600, color: 'text.secondary' }}>
            {plan.internetSpeedUnit}
          </Typography>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
          <Typography variant="h4" fontWeight={800} color="primary">
            ₹{plan.price.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
            / {plan.duration}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

        <Stack spacing={2} mb={4}>
          {/* Data Limit Logic */}
          <Feature text={plan.dataLimitType === 'unlimited' ? 'Truly Unlimited Data' : `${plan.dataLimit} GB Monthly Limit`} isBold />

          {/* Mapping actual features from API */}
          {plan.features?.map((feat, index) => (
            <Feature key={index} text={feat} />
          ))}

          {/* Fallback features if API array is empty */}
          {(!plan.features || plan.features.length === 0) && (
            <>
              <Feature text="High Speed Fiber connection" />
              <Feature text="Free Wi-Fi Router" />
            </>
          )}
        </Stack>
      </CardContent>

      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          variant={isFeatured ? 'contained' : 'outlined'}
          fullWidth
          size="large"
          onClick={() => onSelect(plan)}
          sx={{
            borderRadius: 3,
            fontWeight: 800,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            ...(isFeatured && {
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)'
            })
          }}
        >
          {plan.isCurrent ? 'Current Plan' : 'Select Package'}
        </Button>
      </Box>
    </Card>
  );
};

const Feature = ({ text }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Avatar sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', width: 24, height: 24 }}>
      <VerifiedIcon sx={{ color: '#4ade80', fontSize: 16 }} />
    </Avatar>
    <Typography variant="body2" color="text.primary" fontWeight={500}>
      {text}
    </Typography>
  </Stack>
);

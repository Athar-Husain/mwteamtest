import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Button,
  Divider,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Zoom,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Verified as VerifiedIcon,
  Speed as SpeedIcon,
  Layers as LayersIcon,
  FilterList as FilterIcon,
  ShoppingCartCheckout,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { getAllPlans } from '../../redux/features/Plan/PlanSlice';
// import { CurrentPlanCard } from './PlanComponents';

// --- Sub-Component: Feature Item ---
const FeatureItem = ({ text, isBold }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Avatar sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', width: 22, height: 22 }}>
      <VerifiedIcon sx={{ color: '#4ade80', fontSize: 14 }} />
    </Avatar>
    <Typography variant="body2" sx={{ fontWeight: isBold ? 700 : 400, color: 'text.primary' }}>
      {text}
    </Typography>
  </Stack>
);

// --- Sub-Component: Enhanced Plan Card ---
const PlanCard = ({ plan, onSelect }) => {
  const isFeatured = plan.featured;

  const MAX_FEATURES = 5;
  const visibleFeatures = plan.features?.slice(0, MAX_FEATURES) || [];
  const remainingCount = (plan.features?.length || 0) - MAX_FEATURES;

  return (
    <Zoom in={true}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 5,
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid',
          borderColor: isFeatured ? 'primary.main' : 'divider',
          boxShadow: isFeatured ? '0 12px 24px rgba(25, 118, 210, 0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderColor: 'primary.main'
          }
        }}
      >
        {isFeatured && (
          <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
              label="POPULAR"
              size="small"
              sx={{ bgcolor: 'orange', color: 'white', fontWeight: 900, px: 1 }}
            />
          </Box>
        )}

        <CardContent sx={{ p: 4, flexGrow: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1.2 }}>
            {plan.duration?.replace('-', ' ')}
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 1, display: 'flex', alignItems: 'baseline' }}>
            {plan.internetSpeed}
            <Typography component="span" variant="h5" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              {plan.internetSpeedUnit}
            </Typography>
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
              ₹{plan.price?.toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
          <Stack spacing={2}>
            <FeatureItem
              text={plan.dataLimitType === 'unlimited' ? 'Truly Unlimited Data' : `${plan.dataLimit} GB High-Speed Data`}
              isBold
            />

            {visibleFeatures.map((feat, idx) => (
              <FeatureItem key={idx} text={feat} />
            ))}

            {remainingCount > 0 && (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                +{remainingCount} more
              </Typography>
            )}
          </Stack>
        </CardContent>

        <Box sx={{ p: 3, pt: 0 }}>
          <Button
            variant={isFeatured ? 'contained' : 'outlined'}
            fullWidth
            size="large"
            // disabled={plan.isCurrent}
            onClick={() => onSelect(plan)}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 800, textTransform: 'none', fontSize: '1rem' }}
          >
            {plan.isCurrent ? 'Current Plan' : 'Select Plan'}
          </Button>
        </Box>
      </Card>
    </Zoom>
  );
};

// --- Main Screen Component ---
const PlansScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { allPlans = [], activePlan, isPlanLoading } = useSelector((state) => state.plan);

  const [filters, setFilters] = useState({ duration: 'all', speed: 'all', dataLimit: 'all' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const filterOptions = useMemo(() => {
    const limits = allPlans.map((p) => (p.dataLimitType === 'unlimited' ? 'Unlimited' : `${p.dataLimit} GB`));

    return {
      durations: [...new Set(allPlans.map((p) => p.duration))].sort(),
      speeds: [...new Set(allPlans.map((p) => `${p.internetSpeed} ${p.internetSpeedUnit}`))].sort(),
      dataLimits: [...new Set(limits)].sort()
    };
  }, [allPlans]);

  const filteredPlans = useMemo(() => {
    const activeId = activePlan?.currentPlan?.plan?._id;
    return allPlans
      .map((p) => ({ ...p, isCurrent: p._id === activeId }))
      .filter((p) => {
        const matchesDuration = filters.duration === 'all' || p.duration === filters.duration;
        const matchesSpeed = filters.speed === 'all' || `${p.internetSpeed} ${p.internetSpeedUnit}` === filters.speed;
        const currentDataLabel = p.dataLimitType === 'unlimited' ? 'Unlimited' : `${p.dataLimit} GB`;
        const matchesData = filters.dataLimit === 'all' || currentDataLabel === filters.dataLimit;

        return matchesDuration && matchesSpeed && matchesData;
      });
  }, [allPlans, filters, activePlan]);

  const resetFilters = () => setFilters({ duration: 'all', speed: 'all', dataLimit: 'all' });
  const hasActiveFilters = filters.duration !== 'all' || filters.speed !== 'all' || filters.dataLimit !== 'all';

  if (isPlanLoading === 'pending') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh">
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.secondary' }}>Loading best plans for you...</Typography>
      </Box>
    );
  }

  const scrollStackStyle = {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    msOverflowStyle: 'none', // IE and Edge
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
    pb: 0.5 // Tiny padding to prevent chip shadows from being cut
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 5 }, bgcolor: '#fcfcfd', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: '1rem' }}>
          Choose a plan that fits your digital lifestyle
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          m: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 1 }}>
          <FilterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            Filters
          </Typography>
        </Stack>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: 13 }}>Duration</InputLabel>
          <Select
            value={filters.duration}
            label="Duration"
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            sx={{ borderRadius: 2, fontSize: 13 }}
          >
            <MenuItem value="all" sx={{ fontSize: 13 }}>
              All Durations
            </MenuItem>
            {filterOptions.durations.map((d) => (
              <MenuItem key={d} value={d} sx={{ fontSize: 13 }}>
                {d.replace('-', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: 13 }}>Speed</InputLabel>
          <Select
            value={filters.speed}
            label="Speed"
            onChange={(e) => setFilters({ ...filters, speed: e.target.value })}
            sx={{ borderRadius: 2, fontSize: 13 }}
          >
            <MenuItem value="all" sx={{ fontSize: 13 }}>
              Any Speed
            </MenuItem>
            {filterOptions.speeds.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: 13 }}>Data Limit</InputLabel>
          <Select
            value={filters.dataLimit}
            label="Data Limit"
            onChange={(e) => setFilters({ ...filters, dataLimit: e.target.value })}
            sx={{ borderRadius: 2, fontSize: 13 }}
          >
            <MenuItem value="all" sx={{ fontSize: 13 }}>
              Any Limit
            </MenuItem>
            {filterOptions.dataLimits.map((l) => (
              <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Tooltip title="Reset Filters">
            <IconButton
              size="small"
              onClick={resetFilters}
              sx={{ color: 'error.main', bgcolor: 'rgba(211, 47, 47, 0.05)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
            >
              <ResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fff'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Column 1: Duration */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: '1px solid #eee' } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 50 }}>
                DURATION
              </Typography>
              <Stack direction="row" spacing={1} sx={scrollStackStyle}>
                <Chip
                  label="All"
                  size="small"
                  onClick={() => setFilters({ ...filters, duration: 'all' })}
                  color={filters.duration === 'all' ? 'primary' : 'default'}
                  sx={{ fontWeight: 600, fontSize: 12 }}
                />
                {filterOptions.durations.map((d) => (
                  <Chip
                    key={d}
                    label={d.replace('-', ' ')}
                    size="small"
                    onClick={() => setFilters({ ...filters, duration: d })}
                    color={filters.duration === d ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, fontSize: 12 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Column 2: Speed */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: '1px solid #eee' } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 50 }}>
                SPEED
              </Typography>
              <Stack direction="row" spacing={1} sx={scrollStackStyle}>
                <Chip
                  label="Any"
                  size="small"
                  onClick={() => setFilters({ ...filters, speed: 'all' })}
                  color={filters.speed === 'all' ? 'primary' : 'default'}
                  sx={{ fontWeight: 600, fontSize: 12 }}
                />
                {filterOptions.speeds.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    onClick={() => setFilters({ ...filters, speed: s })}
                    color={filters.speed === s ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, fontSize: 12 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Column 3: Data Limit */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 50 }}>
                DATA
              </Typography>
              <Stack direction="row" spacing={1} sx={scrollStackStyle}>
                <Chip
                  label="Any"
                  size="small"
                  onClick={() => setFilters({ ...filters, dataLimit: 'all' })}
                  color={filters.dataLimit === 'all' ? 'primary' : 'default'}
                  sx={{ fontWeight: 600, fontSize: 12 }}
                />
                {filterOptions.dataLimits.map((l) => (
                  <Chip
                    key={l}
                    label={l}
                    size="small"
                    onClick={() => setFilters({ ...filters, dataLimit: l })}
                    color={filters.dataLimit === l ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, fontSize: 12 }}
                  />
                ))}
                {/* Action: Clear Filters inside the slider if filters active */}
                {hasActiveFilters && (
                  <IconButton size="small" onClick={resetFilters} sx={{ color: 'error.main', p: 0.5 }}>
                    <ResetIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={plan._id}>
              <PlanCard
                plan={plan}
                onSelect={(p) => {
                  setSelectedPlan(p);
                  setOpenDialog(true);
                }}
              />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No plans found matching your criteria.
              </Typography>
              <Button sx={{ mt: 2 }} onClick={resetFilters} variant="text" size="small">
                Clear all filters
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 450 } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <ShoppingCartCheckout />
          </Avatar>
          <Typography variant="body" fontWeight={900}>
            Review Subscription
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                SELECTED PLAN
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {selectedPlan?.internetSpeed} {selectedPlan?.internetSpeedUnit} Package
              </Typography>
              <Typography variant="body2">Validity: {selectedPlan?.duration?.replace('-', ' ')}</Typography>
            </Box>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Base Price</Typography>
                <Typography fontWeight={600}>₹{selectedPlan?.price}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Installation</Typography>
                <Typography color="success.main" fontWeight={700}>
                  FREE
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight={900}>
                  Total Payable
                </Typography>
                <Typography variant="h6" fontWeight={900} color="primary">
                  ₹{selectedPlan?.price}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button fullWidth onClick={() => setOpenDialog(false)} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" size="small" sx={{ borderRadius: 3, fontWeight: 600 }}>
            Pay & Activate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlansScreen;

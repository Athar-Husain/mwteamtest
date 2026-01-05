import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  alpha,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Radio,
  Divider
} from '@mui/material';
import {
  CheckCircle as SelectedIcon,
  Speed as SpeedIcon,
  CurrencyRupee as PriceIcon,
  ArrowBackIosNew as BackIcon,
  RocketLaunch as SubscribeIcon
} from '@mui/icons-material';
import { getAllPlans } from '../../../redux/features/Plan/PlanSlice';
import { subscribeToPlan } from '../../../redux/features/Plan/PlanSlice';
import { toast } from 'react-toastify';

const Step3_PlanSelection = ({ customer, connection, onComplete, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { allPlans, isPlanLoading } = useSelector((state) => state.plan);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      toast.warn('Please select a plan to continue');
      return;
    }

    try {
      setSubmitting(true);
      const planData = {
        planId: selectedPlanId,
        customerId: customer.id,
        connectionId: connection._id
      };

      await dispatch(subscribeToPlan(planData)).unwrap();
      toast.success('Onboarding Complete! Customer is now active.');
      onComplete(); // Resets the wizard to Step 1
    } catch (error) {
      toast.error(error || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* FINAL REVIEW SUMMARY */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" fontWeight={800} color="text.disabled">
              CUSTOMER
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {customer?.firstName} {customer?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" fontWeight={800} color="text.disabled">
              CONNECTION ID
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
              {connection?.boxId}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" fontWeight={800} mb={3}>
        Select Service Plan
      </Typography>

      {isPlanLoading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} mb={4}>
          {allPlans?.map((plan) => {
            const isSelected = selectedPlanId === plan._id;
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={plan._id}>
                <Card
                  onClick={() => setSelectedPlanId(plan._id)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    transition: 'all 0.2s',
                    border: '2px solid',
                    borderColor: isSelected ? theme.palette.primary.main : 'transparent',
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.02) : '#fff',
                    boxShadow: isSelected ? theme.shadows[4] : theme.shadows[1],
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[3] }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" fontWeight={800} color={isSelected ? 'primary.main' : 'text.primary'}>
                          {plan.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                          <SpeedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {plan.speed || 'N/A'}
                          </Typography>
                        </Stack>
                      </Box>
                      <Radio checked={isSelected} color="primary" />
                    </Stack>

                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography variant="h5" fontWeight={900}>
                        ₹{plan.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / month
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onBack}
          startIcon={<BackIcon sx={{ fontSize: 14 }} />}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubscribe}
          disabled={submitting || !selectedPlanId}
          startIcon={!submitting && <SubscribeIcon />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          {submitting ? 'Finalizing...' : 'Complete Activation'}
        </Button>
      </Stack>
    </Box>
  );
};

export default Step3_PlanSelection;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Close as CloseIcon, Router as RouterIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const RedeemDialog = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const { customer } = useSelector((state) => state.customer);
  const [redeemType, setRedeemType] = useState('bill_credit');
  const [pointsToRedeem, setPointsToRedeem] = useState(100);
  // NEW: State for selected connection
  const [selectedConnection, setSelectedConnection] = useState(customer?.activeConnection || '');

  const getRedemptionValue = () => {
    if (redeemType === 'bill_credit') return `₹${(pointsToRedeem / 100) * 50} bill credit`;
    const months = Math.floor(pointsToRedeem / 500);
    return `${months} month upgrade`;
  };

  // const handleRedeem = () => {
  //   const payload = {
  //     redemptionType: redeemType,
  //     points: pointsToRedeem,
  //     connectionId: selectedConnection
  //   };
  //   console.log('Redeeming points for specific connection:', payload);
  //   // dispatch(redeemPointsAction(payload));
  // };

  // Inside RedeemDialog.jsx
  const handleRedeem = async () => {
    try {
      const payload = {
        redemptionType: redeemType, // 'bill_credit' or 'speed_upgrade'
        points: pointsToRedeem,
        connectionId: selectedConnection
      };

      // Replace this with your actual API call
      const response = await dispatch(redeemCustomerPoints(payload)).unwrap();

      // Success feedback
      alert(`Successfully redeemed! New balance: ${response.newBalance}`);
      onClose();
    } catch (error) {
      alert(error.message || 'Redemption failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 460 } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          Redeem Points
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
            Available Points: {customer?.availablePoints || 0}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: 'none' }}>
        <Stack spacing={3}>
          {/* 1. Connection Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Apply to Connection
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}
              >
                {customer?.connections?.map((id) => (
                  <MenuItem key={id} value={id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouterIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight={600}>
                        Fiber Node {id.slice(-4).toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({id})
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 2. Redemption Type (Cards) */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Redemption Type
            </Typography>
            <RadioGroup value={redeemType} onChange={(e) => setRedeemType(e.target.value)}>
              <Stack spacing={1.5}>
                {[
                  { id: 'bill_credit', title: 'Bill Credit', sub: '100 points = ₹50 credit' },
                  { id: 'speed_upgrade', title: 'Speed Upgrade', sub: '500 points = 1 month upgrade' }
                ].map((opt) => (
                  <Box
                    key={opt.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: redeemType === opt.id ? 'primary.main' : '#e2e8f0',
                      bgcolor: redeemType === opt.id ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setRedeemType(opt.id)}
                  >
                    <FormControlLabel
                      value={opt.id}
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {opt.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {opt.sub}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Box>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          {/* 3. Points Input */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Points to Redeem
            </Typography>
            <TextField
              type="number"
              fullWidth
              size="small"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(Number(e.target.value))}
              inputProps={{ step: 100, min: 100 }}
              sx={{ bgcolor: '#f8fafc' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
              You'll receive: <span style={{ color: '#1e3a8a', fontWeight: 800 }}>{getRedemptionValue()}</span>
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleRedeem}
          sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: 'none' }}
          disabled={!selectedConnection || pointsToRedeem < 100}
        >
          Redeem Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedeemDialog;

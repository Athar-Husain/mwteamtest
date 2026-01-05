import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Stack, Box, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createLead } from '../../redux/features/Leads/LeadSlice';

const CreateLeadModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { isLeadLoading } = useSelector((state) => state.leads || {});

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceArea: '',
    address: '',
    notes: ''
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) return;

    await dispatch(createLead(formData));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Refer a Customer</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Enter customer details to create a referral. Our team will contact them shortly.
          </Typography>

          <TextField label="Customer Name" fullWidth required value={formData.name} onChange={handleChange('name')} />

          <TextField
            label="Phone Number"
            fullWidth
            required
            inputProps={{ maxLength: 10 }}
            value={formData.phone}
            onChange={handleChange('phone')}
          />

          <TextField label="Service Area / Locality" fullWidth value={formData.serviceArea} onChange={handleChange('serviceArea')} />

          <TextField label="Address (Optional)" multiline rows={2} fullWidth value={formData.address} onChange={handleChange('address')} />

          <TextField label="Notes (Optional)" multiline rows={2} fullWidth value={formData.notes} onChange={handleChange('notes')} />

          <Box pt={1}>
            <Button fullWidth variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={isLeadLoading} size="large">
              {isLeadLoading ? 'Submitting...' : 'Submit Referral'}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadModal;

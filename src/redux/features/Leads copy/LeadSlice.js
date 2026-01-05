// src/features/lead/leadsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LeadService from './LeadService';

const initialState = {
  leads: [],
  lead: null,
  isLeadLoading: false,
  isLeadSuccess: false,
  isLeadError: false,
  message: '',
  pagination: { total: 0, page: 1, pages: 1 }
};

// Helper
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

/* ============================
   Async Thunks
============================ */

export const getAllLeads = createAsyncThunk('lead/getAll', async (filters, thunkAPI) => {
  try {
    return await LeadService.getAll(filters);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getLeadById = createAsyncThunk('lead/getById', async (id, thunkAPI) => {
  try {
    return await LeadService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const addLeadFollowUp = createAsyncThunk('lead/addFollowUp', async ({ leadId, data }, thunkAPI) => {
  try {
    return await LeadService.addFollowUp(leadId, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const convertLead = createAsyncThunk('lead/convert', async ({ leadId, customerId }, thunkAPI) => {
  try {
    return await LeadService.convert(leadId, customerId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

/* ============================
   Slice
============================ */

const leadsSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    resetLeadState: (state) => {
      state.isLeadLoading = false;
      state.isLeadError = false;
      state.isLeadSuccess = false;
      state.message = '';
      state.lead = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })

      // GET BY ID
      .addCase(getLeadById.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.lead = action.payload;
      })

      // ADD FOLLOW UP
      .addCase(addLeadFollowUp.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        toast.success('Follow-up added successfully');

        const index = state.leads.findIndex((l) => l._id === action.payload.lead._id);
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }

        if (state.lead?._id === action.payload.lead._id) {
          state.lead = action.payload.lead;
        }
      })

      // CONVERT LEAD
      .addCase(convertLead.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        toast.success('Lead converted successfully');

        const index = state.leads.findIndex((l) => l._id === action.payload.lead._id);
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
      })

      // GLOBAL PENDING
      .addMatcher(
        (action) => action.type.startsWith('lead/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLeadLoading = true;
          state.isLeadError = false;
          state.isLeadSuccess = false;
          state.message = '';
        }
      )

      // GLOBAL REJECTED
      .addMatcher(
        (action) => action.type.startsWith('lead/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLeadLoading = false;
          state.isLeadError = true;
          state.isLeadSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetLeadState } = leadsSlice.actions;
export default leadsSlice.reducer;

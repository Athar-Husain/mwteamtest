import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LeadService from './LeadService';

const initialState = {
  leads: [],
  isLeadLoading: false,
  isLeadSuccess: false,
  isLeadError: false,
  message: ''
};

// Helper
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

/* ============================
   Async Thunks (ONLY 2)
============================ */

// ✅ CREATE LEAD
export const createLead = createAsyncThunk('lead/create', async (data, thunkAPI) => {
  try {
    return await LeadService.createLead(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// ✅ GET MY REFERRALS
export const getMyReferrals = createAsyncThunk('lead/getMyReferrals', async (_, thunkAPI) => {
  try {
    return await LeadService.getMyReferrals();
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
    }
  },
  extraReducers: (builder) => {
    builder

      // ✅ CREATE LEAD
      .addCase(createLead.fulfilled, (state) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        toast.success('Lead created successfully');
      })

      // ✅ GET MY REFERRALS
      .addCase(getMyReferrals.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        // console.log('actoion payload', action.payload);
        state.leads = action.payload.leads;
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

// src/features/team/teamSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import TeamService from './TeamService';

const token = localStorage.getItem('access_token');
const tokenExpiry = localStorage.getItem('token_expiry');

const initialState = {
  teamMembers: [],
  teamMember: null,
  Team: null,

  isLoggedIn: !!(token && tokenExpiry && Date.now() < +tokenExpiry),
  isTeamLoading: false,
  isTeamSuccess: false,
  isTeamError: false,
  message: '',
  // isLoggedIn: false, // Track the login state
  token: null // Store token for logged-in user
};

// Helper function to extract error message from API response
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// Async Thunks for API calls
export const registerTeamMember = createAsyncThunk('team/register', async (data, thunkAPI) => {
  try {
    return await TeamService.register(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Updated TeamLogin thunk
export const TeamLogin = createAsyncThunk('team/login', async (credentials, thunkAPI) => {
  try {
    const response = await TeamService.TeamLogin(credentials); // Use TeamService for login
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllTeamMembers = createAsyncThunk('team/getAll', async (_, thunkAPI) => {
  try {
    return await TeamService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTeamLoginStatus = createAsyncThunk('admin/status', async (_, thunkAPI) => {
  try {
    return await TeamService.getTeamLoginStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getTeam = createAsyncThunk('admin/get', async (_, thunkAPI) => {
  try {
    return await TeamService.getTeam();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getTeamMemberById = createAsyncThunk('team/getById', async (id, thunkAPI) => {
  try {
    return await TeamService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateTeamMember = createAsyncThunk('team/update', async ({ id, data }, thunkAPI) => {
  try {
    return await TeamService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateTeamMemberPassword = createAsyncThunk('team/updatePassword', async ({ id, data }, thunkAPI) => {
  try {
    return await TeamService.updatePassword(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteTeamMember = createAsyncThunk('team/delete', async (id, thunkAPI) => {
  try {
    return await TeamService.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const forgotPassword = createAsyncThunk('team/forgotPassword', async (email, thunkAPI) => {
  try {
    return await TeamService.forgotPassword(email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const verifyOtp = createAsyncThunk('team/verifyOtp', async ({ email, otp }, thunkAPI) => {
  try {
    return await TeamService.verifyOtp(email, otp);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Redux Slice
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.isTeamLoading = false;
      state.isTeamError = false;
      state.isTeamSuccess = false;
      state.message = '';
      state.isLoggedIn = false; // Reset login state
      state.token = null; // Reset token
    },
    setLoggedInState: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token; // Save token when logged in
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null; // Clear token on logout
      TeamService.TokenManager.clear(); // Clear token from localStorage
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerTeamMember.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member registered successfully!');
      })

      // LOGIN
      .addCase(TeamLogin.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.isLoggedIn = true;
        state.token = action.payload.token; // Store token in state
        toast.success('Login successful!');
      })

      // GET ALL
      .addCase(getAllTeamMembers.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.teamMembers = action.payload;
      })

      .addCase(getTeamLoginStatus.pending, (state) => {
        state.isLoading = true;
        // console.log('Login status pending:');
      })
      .addCase(getTeamLoginStatus.fulfilled, (state, action) => {
        // console.log('Login status:', action.payload);
        state.isLoading = false;
        state.isLoggedIn = action.payload;
      })
      .addCase(getTeamLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        // console.log('Login status rejected:');
        state.isLoggedIn = false;
        state.Team = null;
        state.isError = true;
        state.message = action.payload;
        if (action.payload.includes('jwt expired')) {
          state.isLoggedIn = false;
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_expiry');
          toast.info('Session Expires Please Login', {
            position: 'top-center' // Position the toast at the top center
          });
        }

        // toast.info('Session expired. Please login again.');
        // localStorage.removeItem('access_token');
        // localStorage.removeItem('token_expiry');
      })

      // ====================
      // Get Admin
      // ====================
      .addCase(getAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.Admin = action.payload;
        state.isLoggedIn = true;
        state.isSuccess = true;
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      })

      // GET BY ID
      .addCase(getTeamMemberById.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.teamMember = action.payload;
      })

      // UPDATE
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member updated successfully!');
      })

      // UPDATE PASSWORD
      .addCase(updateTeamMemberPassword.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Password updated successfully!');
      })

      // DELETE
      .addCase(deleteTeamMember.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member deleted successfully!');
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('OTP sent successfully!');
      })

      // VERIFY OTP
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('OTP verified successfully!');
      })

      // LOADING
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/pending'),
        (state) => {
          state.isTeamLoading = true;
        }
      )

      // ERROR
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isTeamLoading = false;
          state.isTeamError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetTeamState, setLoggedInState, logout } = teamSlice.actions;

export default teamSlice.reducer;

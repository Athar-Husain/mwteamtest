import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import TeamService from './TeamService';

// ===============================
// Initial Auth Check
// ===============================
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
  message: ''
};

// ===============================
// Error Helper
// ===============================
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// ===============================
// Thunks
// ===============================
export const registerTeamMember = createAsyncThunk('team/register', async (data, thunkAPI) => {
  try {
    return await TeamService.register(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const TeamLogin = createAsyncThunk('team/login', async (credentials, thunkAPI) => {
  console.log('credentials', credentials);
  try {
    return await TeamService.TeamLogin(credentials);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});
export const TeamLogout = createAsyncThunk('admin/logout', async () => {
  return TeamService.TeamLogout();
});

export const getTeamLoginStatus = createAsyncThunk('team/status', async (_, thunkAPI) => {
  try {
    return await TeamService.getTeamLoginStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTeam = createAsyncThunk('team/get', async (_, thunkAPI) => {
  try {
    return await TeamService.getTeam();
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

// ===============================
// Slice
// ===============================
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.isTeamLoading = false;
      state.isTeamError = false;
      state.isTeamSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.Team = null;
      TeamService.TokenManager.clear();
      toast.info('Logged out successfully');
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(TeamLogin.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.isLoggedIn = true;

        console.log('Action payload in Team Slice Team Login', action.payload);

        // state.Team = action.payload; // Adjust if your payload wraps team data
        // Store token and expiry from response
        localStorage.setItem('access_token', action.payload.token);
        localStorage.setItem('token_expiry', Date.now() + action.payload.expiresIn * 1000); // expiresIn in seconds?
        toast.success('Login successful');
        toast.success('Login successful');
      })

      // LOGIN STATUS
      .addCase(getTeamLoginStatus.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isLoggedIn = action.payload;
        console.log('Action payload in getTeamLoginStatus', action.payload);
      })

      // GET PROFILE
      .addCase(getTeam.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.Team = action.payload;

        console.log('Action payload in GetTeam', action.payload);
      })

      // GET ALL
      .addCase(getAllTeamMembers.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.teamMembers = action.payload;
      })

      // GET BY ID
      .addCase(getTeamMemberById.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.teamMember = action.payload;
      })

      // MATCHERS
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/pending'),
        (state) => {
          state.isTeamLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isTeamLoading = false;
          state.isTeamError = true;
          state.message = action.payload;
          toast.error(action.payload);

          if (action.payload?.includes('jwt expired')) {
            state.isLoggedIn = false;
            TeamService.TokenManager.clear();
            toast.info('Session expired. Please login again.');
          }
        }
      );
  }
});

export const { resetTeamState, logout } = teamSlice.actions;
export default teamSlice.reducer;

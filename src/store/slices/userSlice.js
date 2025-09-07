import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
      state.error = null;
    },
    
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = userSlice.actions;
export default userSlice.reducer;

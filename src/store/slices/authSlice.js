import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Save additional user data to Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return {
        uid: user.uid,
        email: user.email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // First, try to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If user doesn't exist in Firestore, sign them out and throw an error
      if (!userDoc.exists()) {
        await auth.signOut();
        return rejectWithValue('No account found with this email. Please sign up first.');
      }

      const userData = userDoc.data();

      // Update last login time
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        firstName: userData.firstName || '',
        lastName: userData.lastName || ''
      };
    } catch (error) {
      let errorMessage = 'Login failed. Please check your email and password.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to check auth state
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            address: userData.address || '',
            createdAt: userData.createdAt || new Date().toISOString()
          });
        } else {
          resolve(null);
        }
        unsubscribe();
      });
    });
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth: { user } } = getState();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { firstName, lastName, phone, address, email } = profileData;
      
      // Update Firebase Auth profile if name changed
      if (firstName || lastName) {
        const displayName = `${firstName} ${lastName}`.trim();
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update Firestore document
      const updatedData = {
        firstName,
        lastName,
        phone,
        address,
        email,
        displayName: `${firstName} ${lastName}`.trim(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });

      return {
        ...user,
        ...updatedData
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for processing orders
export const processOrder = createAsyncThunk(
  'auth/processOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { auth: { user } } = getState();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const order = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || `${user.firstName} ${user.lastName}`,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        totalQuantity: orderData.totalQuantity,
        orderDate: new Date().toISOString(),
        status: 'completed',
        orderId: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      // Add order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), order);
      
      return {
        ...order,
        id: docRef.id
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'auth/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { user } } = getState();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('orderDate', 'desc')
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for password reset
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent. Please check your inbox.' };
    } catch (error) {
      console.error('Password reset error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
  orderLoading: false,
  orderError: null,
  lastOrder: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
  resetStatus: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
    clearResetStatus(state) {
      state.resetStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetStatus = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetStatus = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send password reset email';
        state.resetStatus = null;
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check auth state cases
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitialized = true;
        state.loading = false;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process order cases
      .addCase(processOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(processOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.lastOrder = action.payload;
        state.orderError = null;
      })
      .addCase(processOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      })
      // Fetch user orders cases
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      });
  },
});

export const { clearError, setInitialized, clearResetStatus } = authSlice.actions;

export default authSlice.reducer;

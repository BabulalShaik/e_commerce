# Firebase Authentication Setup Guide

## Overview
This project now includes Firebase Authentication with user signup and login functionality integrated with Redux Toolkit for state management.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install firebase
```

### 2. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication in the Firebase console
4. Enable Email/Password sign-in method
5. Enable Firestore Database (for storing user profiles)

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your Firebase project configuration:
   - Go to Project Settings > General > Your apps
   - Copy the config values to your `.env` file

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Features Implemented

### Authentication Components
- **Signup Page** (`/signup`): User registration with email, password, first name, and last name
- **Login Page** (`/login`): User authentication with email and password
- **User Dropdown**: Profile menu in navbar with logout functionality

### Redux Integration
- **Auth Slice**: Manages authentication state with async thunks for:
  - User signup with profile creation
  - User login with profile retrieval
  - User logout
  - Authentication state persistence

### User Data Storage
- User profiles are stored in Firestore with the following structure:
  ```javascript
  {
    uid: "user-id",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLoginAt: "2024-01-01T00:00:00.000Z"
  }
  ```

### Security Features
- Form validation on both client-side
- Firebase security rules (configure in Firebase Console)
- Password requirements (minimum 6 characters)
- Email format validation

## Usage

### Accessing Authentication
- Navigate to `/login` for existing users
- Navigate to `/signup` for new user registration
- Click the user icon in the navbar to access profile/logout when authenticated

### State Management
The authentication state is available throughout the app via Redux:
```javascript
const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
```

### Protected Routes
You can protect routes by checking the `isAuthenticated` state:
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## File Structure
```
src/
├── config/
│   └── firebase.js          # Firebase configuration
├── store/
│   └── slices/
│       └── authSlice.js     # Authentication Redux slice
├── Pages/
│   ├── Login/
│   │   └── index.jsx        # Login component
│   └── Signup/
│       └── index.jsx        # Signup component
└── Components/
    └── Navbar/
        └── index.jsx        # Updated navbar with auth state
```

## Next Steps
1. Set up your Firebase project and update the `.env` file
2. Configure Firestore security rules
3. Implement password reset functionality (optional)
4. Add social authentication providers (optional)
5. Implement protected routes for authenticated-only features

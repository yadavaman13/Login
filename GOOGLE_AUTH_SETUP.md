# Google Authentication Setup with Firebase

This project now includes Google authentication using Firebase Authentication.

## Features Added

- ✅ Firebase configuration and initialization
- ✅ Google Sign-In on Login page
- ✅ Google Sign-Up on Register page
- ✅ Dashboard to display user information
- ✅ Logout functionality (supports both email/password and Google auth)
- ✅ Responsive Google button with official branding

## Files Created/Modified

### New Files
1. **`client/src/config/firebase.js`** - Firebase configuration and initialization
2. **`client/src/Pages/Dashboard.jsx`** - Dashboard page after successful login

### Modified Files
1. **`client/src/Pages/LoginPage.jsx`** - Added Google Sign-In functionality
2. **`client/src/Pages/RegisterPage.jsx`** - Added Google Sign-Up functionality
3. **`client/src/Styles/auth.css`** - Added styles for Google button and divider
4. **`client/src/App.jsx`** - Added Dashboard route
5. **`client/package.json`** - Added Firebase dependency

## Firebase Configuration

The Firebase configuration is located in `client/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA_5zd5M8Mc0G_qJ_ys67QxQt8jH_dn8jQ",
  authDomain: "auth-38efa.firebaseapp.com",
  projectId: "auth-38efa",
  storageBucket: "auth-38efa.firebasestorage.app",
  messagingSenderId: "474843809472",
  appId: "1:474843809472:web:3ef5f69f562ef3213fcf25",
  measurementId: "G-RHKWV724L9"
};
```

## How It Works

### Login Flow
1. User clicks "Continue with Google" button
2. Firebase popup opens for Google authentication
3. User selects Google account and authorizes
4. Firebase returns user data and ID token
5. User info and token stored in localStorage
6. User redirected to Dashboard

### Registration Flow
1. User clicks "Continue with Google" button on Register page
2. Same authentication flow as login
3. If successful, user is automatically logged in and redirected to Dashboard

### Dashboard
- Displays user information (name, email, photo)
- Shows authentication method (Google or Email/Password)
- Provides logout functionality
- On logout, clears localStorage and Firebase session

## Setup Instructions

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (auth-38efa)
3. Go to **Authentication** → **Sign-in method**
4. Enable **Google** as a sign-in provider
5. Add authorized domains:
   - `localhost`
   - Your production domain (when deployed)

### 3. Run the Application

```bash
# Start the client
cd client
npm run dev

# Start the server (in another terminal)
cd server
npm start
```

### 4. Test Google Authentication

1. Navigate to `http://localhost:5173/login`
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the application
5. You should be redirected to the Dashboard

## Security Considerations

### Important Notes

1. **API Keys in Code**: The Firebase API keys are visible in the client code. This is normal for Firebase web apps as these keys are not secret. Firebase security is managed through:
   - Firebase Security Rules
   - Authentication requirements
   - Domain restrictions

2. **Backend Integration** (Optional): Currently, the Google authentication is handled entirely on the frontend. For better security and integration with your existing backend:
   - Create a new endpoint on your server (e.g., `/api/auth/google`)
   - Send the Firebase ID token to your backend
   - Verify the token using Firebase Admin SDK
   - Create your own JWT token or session
   - Return user data and your app's token

### Example Backend Integration

```javascript
// Server-side example (auth.controller.js)
const admin = require('firebase-admin');

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    
    // Check if user exists in your database
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        email,
        username: name,
        firebaseUid: uid,
        photoURL: picture,
        authProvider: 'google'
      });
    }
    
    // Generate your own JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    return res.json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

## Environment Variables

If you want to move Firebase configuration to environment variables:

### Create `.env` file in client folder:
```env
VITE_FIREBASE_API_KEY=AIzaSyA_5zd5M8Mc0G_qJ_ys67QxQt8jH_dn8jQ
VITE_FIREBASE_AUTH_DOMAIN=auth-38efa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=auth-38efa
VITE_FIREBASE_STORAGE_BUCKET=auth-38efa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=474843809472
VITE_FIREBASE_APP_ID=1:474843809472:web:3ef5f69f562ef3213fcf25
VITE_FIREBASE_MEASUREMENT_ID=G-RHKWV724L9
```

### Update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## Additional Features to Consider

1. **Email Verification**: Send verification emails to users
2. **Password Reset**: Implement password reset functionality
3. **Profile Management**: Allow users to update their profile
4. **Multiple Auth Providers**: Add Facebook, GitHub, Twitter, etc.
5. **Two-Factor Authentication**: Add extra security layer
6. **Session Management**: Implement refresh tokens and session timeout

## Troubleshooting

### Pop-up Blocked
If the Google sign-in popup is blocked:
- Enable popups for your site in browser settings
- Or use `signInWithRedirect()` instead of `signInWithPopup()`

### Authentication Error
If you get authentication errors:
- Check Firebase Console for proper Google provider setup
- Verify domain is authorized in Firebase settings
- Check browser console for detailed error messages

### Token Expired
Firebase tokens expire after 1 hour:
- Implement token refresh logic
- Or re-authenticate user when token expires

## Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In Guide](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify all configuration steps are completed
4. Check Firebase project settings

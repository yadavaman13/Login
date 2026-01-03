# GitHub Copilot Instructions

This document provides guidance for GitHub Copilot when working with this codebase.

## Project Overview

This is a full-stack authentication application with:
- **Frontend**: React 18 + Vite + React Router v7
- **Backend**: Node.js + Express.js + MySQL
- **Authentication**: JWT tokens with bcrypt password hashing

## Project Structure

```
Login/
├── client/              # React frontend application
│   ├── src/
│   │   ├── Pages/       # Route components (LoginPage, RegisterPage, Dashboard, etc.)
│   │   ├── Components/  # Reusable React components
│   │   ├── Services/    # API communication layer (axios)
│   │   ├── Styles/      # CSS files
│   │   └── config/      # Configuration files (e.g., Firebase)
│   └── package.json
└── server/              # Express.js backend application
    ├── auth/            # Authentication module (routes, controllers, services, middleware)
    ├── config/          # Configuration files (database connection)
    ├── controllers/     # Request handlers
    ├── routes/          # API route definitions
    ├── services/        # Business logic and external services
    ├── database/        # SQL schema files
    └── package.json
```

## Technology Stack

### Frontend
- React 18 with functional components and hooks
- React Router v7 for routing
- Axios for HTTP requests
- Vite as build tool
- CSS3 with CSS variables for styling
- Firebase for Google OAuth
- Lucide React for icons

### Backend
- Node.js with ES modules (`"type": "module"`)
- Express.js for REST API
- MySQL 2 with promise-based queries
- bcrypt for password hashing (10 salt rounds)
- jsonwebtoken for JWT authentication
- nodemailer for email services
- dotenv for environment variables
- nodemon for development

## Development Commands

### Frontend (client/)
```bash
npm run dev      # Start development server (Vite) on http://localhost:5173
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (server/)
```bash
npm run dev      # Start development server with nodemon on http://localhost:5000
npm start        # Start production server
```

### Database Setup
See `DATABASE_SETUP.md` for detailed MySQL setup instructions.

## Coding Conventions

### General
- Use ES6+ module syntax (`import`/`export`)
- Use async/await for asynchronous operations
- Use arrow functions for callbacks and functional components
- Use template literals for string interpolation
- Use const/let, never var

### Backend (Node.js/Express)
- **File naming**: Use kebab-case for files (e.g., `auth.controller.js`)
- **Module organization**: Separate concerns into routes, controllers, and services
- **Error handling**: Always use try-catch blocks in async route handlers
- **Response format**: Standardized JSON responses with `{ success, message, data }` structure
- **Database queries**: Use parameterized queries to prevent SQL injection
- **Password hashing**: Use bcrypt with 10 salt rounds
- **JWT tokens**: Default expiration is 7 days (30 days with "Remember Me")
- **Environment variables**: Access via `process.env.VARIABLE_NAME` with fallback defaults
- **Logging**: Use `console.error()` for errors, `console.log()` for important events

### Frontend (React)
- **File naming**: Use PascalCase for React components (e.g., `LoginPage.jsx`)
- **Component style**: Use functional components with hooks
- **State management**: Use useState for local state
- **Form handling**: Validate on blur and submit
- **Error handling**: Display user-friendly error messages
- **CSS**: Use separate CSS files, imported in components
- **API calls**: Use axios through the services layer (`Services/api.js`)
- **Routing**: Use React Router v7 with Link components

## API Response Format

All API endpoints follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Best Practices

- **Passwords**: Hash with bcrypt (10 salt rounds) before storing
- **SQL Injection**: Always use parameterized queries (`db.query(sql, [params])`)
- **Authentication**: Use JWT tokens stored on client, verified via middleware
- **Validation**: Validate input on both frontend and backend
- **Sensitive Data**: Never log or expose passwords, tokens, or secrets
- **Environment Variables**: Store secrets in `.env` file (never commit)
- **Email Enumeration**: Don't reveal whether an email exists in forgot password flows

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

## Environment Configuration

### Server Environment Variables (server/.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=login_app
DB_PORT=3306
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Common Patterns

### Database Queries
```javascript
// Query with parameters
const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

// Insert with auto-generated ID
const [result] = await db.query('INSERT INTO users (...) VALUES (...)', [params]);
const userId = result.insertId;
```

### Authentication Flow
1. User submits credentials
2. Backend validates and checks database
3. Backend generates JWT token with user ID and email
4. Token returned to client and stored
5. Client includes token in Authorization header for protected routes
6. Middleware verifies token before allowing access

### Error Handling
```javascript
try {
  // Operation
} catch (error) {
  console.error('Operation error:', error);
  res.status(500).json({
    success: false,
    message: 'Operation failed. Please try again.'
  });
}
```

## Testing

Currently, there are no automated tests in this repository. When adding tests:
- Frontend: Consider using Vitest (already supported by Vite) and React Testing Library
- Backend: Consider using Jest or Mocha with Chai
- Follow existing patterns for consistency

## Additional Resources

- [DATABASE_SETUP.md](../DATABASE_SETUP.md) - Detailed database setup instructions
- [GOOGLE_AUTH_SETUP.md](../GOOGLE_AUTH_SETUP.md) - Google OAuth configuration guide
- [README.md](../README.md) - General project documentation

## Notes for Copilot

- This project uses ES modules throughout (check `"type": "module"` in package.json)
- Database must be set up before running the server
- Always maintain the consistent API response format
- Follow the existing modular structure (don't mix concerns)
- Prioritize security in authentication and data handling
- Keep frontend and backend changes separate when possible

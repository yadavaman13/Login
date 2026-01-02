# Login Application

A full-stack authentication application with React frontend and Express.js backend with MySQL database.

## Features

✅ User registration with validation
✅ Secure login with JWT authentication  
✅ Password hashing with bcrypt
✅ MySQL database integration
✅ Real-time form validation
✅ Password strength indicator
✅ Responsive UI design
✅ Token-based session management

## Project Structure

```
Login/
├── client/          # React frontend
│   └── src/
│       ├── Pages/   # Login and Register components
│       ├── services/# API communication (axios)
│       └── Styles/  # CSS files
└── server/          # Express.js backend
    ├── auth/        # Authentication routes and controllers
    ├── config/      # Database configuration
    └── database/    # SQL schema
```

## Technologies Used

### Frontend
- React 18
- React Router v7
- Axios
- CSS3 with CSS Variables

### Backend
- Node.js
- Express.js
- MySQL 2
- bcrypt (password hashing)
- JWT (authentication tokens)
- dotenv (environment variables)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm package manager
- MySQL Server (5.7+ or 8.0+)

### Database Setup

**Important:** Set up the database BEFORE running the server.

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions.

Quick setup:
```sql
mysql -u root -p
CREATE DATABASE login_app;
USE login_app;
source server/database/schema.sql;
```

### Installation

**1. Clone and Install Dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

**2. Configure Environment Variables**

Create/edit `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=login_app
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
Server runs at: `http://localhost:5000`

You should see:
```
✅ Database connected successfully
Server is running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Client runs at: `http://localhost:5173`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ email, name, phone, password, confirmPassword }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "1234567890"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Email uniqueness validation
- ✅ Password strength requirements
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation on frontend and backend

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

## User Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | Unique user email |
| name | String | Yes | User's full name |
| phone | String | No | 10-digit phone number |
| password | String | Yes | Min 6 chars, must include uppercase & number |
| confirmPassword | String | Yes | Must match password |

## Troubleshooting

### Database Connection Issues

If you see `❌ Database connection failed`:

1. Verify MySQL is running: `net start MySQL80`
2. Check `.env` credentials
3. Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed troubleshooting

### Port Already in Use

If port 5000 or 5173 is busy:
```bash
# Change PORT in server/.env
PORT=5001

# Vite will automatically try next available port
```

## Next Steps / Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Session timeout handling
- [ ] Rate limiting for API endpoints
- [ ] User dashboard
- [ ] Admin panel
- [ ] OAuth integration (Google, Facebook)
- [ ] Two-factor authentication

## License

MIT

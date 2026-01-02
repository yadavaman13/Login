# Database Setup Instructions

This guide will help you set up the MySQL database for the login application.

## Prerequisites
- MySQL Server installed (MySQL 5.7+ or MySQL 8.0+)
- MySQL command-line client or MySQL Workbench

## Quick Setup

### Option 1: Using MySQL Command Line

1. **Start MySQL Server** (if not already running)
   ```bash
   # Windows (as Administrator)
   net start MySQL80
   
   # or start MySQL service from Services panel
   ```

2. **Login to MySQL**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

3. **Run the schema file**
   ```sql
   source C:/Users/Aman/Desktop/Login/server/database/schema.sql
   ```
   
   Or alternatively, copy and paste the SQL commands directly into MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS login_app;
   USE login_app;
   
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
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

4. **Verify the database was created**
   ```sql
   SHOW DATABASES;
   USE login_app;
   SHOW TABLES;
   DESCRIBE users;
   ```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "File" → "Open SQL Script"
4. Navigate to: `C:\Users\Aman\Desktop\Login\server\database\schema.sql`
5. Click "Execute" (lightning bolt icon)
6. Verify the database was created in the left sidebar

## Configure Environment Variables

Update the `.env` file in the server directory with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=login_app
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

## Test the Connection

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see:
   ```
   ✅ Database connected successfully
   Server is running on port 5000
   ```

If you see a connection error, check:
- MySQL server is running
- Credentials in `.env` are correct
- Database `login_app` exists
- MySQL port is 3306 (default)

## Database Schema

### Users Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| email | VARCHAR(255) | User email (unique) |
| name | VARCHAR(255) | User full name |
| phone | VARCHAR(20) | User phone number (optional) |
| password | VARCHAR(255) | Hashed password (bcrypt) |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Indexes
- `idx_email` - Fast email lookups for login
- `idx_created_at` - Fast sorting by registration date

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Check your MySQL password in `.env`
- Try logging in to MySQL manually to verify credentials

### Error: "Unknown database 'login_app'"
- Run the schema.sql file again
- Verify database was created: `SHOW DATABASES;`

### Error: "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check if port 3306 is correct
- Try: `mysql -u root -p` to test connection

### Error: "Table 'users' already exists"
- This is normal if you've run the schema before
- You can drop and recreate: `DROP TABLE IF EXISTS users;`

## Sample Test User

After setting up, you can register a user through the application UI at `http://localhost:5173/register`

Or insert a test user manually:
```sql
-- Password is: Test123!
INSERT INTO users (email, name, phone, password) VALUES (
    'test@example.com',
    'Test User',
    '1234567890',
    '$2b$10$YourHashedPasswordHere'
);
```

Note: Use the registration form to create users - passwords will be automatically hashed.

# Database Setup Guide for CaseFlowPro

This guide will help you set up the PostgreSQL database for the CaseFlowPro application.

## Prerequisites

- PostgreSQL installed on your system
- Access to PostgreSQL with administrative privileges

## Setup Options

### Option 1: Using pgAdmin (Recommended for beginners)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" and select "Create" > "Database..."
4. Enter "casequeue" as the database name and click "Save"
5. Right-click on the newly created "casequeue" database and select "Query Tool"
6. Open the `create-database.sql` file from this project
7. Click the "Execute/Refresh" button to run the script and create all tables

### Option 2: Using Command Line

If PostgreSQL's bin directory is in your PATH:

```bash
# Create the database
createdb -U postgres casequeue

# Run the SQL script to create tables
psql -U postgres -d casequeue -f create-database.sql
```

If PostgreSQL's bin directory is not in your PATH:

1. Locate your PostgreSQL installation directory (often `C:\Program Files\PostgreSQL\[version]`)
2. Navigate to the bin directory in Command Prompt:
   ```
   cd "C:\Program Files\PostgreSQL\[version]\bin"
   ```
3. Run the commands:
   ```
   createdb -U postgres casequeue
   psql -U postgres -d casequeue -f "C:\Users\USER\CODE\INTAKE\create-database.sql"
   ```

## Verifying Database Connection

To verify that your application can connect to the database, check that your `.env` and `.env.local` files contain the correct connection string:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/casequeue?schema=public"
```

If your PostgreSQL uses a different username or password, update the connection string accordingly:

```
DATABASE_URL="postgresql://[your_username]:[your_password]@localhost:5432/casequeue?schema=public"
```

## Troubleshooting

- **Authentication failed**: Ensure your PostgreSQL username and password in the connection string are correct
- **Can't connect to server**: Make sure PostgreSQL service is running
- **Database 'casequeue' does not exist**: Create the database using pgAdmin or createdb command

## Notes for Windows Users

If you're using PowerShell and encountering execution policy restrictions, you can try running Command Prompt (cmd) instead or using this PowerShell command:

```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
```

This will temporarily allow script execution in the current PowerShell session. 
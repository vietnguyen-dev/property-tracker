# PropertyTrack

A real estate property management web application that helps users track their property investments, monitor values, and manage tenants.

## Tech Stack

- **Backend**: Go 1.24
- **Database**: MySQL
- **Authentication**: Firebase
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Infrastructure**: Docker, Nginx

## Project Structure

```
property-tracker/
├── dbo/                    # Database schema files
│   ├── properties.sql      # Properties table schema
│   ├── roles.sql           # Roles table schema
│   ├── users.sql           # Users table schema
│   └── views/              # SQL views
├── nginx/                  # Nginx configuration
├── server/                 # Go backend
│   ├── data/               # Data handlers (API endpoints)
│   ├── middleware/         # HTTP middleware
│   ├── static/             # Frontend assets
│   │   ├── dashboard/      # Dashboard pages
│   │   └── *.html/js/css   # Landing page
│   ├── utils/              # Utilities (MySQL connection)
│   ├── main.go             # Application entry point
│   └── go.mod              # Go module definition
└── docker-compose.yml      # Docker configuration
```

## Prerequisites

- Go 1.24+
- MySQL
- Firebase project (for authentication)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/vietnguyen-dev/property-tracker.git
   cd property-tracker
   ```

2. Set up the database:
   ```bash
   mysql -u your_user -p your_database < dbo/roles.sql
   mysql -u your_user -p your_database < dbo/users.sql
   mysql -u your_user -p your_database < dbo/properties.sql
   ```

3. Configure environment variables in `server/.env`:
   ```
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_HOST=localhost
   DB_NAME=your_database
   ```

4. Run the server:
   ```bash
   cd server
   go run main.go
   ```

5. Open http://localhost:8080 in your browser.

## API Endpoints

| Method | Endpoint     | Description      |
|--------|--------------|------------------|
| GET    | /api/users   | Get users        |
| GET    | /api/roles   | Get roles        |

## Features

- Portfolio Dashboard - Overview of all properties and performance metrics
- Value Tracking - Monitor property values with market data
- Expense Management - Track property-related expenses
- Tenant Management - Manage tenant info and rent payments

## License

MIT

# PropertyTrack

A real estate property management web application that helps users track their property investments, monitor values, and manage tenants.

## Tech Stack

- **Backend**: Go 1.24
- **Database**: MySQL
- **Authentication**: Firebase
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5

## Deployment Strategy

### AWS Architecture

```
Route 53 (DNS)
    │
    ▼
CloudFront (CDN)
    │
    ├──► S3 Bucket (Static Frontend)
    │       └── HTML, CSS, JS, images
    │
    └──► Fargate (Go API)
            └── /api/* routes
```

### Components

- **Route 53** - DNS management and domain routing
- **CloudFront** - CDN distribution with two origins:
  - Default behavior → S3 (static assets)
  - `/api/*` behavior → Fargate (backend API)
- **S3** - Hosts the static frontend (`server/static/` contents)
- **Fargate** - Runs the Go backend as a containerized service, handles all API requests

### Deployment Steps

1. **S3**: Upload `server/static/` contents to an S3 bucket with static website hosting enabled
2. **Fargate**: Build and push the Go server Docker image to ECR, deploy as a Fargate service behind an ALB
3. **CloudFront**: Create a distribution with S3 as the default origin and the Fargate ALB as the `/api/*` origin
4. **Route 53**: Point your domain to the CloudFront distribution

## Project Structure

```
property-tracker/
├── dbo/                    # Database schema files
│   ├── properties.sql      # Properties table schema
│   ├── roles.sql           # Roles table schema
│   ├── users.sql           # Users table schema
│   └── views/              # SQL views
├── server/                 # Go backend
│   ├── data/               # Data handlers (API endpoints)
│   ├── middleware/          # HTTP middleware
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

| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| GET    | /api/users      | Get all users or by firebase_id    |
| POST   | /api/users      | Create a user                      |
| PUT    | /api/users      | Update a user                      |
| DELETE | /api/users      | Soft-delete a user                 |
| GET    | /api/properties | Get properties by user_id or id    |
| POST   | /api/properties | Create a property                  |
| PUT    | /api/properties | Update a property                  |
| DELETE | /api/properties | Soft-delete a property             |
| GET    | /api/roles      | Get roles                          |

## Features

- Portfolio Dashboard - Overview of all properties and performance metrics
- Value Tracking - Monitor property values with calculated profit and rental estimates
- Property Management - Add, edit, and delete properties
- Tenant Management - Manage tenant info and rent payments

## License

MIT

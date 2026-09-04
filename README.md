# ⭐ Rating Store App

A full-stack store rating application where users can discover stores, submit ratings, and manage their ratings. The application provides role-based functionality for System Administrators, Normal Users, and Store Owners.

---

## 📖 Overview

The Rating Store App is a full-stack web application developed using:

- React
- Vite
- NestJS
- Node.js
- PostgreSQL
- Neon PostgreSQL
- Drizzle ORM
- JWT
- bcrypt

The application implements:

- Role-based authentication and authorization
- Store management
- User management
- Store ratings from 1 to 5
- Rating modification
- Store search
- User search and filtering
- Table sorting
- Store Owner dashboard
- Password change functionality
- Input validation
- Responsive user interface

---

## ✨ Features

The application supports three different roles:

- System Administrator
- Normal User
- Store Owner

Each role has access to functionality relevant to its responsibilities.

---

## 🛡️ System Administrator

The System Administrator can:

- View dashboard statistics
  - Total Users
  - Total Stores
  - Total Ratings
- Add Normal Users
- Add Store Owners
- Add System Administrators
- Add Stores
- Assign Store Owners to stores
- View all stores
- Search stores
- Sort store data
- View all users
- Search users
- Filter users by role
- Sort user data
- View detailed user information
- View stores and ratings associated with Store Owners
- Logout

---

## 👤 Normal User

Normal Users can:

- Sign up
- Login
- View available stores
- Search stores by name or address
- View overall store ratings
- View their own submitted rating
- Submit a rating from 1 to 5
- Modify an existing rating
- Change password
- Logout

A user can have only one rating for a particular store. If the user submits another rating for the same store, the existing rating is updated.

---

## 🏪 Store Owner

Store Owners can:

- Login
- View their store information
- View the average store rating
- View the number of users who rated their store
- View users who rated their store
- View individual submitted ratings
- Change password
- Logout

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| React Router | Client-side routing |
| Axios | HTTP/API requests |
| JavaScript | Application logic |
| CSS | Styling |
| Vite | Development server and build tool |

### Backend

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| Node.js | JavaScript runtime |
| REST APIs | Client-server communication |
| JWT | Authentication |
| bcrypt | Password hashing |
| class-validator | Request validation |
| class-transformer | Data transformation |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Neon PostgreSQL | Cloud PostgreSQL database |
| Drizzle ORM | Database ORM |
| Drizzle Kit | Database migration tooling |

---

## 🏗️ Application Architecture

```text
┌──────────────────────────────────────┐
│            React Frontend            │
│                 Vite                 │
│        http://localhost:5173         │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP / REST API
                   │ Bearer Token (JWT)
                   ▼
┌──────────────────────────────────────┐
│            NestJS Backend             │
│         http://localhost:3000        │
│                                      │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │  Auth   │ │  JWT    │ │  Role  │ │
│  │         │ │  Guard  │ │  Guard │ │
│  └─────────┘ └─────────┘ └────────┘ │
└──────────────────┬───────────────────┘
                   │
                   │ Drizzle ORM
                   ▼
┌──────────────────────────────────────┐
│       PostgreSQL Database             │
│          Neon PostgreSQL              │
└──────────────────────────────────────┘
```

---

## 🔐 Role-Based Access Control

The application uses JWT-based authentication and role-based authorization.

There are three roles:

| Role | Access |
|---|---|
| System Administrator | Dashboard, user management, store management, and user details |
| Normal User | Store browsing, searching, and rating management |
| Store Owner | Store information, ratings, and customer rating details |

Protected backend routes use JWT authentication guards, while role guards restrict access to role-specific functionality.

---

## ✅ Validation Rules

The application validates user input on the backend using `class-validator`.

### Name

- Minimum length: 20 characters
- Maximum length: 60 characters

### Address

- Maximum length: 400 characters

### Password

- Minimum length: 8 characters
- Maximum length: 16 characters
- Must contain at least one uppercase letter
- Must contain at least one special character

### Email

- Must follow standard email format validation

### Rating

- Must be an integer
- Minimum value: 1
- Maximum value: 5

---

## 🗄️ Database Design

The application uses three main database tables.

### Users

Stores authentication and user information.

| Field | Description |
|---|---|
| `id` | Unique user ID |
| `name` | User name |
| `email` | User email |
| `password` | Hashed password |
| `address` | User address |
| `role` | User role |

### Stores

Stores store information and its relationship with a Store Owner.

| Field | Description |
|---|---|
| `id` | Unique store ID |
| `name` | Store name |
| `email` | Store email |
| `address` | Store address |
| `ownerId` | Associated Store Owner |

### Ratings

Stores ratings submitted by users.

| Field | Description |
|---|---|
| `id` | Unique rating ID |
| `userId` | User who submitted the rating |
| `storeId` | Store being rated |
| `rating` | Rating from 1 to 5 |

A unique constraint on `userId` and `storeId` ensures that a user can have only one rating for a particular store.

If the user submits another rating for the same store, the existing rating is updated.

---

## 🔑 Authentication

Authentication is implemented using JSON Web Tokens (JWT).

### Authentication Flow

1. The user logs in using their email and password.
2. The backend verifies the credentials.
3. The password is verified using bcrypt.
4. A JWT access token is generated.
5. The frontend stores the authentication token.
6. Axios attaches the token to authenticated API requests.
7. JWT guards verify protected requests on the backend.
8. Role guards restrict access to role-specific endpoints.

Passwords are stored as bcrypt hashes rather than plain-text passwords.

---

## 🌐 API Overview

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/signup` | Register a new Normal User |
| `POST` | `/users/login` | Authenticate a user |
| `POST` | `/users/change-password` | Change the authenticated user's password |

### Administrator

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | Get dashboard statistics |
| `GET` | `/admin/users` | Get users |
| `GET` | `/admin/users/:id` | Get user details |
| `POST` | `/admin/users` | Create a Normal User |
| `POST` | `/admin/admins` | Create a System Administrator |
| `POST` | `/admin/store-owners` | Create a Store Owner |
| `GET` | `/admin/stores` | Get stores |
| `POST` | `/admin/stores` | Create a store |

### Stores

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stores` | Get available stores |

The stores endpoint supports searching by store name or address.

### Ratings

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ratings/:storeId` | Create or update a rating for a store |

Ratings must be between 1 and 5.

### Store Owner

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/owner/dashboard` | Get store owner dashboard information |

The Store Owner dashboard returns store information, average ratings, and users who have submitted ratings.

---

## 📁 Project Structure

```text
Rating-Store-App/

│
├── backend/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── dto/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.module.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   └── guards/
│   │   │
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── db.ts
│   │   │   └── schema.ts
│   │   │
│   │   ├── owner/
│   │   │   ├── owner.controller.ts
│   │   │   ├── owner.service.ts
│   │   │   └── owner.module.ts
│   │   │
│   │   ├── ratings/
│   │   │   ├── dto/
│   │   │   ├── ratings.controller.ts
│   │   │   ├── ratings.service.ts
│   │   │   └── ratings.module.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── dto/
│   │   │   ├── stores.controller.ts
│   │   │   ├── stores.service.ts
│   │   │   └── stores.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── drizzle/
│   ├── test/
│   ├── .env
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUserDetails.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nikita-Parjane27/Rating-Store-App.git
cd Rating-Store-App
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pnpm install
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

Generate the database migration:

```bash
pnpm drizzle-kit generate
```

Apply the database migration:

```bash
pnpm drizzle-kit migrate
```

Start the backend development server:

```bash
pnpm run start:dev
```

The backend will run on:

```text
http://localhost:3000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Start the frontend development server:

```bash
pnpm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

**Note:** The `.env` file is excluded from Git and should never be committed to the repository.

---

## 🔄 Application Flow

### Normal User Flow

```text
Sign Up
   ↓
Login
   ↓
User Dashboard
   ↓
Search / View Stores
   ↓
Submit Rating
   ↓
Modify Rating if Required
   ↓
Change Password / Logout
```

### System Administrator Flow

```text
Login
   ↓
Admin Dashboard
   ↓
View Statistics
   ↓
Manage Users
   ↓
Manage Stores
   ↓
Search / Filter / Sort
   ↓
View User Details
   ↓
Logout
```

### Store Owner Flow

```text
Login
   ↓
Store Owner Dashboard
   ↓
View Store Information
   ↓
View Average Rating
   ↓
View Users Who Rated
   ↓
View Individual Ratings
   ↓
Change Password / Logout
```

---

## 🖥️ User Interface

The application provides separate dashboards based on the authenticated user's role.

### Authentication

- Login page
- Normal User registration
- Password validation
- Role-based redirection
- Change password functionality

### Admin Dashboard

- Dashboard statistics
- User management
- Store management
- Search and filtering
- Sorting
- Detailed user information

### Normal User Dashboard

- Store listing
- Store search
- Overall rating display
- Personal rating display
- Rating submission
- Rating modification

### Store Owner Dashboard

- Store information
- Average rating
- Number of users who rated
- Individual customer ratings

The interface is responsive and includes mobile-friendly layouts.

---

## 🔒 Security Considerations

The application includes the following security measures:

- Passwords are hashed using bcrypt.
- JWT tokens are used for authentication.
- Protected backend endpoints use JWT authentication guards.
- Role guards restrict access to role-specific endpoints.
- Password hashes are not returned in user listing responses.
- Database relationships use foreign keys.
- A unique constraint prevents duplicate ratings for the same user and store.
- Environment variables are used for sensitive configuration.
- `.env` files are excluded from version control.

---

## 🧪 Testing & Verification

The following functionality has been tested during development:

- User registration
- User login
- JWT authentication
- Role-based route protection
- Admin dashboard
- User creation
- Store creation
- Store Owner creation
- Store search
- User search
- User filtering
- Table sorting
- User details
- Store rating submission
- Rating modification
- Store Owner dashboard
- Change password functionality
- Frontend production build
- Backend compilation

The frontend production build completes successfully using:

```bash
pnpm run build
```

---

## 📌 Project Status

The application is implemented as a full-stack role-based store rating system using React, NestJS, Drizzle ORM, and Neon PostgreSQL.

Core functionality required for the FullStack Intern Coding Challenge has been implemented and tested.

---

## 👩‍💻 Author

**Nikita Parjane**

B.Tech Computer Science and Design

GitHub: https://github.com/Nikita-Parjane27/Rating-Store-App
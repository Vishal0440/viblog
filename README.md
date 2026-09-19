# Vi-Blog

Vi-Blog is a full-stack blogging platform built with React and Node.js. It lets visitors browse and search posts, filter by category, read individual articles, and lets authenticated users create, edit, delete, and like posts.

## Features

### Public
- Modern responsive home page with featured hero section
- Latest 6 posts shown on the home page
- Separate `/feed` page for the complete post feed
- Search posts by title or content
- Filter posts by category
- Pagination with 6 posts per page
- Individual post view
- Share post modal
- Responsive navbar and footer
- Automatic scroll-to-top when navigating between routes

### Authentication
- User signup and login
- JWT authentication
- Password hashing with bcrypt
- Minimum password length: **6 characters**
- Inline validation messages using `<p>` elements
- Validation on input change
- Frontend and backend validation
- Protected dashboard, create, and edit routes

### Blog management
Authenticated users can:
- Create posts
- Edit posts
- Delete posts
- Like/unlike posts
- Upload/use post images
- Manage posts from the dashboard

## Tech Stack

### Frontend
- React 19
- React Router 7
- Vite 7
- Tailwind CSS 4
- Axios
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- CORS
- dotenv

## Project Structure

```text
viblog/
├── README.md
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PostCards.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ShareModal.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Feed.jsx
    │   │   ├── PostView.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── EditPost.jsx
    │   │   └── WhyViBlog.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── categories.js
    │   │   ├── validation.js
    │   │   └── logo.svg
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Requirements

Install these before running the project:

- Node.js 18+
- npm
- MongoDB Atlas account or a local MongoDB server

## Setup

### 1. Clone or extract the project

```bash
git clone <your-repository-url>
cd viblog
```

Or simply extract the project ZIP and open the `viblog` folder.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Then start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

The frontend uses this API URL by default:

```text
http://localhost:5000/api
```

For a different backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then start Vite:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

```bash
npm run dev
```
Starts the Vite development server.

```bash
npm run build
```
Creates a production build.

```bash
npm run preview
```
Previews the production build locally.

```bash
npm run lint
```
Runs ESLint.

### Backend

```bash
npm run dev
```
Starts the Express server with Nodemon.

```bash
npm start
```
Starts the Express server normally.

## Routes

### Frontend routes

| Route | Purpose |
|---|---|
| `/` | Home page with hero and latest 6 posts |
| `/feed` | Full post feed with search, category filter, and pagination |
| `/post/:id` | Individual post |
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | User dashboard |
| `/create` | Create a post |
| `/edit/:id` | Edit a post |

## API Endpoints

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Posts

```text
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
```

Creating, editing, deleting, and liking posts require a valid JWT token.

## Validation

Vi-Blog uses frontend and backend validation.

### Authentication

- Valid email format required
- Password must contain at least **6 characters**
- Validation messages are displayed inline
- Native browser `required` validation is not used for these forms

### Posts

Create and edit post forms validate fields before submission and the backend validates incoming API data as well.

The shared frontend validation utilities are located at:

```text
frontend/src/utils/validation.js
```

Backend validation is located at:

```text
backend/middleware/validation.js
```

## UI Design

The project uses an Indigo, Violet, and Slate design system.

| Purpose | Color |
|---|---|
| Primary | `#4F46E5` |
| Primary hover | `#4338CA` |
| Accent | `#7C3AED` |
| Page background | `#F8FAFC` |
| Main text | `#0F172A` |
| Secondary text | `#475569` |
| Border | `#E2E8F0` |
| Card | `#FFFFFF` |
| Error | `#DC2626` |
| Success | `#059669` |

## Home vs Feed

The home page and feed are intentionally separate.

### Home

```text
Hero
  ↓
Latest Posts
  ↓
Search | Category | View all
  ↓
6 Post Cards
```

### Feed

```text
Explore the Feed
  ↓
Search | Category
  ↓
Post Cards
  ↓
Centered Pagination
```

The total post count is intentionally not displayed in the UI.

## Security Notes

Never commit real MongoDB credentials or JWT secrets to GitHub.

Use environment variables and keep `.env` files private. Before publishing this project, replace any real credentials in the local `.env` file and rotate exposed database/JWT credentials if they have already been shared publicly.

## Development Notes

- Keep API calls inside the frontend utility layer where practical.
- Reuse `PostCards` instead of duplicating post-card markup.
- Keep Home and Feed logic separate.
- Keep validation rules consistent between frontend and backend.
- Use protected routes for authenticated actions.

## License

This project is for learning and personal/portfolio use. Add your preferred license before distributing it publicly.

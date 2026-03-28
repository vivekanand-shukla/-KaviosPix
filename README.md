# 📷 KaviosPix

A Google Photos-like image management system built with the MERN stack.

---

## Features

- Sign in with Google (OAuth2)
- Create and manage photo albums
- Upload images (stored on Cloudinary)
- Tag images, add person names, mark favorites
- Add comments to images
- Share albums with others via email
- Filter images by tags or favorites

---

## Project Structure

```
kaviosPix/
├── backend/        ← Node.js + Express API
└── frontend/       ← React + Vite
```

---

## Backend Setup

### 1. Go to the backend folder

```bash
cd backend
npm install
```

### 2. Fill in the `.env` file

Open `backend/.env` and fill in all the values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_string
GOOGLE_CLIENT_ID=from_google_cloud_console
GOOGLE_CLIENT_SECRET=from_google_cloud_console
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
CLOUDINARY_CLOUD_NAME=from_cloudinary_dashboard
CLOUDINARY_API_KEY=from_cloudinary_dashboard
CLOUDINARY_API_SECRET=from_cloudinary_dashboard
SESSION_SECRET=any_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start the backend

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

## Frontend Setup

### 1. Go to the frontend folder

```bash
cd frontend
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## How to get Google OAuth credentials

1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth Client ID**
5. Select **Web Application**
6. Add `http://localhost:5000/auth/google/callback` as an authorized redirect URI
7. Copy the Client ID and Client Secret into your `.env`

---

## How to get Cloudinary credentials

1. Go to https://cloudinary.com and create a free account
2. Open your **Dashboard**
3. Copy the **Cloud Name**, **API Key**, and **API Secret** into your `.env`

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| GET | /auth/google | Start Google login |
| GET | /auth/google/callback | Google callback |
| GET | /auth/me | Get current user |

### Albums
| Method | URL | Description |
|--------|-----|-------------|
| POST | /albums | Create album |
| GET | /albums | Get all albums |
| PUT | /albums/:albumId | Update album description |
| DELETE | /albums/:albumId | Delete album |
| POST | /albums/:albumId/share | Share album with emails |

### Images
| Method | URL | Description |
|--------|-----|-------------|
| POST | /albums/:albumId/images | Upload image |
| GET | /albums/:albumId/images | Get all images |
| GET | /albums/:albumId/images/favorites | Get favorites |
| PUT | /albums/:albumId/images/:imageId/favorite | Toggle favorite |
| POST | /albums/:albumId/images/:imageId/comments | Add comment |
| DELETE | /albums/:albumId/images/:imageId | Delete image |

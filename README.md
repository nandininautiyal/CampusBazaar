#  CampusBazaar

A full-stack campus marketplace exclusively for NSUT students to buy and sell items within the college community.

---

## Live Links

- **Frontend:** https://campus-bazaar-ten.vercel.app
- **Backend API:** https://campusbazaar-backend-8ox5.onrender.com

---

##  Features

- **Auth** — Register and login with your `@nsut.ac.in` email
- **Listings** — Create, browse, search, filter, edit and delete listings
- **Image Upload** — Upload up to 5 images per listing via Cloudinary
- **Real-time Chat** — Message sellers directly using Socket.io
- **Inbox** — View all your conversations with unread indicators
- **Dark Mode** — Manual light/dark theme toggle, persisted across sessions
- **Responsive** — Works on mobile and desktop

---

## Tech Stack

### Frontend

| Tool | Purpose |
|---|---|
| React + Vite | UI framework |
| React Router DOM | Client-side routing |
| Bootstrap 5 | Styling and responsive layout |
| Axios | HTTP requests |
| Socket.io-client | Real-time messaging |

### Backend

| Tool | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary + Multer | Image storage |
| Socket.io | Real-time communication |

### Deployment

| Service | What |
|---|---|
| Vercel | Frontend |
| Render | Backend |
| MongoDB Atlas | Database |

---

## Local Setup

### Prerequisites

- Node.js v18+
- npm
- MongoDB Atlas account
- Cloudinary account

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
node server.js
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Project Structure

```text
CampusBazaar/
├── backend/
│   ├── config/          # DB + Cloudinary setup
│   ├── controllers/     # Auth, Listings, Chat logic
│   ├── middlewares/     # Auth guard, file upload, error handler
│   ├── models/          # User, Listing, Conversation, Message
│   ├── routes/          # API route definitions
│   ├── utils/           # JWT helper
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Header, ProtectedRoute
        ├── context/     # AuthContext, ThemeContext
        ├── pages/       # All page components
        └── services/    # Axios API layer
```

---
## Known Limitations

- Email verification is domain-pattern based (`@nsut.ac.in`) — no OTP verification currently
- Unread message indicator clears only on reply, not on read
- Free tier on Render may have cold start delays (~30s on first request)
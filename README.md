# Task Manager Project (Schedulo)

A full-stack task management application built with React and Node.js, featuring user authentication, task management, and email notifications.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Password Recovery**: Forgot password with OTP verification via email
- **Task Management**: Create, read, update, and delete tasks
- **Protected Routes**: Secure access to authenticated features
- **Responsive Design**: Built with Tailwind CSS and modern animations
- **Email Notifications**: Powered by Nodemailer
- **Security**: Helmet, CORS, rate limiting, and input validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion & GSAP** - Animations
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Express Validator** - Input validation
- **Helmet** - Security middleware

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Email service** credentials (for password recovery)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd TaskManagerProject
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
TaskManagerProject/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── database/        # Database connection
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.js          # Express app configuration
│   └── server.js       # Server entry point
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── App.jsx     # Main app component
    │   └── main.jsx    # Entry point
    └── public/         # Static assets
```

## 🔧 Available Scripts

### Backend
```bash
npm start          # Start the server
npm test           # Run tests (not configured yet)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `EMAIL_USER` | Email service username | Yes |
| `EMAIL_PASS` | Email service password | Yes |

## 🚦 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password

### Tasks
- `GET /api/task` - Get all tasks
- `POST /api/task` - Create new task
- `PUT /api/task/:id` - Update task
- `DELETE /api/task/:id` - Delete task

## 🎯 Usage

1. **Register**: Create a new account on the signup page
2. **Login**: Access your account with email and password
3. **Manage Tasks**: Create, edit, and delete tasks in the main dashboard
4. **Password Recovery**: Use forgot password feature if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in your `.env` file

**CORS Issues**
- Check that frontend URL matches the CORS origin in `backend/app.js`
- Default frontend runs on `http://localhost:5173`

**Email Service Not Working**
- Verify email credentials in `.env` file
- For Gmail, use App Passwords instead of regular password

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy Task Managing! 🎉**
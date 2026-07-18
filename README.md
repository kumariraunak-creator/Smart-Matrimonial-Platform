# 💍 Smart Matrimonial Platform

A full-stack **Smart Matrimonial Platform** built using the **MERN Stack** that modernizes the traditional matchmaking process. The platform provides secure user authentication, profile management, role-based access control, and an admin approval system to ensure genuine users. It also aims to integrate matrimonial services with event-related professionals such as decorators, photographers, caterers, and legal consultants.

---

## 🚀 Live Demo

🌐 **Application:**
https://smart-matrimonial-platform-1u8r-3j2s72jns.vercel.app/

> **Note:** Some features (such as the Dashboard and Admin Panel) require user authentication and appropriate user roles.

---

## ✨ Features

* 🔐 Secure User Authentication (JWT)
* 👤 User Registration & Login
* 📝 Create & Update Matrimonial Profiles
* 👨‍💼 Admin Dashboard
* ✅ User Approval & Rejection System
* 🚫 Suspend & Manage Users
* 🔒 Protected Routes
* 🎯 Role-Based Access Control (RBAC)
* 📱 Responsive User Interface
* 💾 MongoDB Database Integration
* ⚡ RESTful API Architecture
* 📂 Organized MVC Project Structure

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js

### Database

* MongoDB
* Mongoose

### Tools & Deployment

* Git & GitHub
* Vercel (Frontend)
* Render/Node Server (Backend)
* Postman

---

## 📂 Project Structure

```text
Smart-Matrimonial-Platform/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── README.md
└── package.json
```

---

## 🔑 Core Modules

### Authentication

* User Registration
* Secure Login
* JWT Token Generation
* Password Encryption

### User Module

* Create Profile
* Update Profile
* View Dashboard
* Manage Personal Information

### Admin Module

* View All Users
* Approve New Users
* Reject Users
* Suspend Users
* Manage User Accounts

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/Smart-Matrimonial-Platform.git
```

```bash
cd Smart-Matrimonial-Platform
```

---

### Install Frontend

```bash
cd client
npm install
npm start
```

---

### Install Backend

```bash
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

---

## 📡 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### User

* GET `/api/user/profile`
* PUT `/api/user/profile`

### Admin

* GET `/api/admin/users`
* PUT `/api/admin/approve/:id`
* PUT `/api/admin/reject/:id`
* PUT `/api/admin/suspend/:id`

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing using Bcrypt
* Protected Routes
* Role-Based Authorization
* Secure API Access

---

## 📸 Screenshots

Add screenshots here.

Example:

```
screenshots/
│
├── Home.png
├── Login.png
├── Register.png
├── Dashboard.png
└── AdminPanel.png
```

---

## 🎯 Future Enhancements

* 💬 Real-Time Chat
* ❤️ Match Recommendation System
* 🤖 AI-Based Compatibility Score
* 📹 Video Calling
* 🔔 Notifications
* 💳 Premium Membership
* 📍 Location-Based Search
* 📱 Mobile Application

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 👩‍💻 Developer

**Raunak Kumari**

GitHub: https://github.com/kumariraunak-creator

LinkedIn: https://www.linkedin.com/in/raunak-kumari-56913a330

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

---

## 📄 License

This project is licensed under the **MIT License**.

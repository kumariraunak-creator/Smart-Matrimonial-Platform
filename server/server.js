const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const interestRoutes = require("./routes/interestRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const consultantRoutes = require("./routes/consultantRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* ===========================
        SOCKET.IO SETUP
=========================== */

const io = new Server(server, {
  cors: {
origin: [
  "http://localhost:5173",
  "https://smart-matrimonial-platform-u3hk-6op065mtx.vercel.app",
],    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

/* ===========================
            CORS
=========================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-matrimonial-platform-u3hk-6op065mtx.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===========================
        MIDDLEWARE
=========================== */

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ===========================
          ROUTES
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/consultants", consultantRoutes);
app.use("/api/bookings", bookingRoutes);

/* ===========================
          404
=========================== */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ===========================
      GLOBAL ERROR
=========================== */

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message:
        "Profile photo must be smaller than 5MB",
    });
  }

  console.error(error);

  res.status(error.status || 500).json({
    message:
      error.message || "Internal server error",
  });
});

/* ===========================
    SOCKET AUTHENTICATION
=========================== */

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();
  } catch (error) {
    next(
      new Error("Invalid or expired token")
    );
  }
});

/* ===========================
     SOCKET CONNECTION
=========================== */

io.on("connection", (socket) => {
  console.log(
    `✅ User Connected : ${socket.user.id}`
  );

  socket.join(socket.user.id);

  socket.emit("connected", {
    success: true,
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `❌ User Disconnected : ${socket.user.id}`
    );

    console.log("Reason:", reason);
  });

  socket.on("error", (error) => {
    console.log(
      "Socket Error:",
      error.message
    );
  });
});

/* ===========================
     DATABASE CONNECTION
=========================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "✅ MongoDB Connected Successfully"
    );

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  });
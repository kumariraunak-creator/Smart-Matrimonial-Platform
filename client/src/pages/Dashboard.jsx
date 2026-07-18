import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  Heart,
  UserRound,
  Search,
  MessagesSquare,
  CalendarDays,
  Bell,
  LogOut,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api";
  const SOCKET_URL = "http://localhost:5000";

  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  const socketRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications`,
        config
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current.on(
      "newNotification",
      () => {
        fetchNotifications();
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link
          to="/"
          className="dashboard-brand"
        >
          <Heart
            size={29}
            fill="currentColor"
          />
          <span>SmartMatrimony</span>
        </Link>

        <nav className="dashboard-nav">
          <Link
            to="/dashboard"
            className="active"
          >
            <Sparkles size={20} />
            Dashboard
          </Link>

          <Link to="/profile">
            <UserRound size={20} />
            My Profile
          </Link>

          <Link to="/browse">
            <Search size={20} />
            Browse Profiles
          </Link>

          <Link to="/matches">
            <Heart size={20} />
            Interests & Matches
          </Link>

          <Link to="/chat">
            <MessagesSquare size={20} />
            Messages
          </Link>

          <Link to="/consultants">
            <CalendarDays size={20} />
            Consultants
          </Link>

          <Link
            to="/notifications"
            className="notification-link"
          >
            <Bell size={20} />

            <span>Notifications</span>

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-welcome">
              WELCOME TO YOUR DASHBOARD
            </span>

            <h1>
              Find Your Meaningful
              Connection.
            </h1>

            <p>
              Complete your profile,
              discover compatible people,
              manage connections, chat with
              matches, and connect with
              trusted consultants.
            </p>
          </div>

          <div className="dashboard-avatar">
            {currentUser.name
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>
        </header>

        <section className="dashboard-stats">
          <article className="stat-card stat-pink">
            <Heart size={27} />

            <strong>Matches</strong>

            <span>
              View accepted connections
            </span>
          </article>

          <article className="stat-card stat-purple">
            <MessagesSquare size={27} />

            <strong>Messages</strong>

            <span>
              Continue your conversations
            </span>
          </article>

          <article className="stat-card stat-orange">
            <CalendarDays size={27} />

            <strong>Bookings</strong>

            <span>
              Manage consultant bookings
            </span>
          </article>

          <article className="stat-card stat-blue">
            <Bell size={27} />

            <strong>Notifications</strong>

            <h2>{unreadCount}</h2>

            <span>
              Unread notifications
            </span>
          </article>
        </section>
                <section className="dashboard-actions">
          <div className="dashboard-section-heading">
            <div>
              <span>QUICK ACTIONS</span>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="action-grid">
            <Link
              to="/profile"
              className="action-card"
            >
              <div className="action-icon action-pink">
                <UserRound size={30} />
              </div>

              <h3>Complete Your Profile</h3>

              <p>
                Add your personal details,
                partner preferences and
                profile photo.
              </p>

              <span className="action-link">
                Manage Profile
                <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/browse"
              className="action-card"
            >
              <div className="action-icon action-purple">
                <Search size={30} />
              </div>

              <h3>Discover Profiles</h3>

              <p>
                Browse compatible profiles
                using smart search and
                preference filters.
              </p>

              <span className="action-link">
                Browse Profiles
                <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/matches"
              className="action-card"
            >
              <div className="action-icon action-orange">
                <Heart size={30} />
              </div>

              <h3>Manage Connections</h3>

              <p>
                View sent interests,
                received requests and
                accepted matrimonial
                matches.
              </p>

              <span className="action-link">
                View Connections
                <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/consultants"
              className="action-card"
            >
              <div className="action-icon action-blue">
                <CalendarDays size={30} />
              </div>

              <h3>Book a Consultant</h3>

              <p>
                Discover approved
                consultants and book trusted
                matrimonial guidance.
              </p>

              <span className="action-link">
                Find Consultants
                <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/chat"
              className="action-card"
            >
              <div className="action-icon action-purple">
                <MessagesSquare size={30} />
              </div>

              <h3>Open Chat</h3>

              <p>
                Continue conversations
                with your accepted matches
                instantly.
              </p>

              <span className="action-link">
                Open Messages
                <ArrowRight size={18} />
              </span>
            </Link>

            <Link
              to="/notifications"
              className="action-card"
            >
              <div className="action-icon action-orange">
                <Bell size={30} />
              </div>

              <h3>Notifications</h3>

              <p>
                You currently have{" "}
                <strong>
                  {unreadCount}
                </strong>{" "}
                unread notification
                {unreadCount !== 1
                  ? "s"
                  : ""}
                .
              </p>

              <span className="action-link">
                View Notifications
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
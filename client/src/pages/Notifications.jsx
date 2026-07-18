import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
} from "lucide-react";
import "./Notifications.css";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef(null);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current.on(
      "newNotification",
      (notification) => {
        setNotifications((prev) => [
          notification,
          ...prev,
        ]);

        setUnreadCount((prev) => prev + 1);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/notifications`,
        config
      );

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );

      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/notifications/${id}/read`,
        {},
        config
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to mark notification."
      );
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        config
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);

      setMessage(
        "All notifications marked as read."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update notifications."
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/notifications/${id}`,
        config
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      setMessage(
        "Notification deleted successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to delete notification."
      );
    }
  };

  const formatTime = (date) => {
    const seconds =
      Math.floor(
        (Date.now() - new Date(date)) / 1000
      );

    if (seconds < 60)
      return "Just now";

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60)
      return `${minutes} min ago`;

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24)
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;

    const days = Math.floor(
      hours / 24
    );

    if (days === 1)
      return "Yesterday";

    return `${days} days ago`;
  };
    return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <span>YOUR UPDATES</span>

          <h1>Notifications</h1>

          <p>
            Stay updated with interests, matches,
            messages, consultant bookings and other
            account activity.
          </p>
        </div>

        <div className="notification-actions">
          <div className="notification-badge">
            <Bell size={20} />
            <span>{unreadCount}</span>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllRead}
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          )}

          <a
            href="/dashboard"
            className="dashboard-btn"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      {message && (
        <div className="notifications-message">
          {message}
        </div>
      )}

      {loading ? (
        <div className="notifications-loading">
          <Loader2
            className="loading-icon"
            size={45}
          />
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={60} />

          <h2>No Notifications Yet</h2>

          <p>
            You'll see new interests, accepted
            requests, messages and booking updates
            here.
          </p>
        </div>
      ) : (
        <section className="notifications-list">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={`notification-card ${
                notification.isRead
                  ? "notification-read"
                  : ""
              }`}
            >
              <div className="notification-icon">
                <Bell size={24} />
              </div>

              <div className="notification-content">
                <span className="notification-type">
                  {notification.type ||
                    "Notification"}
                </span>

                <h2>
                  {notification.title ||
                    "New Update"}
                </h2>

                <p>
                  {notification.message}
                </p>

                <small>
                  {notification.createdAt
                    ? formatTime(
                        notification.createdAt
                      )
                    : ""}
                </small>
              </div>

              <div className="notification-buttons">
                {!notification.isRead && (
                  <button
                    className="mark-read-button"
                    onClick={() =>
                      markAsRead(
                        notification._id
                      )
                    }
                  >
                    <CheckCheck size={18} />
                    Read
                  </button>
                )}

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteNotification(
                      notification._id
                    )
                  }
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Notifications;
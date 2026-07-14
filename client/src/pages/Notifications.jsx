import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck } from "lucide-react";
import "./Notifications.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("Loading notifications...");

  const token = localStorage.getItem("token");

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

      setNotifications(response.data.notifications || []);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        config
      );

      setMessage(response.data.message);
      fetchNotifications();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update notification"
      );
    }
  };

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <span>YOUR UPDATES</span>
          <h1>Stay Connected With What Matters.</h1>
          <p>
            View important updates about interests, matches,
            conversations, bookings, and account activity.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="notifications-message">
          {message}
        </div>
      )}

      <section className="notifications-list">
        {notifications.length === 0 && !message ? (
          <div className="notifications-empty">
            <Bell size={38} />
            <h2>No Notifications Yet</h2>
            <p>Your latest updates will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              className={`notification-card ${
                notification.isRead ? "notification-read" : ""
              }`}
              key={notification._id}
            >
              <div className="notification-icon">
                <Bell size={24} />
              </div>

              <div className="notification-content">
                <span>
                  {notification.type || "Notification"}
                </span>

                <h2>
                  {notification.title || "New Update"}
                </h2>

                <p>
                  {notification.message ||
                    "You have a new notification."}
                </p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : ""}
                </small>
              </div>

              {!notification.isRead && (
                <button
                  className="mark-read-button"
                  onClick={() =>
                    markAsRead(notification._id)
                  }
                >
                  <CheckCheck size={18} />
                  Mark Read
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default Notifications;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  Check,
  X,
  Clock,
  LogOut,
} from "lucide-react";
import "./ConsultantDashboard.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function ConsultantDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/bookings/consultant`,
        config
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          status,
        },
        config
      );

      setMessage(response.data.message);
      fetchBookings();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update booking"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="consultant-dashboard-page">
      <aside className="consultant-dashboard-sidebar">
        <div className="consultant-dashboard-brand">
          <CalendarDays size={30} />

          <span>SmartMatrimony</span>
        </div>

        <nav className="consultant-dashboard-nav">
          <div className="consultant-dashboard-active">
            <CalendarDays size={20} />

            My Bookings
          </div>
        </nav>

        <button
          className="consultant-dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />

          Logout
        </button>
      </aside>

      <main className="consultant-dashboard-main">
        <header className="consultant-dashboard-header">
          <div>
            <span>CONSULTANT DASHBOARD</span>

            <h1>Manage Your Consultation Bookings.</h1>

            <p>
              Review matrimonial consultation requests and
              accept, reject, or complete your bookings.
            </p>
          </div>

          <div className="consultant-dashboard-icon">
            <CalendarDays size={45} />
          </div>
        </header>

        {message && (
          <div className="consultant-dashboard-message">
            {message}
          </div>
        )}

        <section className="consultant-bookings-section">
          <div className="consultant-section-heading">
            <span>BOOKING REQUESTS</span>

            <h2>Your Consultation Bookings</h2>
          </div>

          <div className="consultant-bookings-grid">
            {bookings.length === 0 ? (
              <div className="consultant-bookings-empty">
                No consultation bookings available.
              </div>
            ) : (
              bookings.map((booking) => (
                <article
                  className="consultant-booking-card"
                  key={booking._id}
                >
                  <div className="consultant-booking-top">
                    <div className="consultant-user-avatar">
                      {booking.user?.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <span
                      className={`consultant-booking-status status-${booking.status}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <h3>
                    {booking.user?.name ||
                      "Matrimonial User"}
                  </h3>

                  <p className="consultant-user-email">
                    {booking.user?.email}
                  </p>

                  <div className="consultant-booking-info">
                    <p>
                      <CalendarDays size={18} />

                      {booking.bookingDate
                        ? new Date(
                            booking.bookingDate
                          ).toLocaleString()
                        : "Booking date unavailable"}
                    </p>

                    <p>
                      <Clock size={18} />

                      Created{" "}
                      {booking.createdAt
                        ? new Date(
                            booking.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>

                  <p className="consultant-booking-message">
                    {booking.message ||
                      "No booking message provided."}
                  </p>

                  {booking.status === "pending" && (
                    <div className="consultant-booking-actions">
                      <button
                        className="consultant-accept-button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "accepted"
                          )
                        }
                      >
                        <Check size={18} />

                        Accept
                      </button>

                      <button
                        className="consultant-reject-button"
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "rejected"
                          )
                        }
                      >
                        <X size={18} />

                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      className="consultant-complete-button"
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      <Check size={18} />

                      Mark Completed
                    </button>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ConsultantDashboard;
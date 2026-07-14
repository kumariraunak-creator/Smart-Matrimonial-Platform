import { useEffect, useState } from "react";
import axios from "axios";
import "./Consultants.css";
import {
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  IndianRupee,
} from "lucide-react";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Consultants() {
  const [consultants, setConsultants] = useState([]);
  const [message, setMessage] = useState("Loading consultants...");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/consultants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConsultants(response.data.consultants || []);
        setMessage("");
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load consultants"
        );
      }
    };

    fetchConsultants();
  }, [token]);

  const bookConsultant = async (consultantId) => {
    try {
      const bookingDate = new Date();

      bookingDate.setDate(bookingDate.getDate() + 7);

      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          consultantId,
          bookingDate: bookingDate.toISOString(),
          message:
            "I would like to book a matrimonial consultation.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to book consultant"
      );
    }
  };

  return (
    <div className="consultants-page">
      <header className="consultants-header">
        <div>
          <span>TRUSTED CONSULTANTS</span>

          <h1>Get Guidance From Matrimonial Experts.</h1>

          <p>
            Discover approved consultants and book professional
            matrimonial guidance.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="consultants-message">
          {message}
        </div>
      )}

      <section className="consultants-grid">
        {consultants.length === 0 && !message ? (
          <p className="consultants-empty">
            No approved consultants are available right now.
          </p>
        ) : (
          consultants.map((consultant) => (
            <article
              className="consultant-card"
              key={consultant._id}
            >
              <div className="consultant-avatar">
                {consultant.user?.name
                  ?.charAt(0)
                  .toUpperCase() || "C"}
              </div>

              <span className="consultant-status">
                {consultant.isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>

              <h2>
                {consultant.user?.name ||
                  "Matrimonial Consultant"}
              </h2>

              <p className="consultant-specialization">
                {consultant.specialization}
              </p>

              <div className="consultant-details">
                <p>
                  <MapPin size={18} />
                  {consultant.city}
                </p>

                <p>
                  <BriefcaseBusiness size={18} />
                  {consultant.experience} years experience
                </p>

                <p>
                  <IndianRupee size={18} />
                  ₹{consultant.consultationFee} consultation fee
                </p>
              </div>

              <p className="consultant-bio">
                {consultant.bio}
              </p>

              <button
                className="book-consultant-button"
                disabled={!consultant.isAvailable}
                onClick={() =>
                  bookConsultant(
                    consultant.user?._id || consultant.user
                  )
                }
              >
                <CalendarDays size={19} />
                Book Consultation
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default Consultants;
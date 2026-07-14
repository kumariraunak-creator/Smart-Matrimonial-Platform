import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Check, X } from "lucide-react";
import "./Matches.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Matches() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchInterests = async () => {
    try {
      const [receivedResponse, sentResponse, matchesResponse] =
        await Promise.all([
          axios.get(`${API_URL}/interests/received`, config),
          axios.get(`${API_URL}/interests/sent`, config),
          axios.get(`${API_URL}/interests/matches`, config),
        ]);

      setReceived(receivedResponse.data.interests || []);
      setSent(sentResponse.data.interests || []);
      setMatches(matchesResponse.data.matches || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load connections"
      );
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const updateInterest = async (interestId, action) => {
    try {
      const response = await axios.put(
        `${API_URL}/interests/${interestId}/${action}`,
        {},
        config
      );

      setMessage(response.data.message);
      fetchInterests();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update interest"
      );
    }
  };

  return (
    <div className="matches-page">
      <header className="matches-header">
        <div>
          <span>INTERESTS & MATCHES</span>
          <h1>Manage Your Meaningful Connections.</h1>
          <p>
            Review received interests, track sent requests, and
            discover accepted matrimonial matches.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="matches-message">{message}</div>
      )}

      <section className="matches-section">
        <h2>Received Interests</h2>

        <div className="connection-grid">
          {received.length === 0 ? (
            <p className="empty-state">
              No received interests yet.
            </p>
          ) : (
            received.map((interest) => (
              <article
                className="connection-card"
                key={interest._id}
              >
                <div className="connection-avatar">
                  <Heart size={30} />
                </div>

                <h3>
                  {interest.sender?.name ||
                    "Matrimonial User"}
                </h3>

                <p>{interest.sender?.email}</p>

                <div className="interest-actions">
                  <button
                    className="accept-button"
                    onClick={() =>
                      updateInterest(interest._id, "accept")
                    }
                  >
                    <Check size={18} />
                    Accept
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      updateInterest(interest._id, "reject")
                    }
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="matches-section">
        <h2>Sent Interests</h2>

        <div className="connection-grid">
          {sent.length === 0 ? (
            <p className="empty-state">
              No sent interests yet.
            </p>
          ) : (
            sent.map((interest) => (
              <article
                className="connection-card"
                key={interest._id}
              >
                <div className="connection-avatar purple-avatar">
                  <Heart size={30} />
                </div>

                <h3>
                  {interest.receiver?.name ||
                    "Matrimonial User"}
                </h3>

                <p>
                  Status:{" "}
                  <strong>{interest.status}</strong>
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="matches-section">
        <h2>Accepted Matches</h2>

        <div className="connection-grid">
          {matches.length === 0 ? (
            <p className="empty-state">
              No accepted matches yet.
            </p>
          ) : (
            matches.map((match) => (
              <article
                className="connection-card match-highlight"
                key={match._id}
              >
                <div className="connection-avatar orange-avatar">
                  <Heart size={30} />
                </div>

                <h3>
                  {match.user?.name ||
                    match.sender?.name ||
                    match.receiver?.name ||
                    "Your Match"}
                </h3>

                <p>Accepted matrimonial connection</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Matches;
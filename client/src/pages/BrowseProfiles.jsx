import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MapPin,
  GraduationCap,
  Briefcase,
  Loader2,
  CheckCircle,
} from "lucide-react";
import "./BrowseProfiles.css";

const API_URL = "http://localhost:5000/api";

function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [sentInterests, setSentInterests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  console.log("✅ BrowseProfiles Mounted");
  fetchProfiles();
}, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/profile/browse`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.profiles || [];

      setProfiles(data);

      if (data.length === 0) {
        setMessage("No profiles available.");
      } else {
        setMessage("");
      }
    } catch (error) {
  console.log("ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);

  setMessage(
    error.response?.data?.message ||
      "Failed to load profiles."
  );

    } finally {
      setLoading(false);
    }
  };

  const sendInterest = async (receiverId) => {
    try {
      setSendingId(receiverId);

      const response = await axios.post(
        `${API_URL}/interests/send/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSentInterests((prev) => [
        ...prev,
        receiverId,
      ]);

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send interest."
      );
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="browse-page">
        <div className="browse-loading">
          <Loader2
            size={42}
            className="spin"
          />

          <h2>Loading Profiles...</h2>

          <p>
            Finding the best matches for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <header className="browse-header">
        <div>
          <span>DISCOVER PROFILES</span>

          <h1>
            Find Someone Worth
            <br />
            Knowing.
          </h1>

          <p>
            Browse verified matrimonial
            profiles and connect with people
            who match your preferences.
          </p>
        </div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>
      </header>

      {message && (
        <div className="browse-message">
          {message}
        </div>
      )}

      <section className="profiles-grid">
        {profiles.map((profile) => {
          const receiverId =
            profile.user?._id || profile.user;

          const interestSent =
            sentInterests.includes(receiverId);

          return (        
                <article
              className="profile-card"
              key={profile._id}
            >
              <div className="browse-profile-photo">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={
                      profile.user?.name ||
                      "Profile"
                    }
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <span>
                    {profile.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div className="profile-card-content">
                <span className="profile-age">
                  {profile.age || "N/A"} years
                </span>

                <h2>
                  {profile.user?.name ||
                    "Matrimonial Profile"}
                </h2>

                <div className="profile-details">
                  <p>
                    <MapPin size={16} />
                    {profile.city ||
                      "Not specified"}
                  </p>

                  <p>
                    <GraduationCap size={16} />
                    {profile.education ||
                      "Not specified"}
                  </p>

                  <p>
                    <Briefcase size={16} />
                    {profile.profession ||
                      "Not specified"}
                  </p>
                </div>

                <p className="profile-card-bio">
                  {profile.bio ||
                    "This user hasn't added a bio yet."}
                </p>

                <button
                  className="send-interest-button"
                  disabled={
                    sendingId === receiverId ||
                    interestSent
                  }
                  onClick={() =>
                    sendInterest(receiverId)
                  }
                >
                  {sendingId === receiverId ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />
                      Sending...
                    </>
                  ) : interestSent ? (
                    <>
                      <CheckCircle size={18} />
                      Interest Sent
                    </>
                  ) : (
                    <>
                      <Heart size={18} />
                      Send Interest
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default BrowseProfiles;
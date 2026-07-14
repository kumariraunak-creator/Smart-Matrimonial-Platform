import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MapPin, GraduationCap, Briefcase } from "lucide-react";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState("Loading profiles...");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/profile/browse`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfiles(response.data.profiles);
        setMessage("");
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load profiles"
        );
      }
    };

    fetchProfiles();
  }, [token]);

  const sendInterest = async (receiverId) => {
    try {
      const response = await axios.post(
        `${API_URL}/interests/send/${receiverId}`,
        {},
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
          "Failed to send interest"
      );
    }
  };

  return (
    <div className="browse-page">
      <header className="browse-header">
        <div>
          <span>DISCOVER PROFILES</span>
          <h1>Find Someone Worth Knowing.</h1>
          <p>
            Explore matrimonial profiles and send an interest when
            you find a meaningful connection.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="browse-message">{message}</div>
      )}

      <section className="profiles-grid">
        {profiles.map((profile) => (
          <article className="profile-card" key={profile._id}>
            <div className="browse-profile-photo">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Matrimonial profile"
                />
              ) : (
                <span>{profile.age || "?"}</span>
              )}
            </div>

            <div className="profile-card-content">
              <span className="profile-age">
                {profile.age} years
              </span>

              <h2>{profile.user?.name || "Matrimonial Profile"}</h2>

              <div className="profile-details">
                <p>
                  <MapPin size={17} />
                  {profile.city}
                </p>

                <p>
                  <GraduationCap size={17} />
                  {profile.education}
                </p>

                <p>
                  <Briefcase size={17} />
                  {profile.profession}
                </p>
              </div>

              <p className="profile-card-bio">
                {profile.bio || "No bio added yet."}
              </p>

              <button
                className="send-interest-button"
                onClick={() => sendInterest(profile.user?._id || profile.user)}
              >
                <Heart size={19} />
                Send Interest
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default BrowseProfiles;
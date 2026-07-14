import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Save, UserRound } from "lucide-react";
import "./Profile.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Profile() {
  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    city: "",
    education: "",
    profession: "",
    bio: "",
  });

  const [photo, setPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/profile/me`,
          config
        );

        setProfile(response.data.profile);
        setProfilePhoto(response.data.profile.profilePhoto);
      } catch (error) {
        if (error.response?.status !== 404) {
          setMessage(
            error.response?.data?.message ||
              "Failed to load profile"
          );
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        profile,
        config
      );

      setProfile(response.data.profile);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) {
      setMessage("Please select a photo");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profilePhoto", photo);

      const response = await axios.put(
        `${API_URL}/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfilePhoto(response.data.profilePhoto);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Photo upload failed"
      );
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div>
          <span>MY MATRIMONIAL PROFILE</span>
          <h1>Build a Profile That Represents You.</h1>
          <p>
            Keep your personal information updated to discover more
            meaningful and compatible connections.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      <div className="profile-layout">
        <aside className="profile-photo-card">
          <div className="profile-photo-wrapper">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" />
            ) : (
              <UserRound size={65} />
            )}
          </div>

          <h2>Your Profile Photo</h2>

          <p>
            Upload a clear JPG, PNG, or WEBP photo up to 5MB.
          </p>

          <label className="photo-select-button">
            <Camera size={19} />
            Choose Photo

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setPhoto(event.target.files[0])
              }
            />
          </label>

          <button
            className="photo-upload-button"
            onClick={handlePhotoUpload}
          >
            Upload Photo
          </button>
        </aside>

        <form
          className="profile-form-card"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-heading">
            <h2>Personal Information</h2>
            <p>
              Add the details that help others understand you better.
            </p>
          </div>

          {message && (
            <div className="profile-message">{message}</div>
          )}

          <div className="profile-form-grid">
            <label>
              <span>Age</span>
              <input
                type="number"
                name="age"
                value={profile.age || ""}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Gender</span>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              <span>City</span>
              <input
                type="text"
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Education</span>
              <input
                type="text"
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Profession</span>
              <input
                type="text"
                name="profession"
                value={profile.profession || ""}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="profile-bio-field">
            <span>About You</span>
            <textarea
              name="bio"
              rows="5"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Tell others something meaningful about yourself..."
            />
          </label>

          <button className="profile-save-button" type="submit">
            <Save size={19} />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
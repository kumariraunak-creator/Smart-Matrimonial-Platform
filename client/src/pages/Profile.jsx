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
  const [profilePhoto, setProfilePhoto] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/profile/me`,
        config
      );

      if (response.data.profile) {
        setProfile({
          age: response.data.profile.age || "",
          gender: response.data.profile.gender || "",
          city: response.data.profile.city || "",
          education:
            response.data.profile.education || "",
          profession:
            response.data.profile.profession || "",
          bio: response.data.profile.bio || "",
        });

        setProfilePhoto(
          response.data.profile.profilePhoto || ""
        );
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      }
    }
  };

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

      setMessage(response.data.message);
      fetchProfile();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) {
      setMessage("Please select a photo first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profilePhoto", photo);

      const response = await axios.post(
        `${API_URL}/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePhoto(response.data.profilePhoto);
      setMessage(response.data.message);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      setMessage(
        error.response?.data?.message ||
          error.message ||
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
            Keep your personal information updated to
            discover more meaningful connections.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      <div className="profile-layout">
        <aside className="profile-photo-card">
          <div className="profile-photo-wrapper">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
              />
            ) : (
              <UserRound size={65} />
            )}
          </div>

          <h2>Your Profile Photo</h2>

          <p>
            Upload JPG, PNG or WEBP image (Max 5MB)
          </p>

          <label className="photo-select-button">
            <Camera size={18} />

            Choose Photo

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(e.target.files[0])
              }
            />
          </label>

          <button
            type="button"
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
              Complete your matrimonial profile.
            </p>
          </div>

          {message && (
            <div className="profile-message">
              {message}
            </div>
          )}

          <div className="profile-form-grid">
            <label>
              <span>Age</span>

              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Gender</span>

              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </label>

            <label>
              <span>City</span>

              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Education</span>

              <input
                type="text"
                name="education"
                value={profile.education}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Profession</span>

              <input
                type="text"
                name="profession"
                value={profile.profession}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="profile-bio-field">
            <span>Bio</span>

            <textarea
              rows="5"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
            />
          </label>

          <button
            className="profile-save-button"
            type="submit"
          >
            <Save size={18} />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  User,
  Mail,
  Lock,
  Users,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import "./Auth.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/auth/register`,
        formData
      );

      setMessage(
        response.data.message ||
          "Registration successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div>

      <div className="auth-decoration auth-decoration-two"></div>

      <Link to="/" className="auth-brand">
        <Heart size={30} fill="currentColor" />

        <span>SmartMatrimony</span>
      </Link>

      <div className="auth-container">
        <div className="auth-info">
          <span className="auth-badge">
            START YOUR JOURNEY
          </span>

          <h1>
            Create Your Account and Find a
            <span> Meaningful Connection.</span>
          </h1>

          <p>
            Join a modern matrimonial platform where users can
            discover profiles, build genuine connections, chat
            securely, and connect with trusted consultants.
          </p>

          <div className="auth-highlights">
            <div>
              ♥ Discover compatible profiles
            </div>

            <div>
              ✦ Connect with trusted consultants
            </div>

            <div>
              ✓ Secure and real-time experience
            </div>
          </div>
        </div>

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >
          <div className="auth-card-heading">
            <h2>Create Account</h2>

            <p>
              Enter your details to join SmartMatrimony.
            </p>
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <label className="input-group">
            <span>Full Name</span>

            <div className="input-wrapper">
              <User size={19} />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label className="input-group">
            <span>Email Address</span>

            <div className="input-wrapper">
              <Mail size={19} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label className="input-group">
            <span>Password</span>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label className="input-group">
            <span>Register As</span>

            <div className="input-wrapper">
              <Users size={19} />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">
                  Matrimonial User
                </option>

                <option value="consultant">
                  Matrimonial Consultant
                </option>

                <option value="service_provider">
                  Service Provider
                </option>
              </select>
            </div>
          </label>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && <ArrowRight size={19} />}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}

            <Link to="/login">
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
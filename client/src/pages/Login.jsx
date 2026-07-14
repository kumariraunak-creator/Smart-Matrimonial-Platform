import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import axios from "axios";
import "./Auth.css";

const API_URL = "https://smart-matrimonial-platform.onrender.com/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        `${API_URL}/auth/login`,
        formData
      );

      localStorage.setItem("token", response.data.token);

      const payload = JSON.parse(
        atob(response.data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);

      if (payload.role === "admin") {
        navigate("/admin");
      } else if (
        payload.role === "consultant" ||
        payload.role === "service_provider"
      ) {
        navigate("/consultant-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
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
            WELCOME BACK
          </span>

          <h1>
            Continue Your Journey to a
            <span> Meaningful Connection.</span>
          </h1>

          <p>
            Login to explore compatible profiles, manage interests,
            chat with matches, book consultants, and receive real-time
            updates.
          </p>

          <div className="auth-highlights">
            <div>♥ Discover compatible profiles</div>
            <div>✦ Build genuine connections</div>
            <div>✓ Secure and trusted experience</div>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-heading">
            <h2>Welcome Back</h2>
            <p>Enter your account details to continue.</p>
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}

            {!loading && <ArrowRight size={19} />}
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
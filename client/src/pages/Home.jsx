import { Heart, Search, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";
function Home() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="brand">
          <Heart size={30} fill="currentColor" />
          <span>SmartMatrimony</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login" className="login-link">
            Login
          </Link>
          <Link to="/register" className="nav-button">
            Join Now
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            ❤️ Trusted Connections. Meaningful Relationships.
          </span>

          <h1>
            Find Someone Who Makes Your
            <span> Story Beautiful.</span>
          </h1>

          <p>
            Discover compatible profiles, build genuine connections,
            chat in real time, and connect with trusted matrimonial
            consultants—all in one secure platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Find Your Match
              <ArrowRight size={20} />
            </Link>

            <Link to="/login" className="secondary-button">
              Explore Profiles
            </Link>
          </div>

          <div className="trust-row">
            <span>✓ Secure Profiles</span>
            <span>✓ Smart Matching</span>
            <span>✓ Trusted Consultants</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow"></div>

          <div className="match-card main-match-card">
            <div className="profile-avatar">RK</div>

            <div>
              <h3>Meaningful Connections</h3>
              <p>Find profiles aligned with your preferences.</p>
            </div>

            <div className="compatibility">92% Match</div>
          </div>

          <div className="floating-card floating-card-one">
            <ShieldCheck size={27} />
            <div>
              <strong>Safe & Secure</strong>
              <span>Protected experience</span>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <MessageCircle size={27} />
            <div>
              <strong>Real-Time Chat</strong>
              <span>Connect instantly</span>
            </div>
          </div>

          <div className="heart-decoration heart-one">♥</div>
          <div className="heart-decoration heart-two">♥</div>
        </div>
      </main>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span>WHY CHOOSE US</span>
          <h2>Everything You Need to Find the Right Connection</h2>
          <p>
            A modern matrimonial experience built around compatibility,
            security, communication, and trusted guidance.
          </p>
        </div>

        <div className="features-grid">
          <article className="feature-card pink-card">
            <div className="feature-icon">
              <Search size={30} />
            </div>
            <h3>Smart Discovery</h3>
            <p>
              Browse and filter profiles based on age, city, education,
              profession, and personal preferences.
            </p>
          </article>

          <article className="feature-card purple-card">
            <div className="feature-icon">
              <Heart size={30} />
            </div>
            <h3>Meaningful Matches</h3>
            <p>
              Send interests, accept genuine connections, and build
              relationships with compatible people.
            </p>
          </article>

          <article className="feature-card orange-card">
            <div className="feature-icon">
              <MessageCircle size={30} />
            </div>
            <h3>Real-Time Communication</h3>
            <p>
              Chat instantly and receive real-time notifications for
              important interactions and updates.
            </p>
          </article>

          <article className="feature-card blue-card">
            <div className="feature-icon">
              <ShieldCheck size={30} />
            </div>
            <h3>Trusted Services</h3>
            <p>
              Discover approved matrimonial consultants and book
              professional guidance securely.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  UserRound,
  Search,
  MessagesSquare,
  CalendarDays,
  Bell,
  LogOut,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <Heart size={29} fill="currentColor" />
          <span>SmartMatrimony</span>
        </Link>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="active">
            <Sparkles size={20} />
            Dashboard
          </Link>

          <Link to="/profile">
            <UserRound size={20} />
            My Profile
          </Link>

          <Link to="/browse">
            <Search size={20} />
            Browse Profiles
          </Link>

          <Link to="/matches">
            <Heart size={20} />
            Interests & Matches
          </Link>

          <Link to="/chat">
            <MessagesSquare size={20} />
            Messages
          </Link>

          <Link to="/consultants">
            <CalendarDays size={20} />
            Consultants
          </Link>

          <Link to="/notifications">
            <Bell size={20} />
            Notifications
          </Link>
        </nav>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-welcome">
              WELCOME TO YOUR DASHBOARD
            </span>

            <h1>Find Your Meaningful Connection.</h1>

            <p>
              Complete your profile, discover compatible people,
              manage connections, chat with matches, and connect
              with trusted consultants.
            </p>
          </div>

          <div className="dashboard-avatar">U</div>
        </header>

        <section className="dashboard-stats">
          <article className="stat-card stat-pink">
            <Heart size={27} />
            <strong>Matches</strong>
            <span>View accepted connections</span>
          </article>

          <article className="stat-card stat-purple">
            <MessagesSquare size={27} />
            <strong>Messages</strong>
            <span>Continue your conversations</span>
          </article>

          <article className="stat-card stat-orange">
            <CalendarDays size={27} />
            <strong>Bookings</strong>
            <span>Manage consultant bookings</span>
          </article>

          <article className="stat-card stat-blue">
            <Bell size={27} />
            <strong>Notifications</strong>
            <span>Stay updated in real time</span>
          </article>
        </section>

        <section className="dashboard-actions">
          <div className="dashboard-section-heading">
            <div>
              <span>QUICK ACTIONS</span>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="action-grid">
            <Link to="/profile" className="action-card">
              <div className="action-icon action-pink">
                <UserRound size={30} />
              </div>

              <h3>Complete Your Profile</h3>

              <p>
                Add your personal details, partner preferences,
                and profile photo.
              </p>

              <span className="action-link">
                Manage Profile <ArrowRight size={18} />
              </span>
            </Link>

            <Link to="/browse" className="action-card">
              <div className="action-icon action-purple">
                <Search size={30} />
              </div>

              <h3>Discover Profiles</h3>

              <p>
                Browse compatible profiles using smart search
                and preference filters.
              </p>

              <span className="action-link">
                Browse Profiles <ArrowRight size={18} />
              </span>
            </Link>

            <Link to="/matches" className="action-card">
              <div className="action-icon action-orange">
                <Heart size={30} />
              </div>

              <h3>Manage Connections</h3>

              <p>
                View sent interests, received requests, and
                accepted matrimonial matches.
              </p>

              <span className="action-link">
                View Connections <ArrowRight size={18} />
              </span>
            </Link>

            <Link to="/consultants" className="action-card">
              <div className="action-icon action-blue">
                <CalendarDays size={30} />
              </div>

              <h3>Book a Consultant</h3>

              <p>
                Discover approved consultants and book trusted
                matrimonial guidance.
              </p>

              <span className="action-link">
                Find Consultants <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
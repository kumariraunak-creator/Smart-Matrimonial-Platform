import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  Users,
  UserCheck,
  Check,
  X,
  LogOut,
  Ban,
  RotateCcw,
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAdminData = async () => {
    try {
      setMessage("");

      const [
        usersResponse,
        consultantsResponse,
        statsResponse,
      ] = await Promise.all([
        axios.get(
          `${API_URL}/admin/pending-users`,
          config
        ),

        axios.get(
          `${API_URL}/admin/pending-consultants`,
          config
        ),

        axios.get(
          `${API_URL}/admin/dashboard`,
          config
        ),
      ]);

      setPendingUsers(
        usersResponse.data.users ||
          usersResponse.data.pendingUsers ||
          []
      );

      setConsultants(
        consultantsResponse.data.consultants ||
          consultantsResponse.data.profiles ||
          []
      );

      setStats(
        statsResponse.data.stats ||
          statsResponse.data ||
          {}
      );
    } catch (error) {
      console.log(
        "ADMIN DASHBOARD ERROR:",
        error.response?.data || error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateUserStatus = async (userId, action) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/${action}-user/${userId}`,
        {},
        config
      );

      setMessage(response.data.message);

      fetchAdminData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          `Failed to ${action} user`
      );
    }
  };

  const updateConsultantStatus = async (
    profileId,
    action
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/${action}-consultant/${profileId}`,
        {},
        config
      );

      setMessage(response.data.message);

      fetchAdminData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          `Failed to ${action} consultant`
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <ShieldCheck size={30} />
          <span>SmartMatrimony</span>
        </div>

        <div className="admin-navigation">
          <div className="admin-nav-active">
            <ShieldCheck size={20} />
            Admin Dashboard
          </div>

          <div>
            <Users size={20} />
            Pending Users
          </div>

          <div>
            <UserCheck size={20} />
            Consultant Approvals
          </div>
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>ADMIN CONTROL CENTER</span>

            <h1>
              Manage Your Matrimonial Platform.
            </h1>

            <p>
              Approve registered users, review consultant
              applications, and manage platform activity.
            </p>
          </div>

          <div className="admin-shield">
            <ShieldCheck size={48} />
          </div>
        </header>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <section className="admin-stats">
          <article className="admin-stat-card admin-stat-pink">
            <Users size={28} />

            <strong>
              {stats.totalUsers ??
                stats.usersCount ??
                pendingUsers.length}
            </strong>

            <span>Total Platform Users</span>
          </article>

          <article className="admin-stat-card admin-stat-purple">
            <UserCheck size={28} />

            <strong>
              {stats.pendingUsers ??
                stats.pendingUsersCount ??
                pendingUsers.length}
            </strong>

            <span>Pending User Approvals</span>
          </article>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <span>USER APPROVALS</span>

            <h2>Pending Users</h2>
          </div>

          <div className="admin-consultant-grid">
            {pendingUsers.length === 0 ? (
              <div className="admin-empty">
                No pending users available.
              </div>
            ) : (
              pendingUsers.map((user) => (
                <article
                  className="admin-consultant-card"
                  key={user._id}
                >
                  <div className="admin-consultant-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <h3>
                    {user.name || "Matrimonial User"}
                  </h3>

                  <p>{user.email}</p>

                  <div className="admin-consultant-info">
                    <span>
                      Role: {user.role || "user"}
                    </span>

                    <span>
                      Status:{" "}
                      {user.accountStatus || "pending"}
                    </span>

                    <span>
                      Verification:{" "}
                      {user.verificationStatus ||
                        "unverified"}
                    </span>
                  </div>

                  <div className="admin-approval-actions">
                    <button
                      className="admin-approve-button"
                      onClick={() =>
                        updateUserStatus(
                          user._id,
                          "approve"
                        )
                      }
                    >
                      <Check size={18} />
                      Approve
                    </button>

                    <button
                      className="admin-reject-button"
                      onClick={() =>
                        updateUserStatus(
                          user._id,
                          "reject"
                        )
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

        <section className="admin-section">
          <div className="admin-section-heading">
            <span>CONSULTANT MANAGEMENT</span>

            <h2>Pending Consultant Approvals</h2>
          </div>

          <div className="admin-consultant-grid">
            {consultants.length === 0 ? (
              <div className="admin-empty">
                No pending consultant approvals.
              </div>
            ) : (
              consultants.map((consultant) => (
                <article
                  className="admin-consultant-card"
                  key={consultant._id}
                >
                  <div className="admin-consultant-avatar">
                    {consultant.user?.name
                      ?.charAt(0)
                      .toUpperCase() || "C"}
                  </div>

                  <h3>
                    {consultant.user?.name ||
                      "Consultant"}
                  </h3>

                  <p>
                    {consultant.user?.email ||
                      "Email unavailable"}
                  </p>

                  <div className="admin-consultant-info">
                    <span>
                      {consultant.specialization ||
                        "Specialization not added"}
                    </span>

                    <span>
                      {consultant.experience || 0} years
                      experience
                    </span>

                    <span>
                      {consultant.city ||
                        "City not added"}
                    </span>
                  </div>

                  <div className="admin-approval-actions">
                    <button
                      className="admin-approve-button"
                      onClick={() =>
                        updateConsultantStatus(
                          consultant._id,
                          "approve"
                        )
                      }
                    >
                      <Check size={18} />
                      Approve
                    </button>

                    <button
                      className="admin-reject-button"
                      onClick={() =>
                        updateConsultantStatus(
                          consultant._id,
                          "reject"
                        )
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

        <section className="admin-section">
          <div className="admin-section-heading">
            <span>ACCOUNT MANAGEMENT</span>

            <h2>Suspend / Reactivate User</h2>
          </div>

          <div className="admin-empty">
            Suspend and reactivate actions are ready in
            the backend. We will connect the complete users
            list in the next step.
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
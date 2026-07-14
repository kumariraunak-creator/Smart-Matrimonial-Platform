import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import {
  ShieldCheck,
  Users,
  UserCheck,
  Check,
  X,
  LogOut,
} from "lucide-react";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAdminData = async () => {
    try {
      const [usersResponse, consultantsResponse] =
        await Promise.all([
          axios.get(`${API_URL}/admin/users`, config),

          axios.get(
            `${API_URL}/admin/consultants/pending`,
            config
          ),
        ]);

      setUsers(usersResponse.data.users || []);

      setConsultants(
        consultantsResponse.data.consultants || []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateConsultantStatus = async (
    consultantId,
    action
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/consultants/${consultantId}/${action}`,
        {},
        config
      );

      setMessage(response.data.message);

      fetchAdminData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update consultant"
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
            Platform Users
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

            <h1>Manage Your Matrimonial Platform.</h1>

            <p>
              Review platform activity, manage registered users,
              and approve trusted matrimonial consultants.
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

            <strong>{users.length}</strong>

            <span>Total Platform Users</span>
          </article>

          <article className="admin-stat-card admin-stat-purple">
            <UserCheck size={28} />

            <strong>{consultants.length}</strong>

            <span>Pending Consultant Approvals</span>
          </article>
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
                    {consultant.user?.email}
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
            <span>REGISTERED ACCOUNTS</span>

            <h2>Platform Users</h2>
          </div>

          <div className="admin-users-table">
            {users.length === 0 ? (
              <div className="admin-empty">
                No users available.
              </div>
            ) : (
              users.map((user) => (
                <div
                  className="admin-user-row"
                  key={user._id}
                >
                  <div className="admin-user-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div className="admin-user-details">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <span className="admin-role-badge">
                    {user.role}
                  </span>

                  <span className="admin-status-badge">
                    {user.accountStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
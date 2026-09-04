import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function OwnerDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/owner/dashboard');
      setStores(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to load dashboard',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const changePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Store Owner Dashboard</h1>
          <p>View your store ratings and customers</p>
        </div>

        <div className="dashboard-actions">
          <button onClick={changePassword} className="secondary-button">
            Change Password
          </button>

          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {loading && <p>Loading dashboard...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && stores.length === 0 && (
          <div className="empty-state">
            <h2>No Store Found</h2>
            <p>No store has been assigned to your account yet.</p>
          </div>
        )}

        {!loading &&
          !error &&
          stores.map((store) => (
            <section className="owner-store-card" key={store.id}>
              <div className="owner-store-header">
                <div>
                  <h2>{store.name}</h2>
                  <p>{store.address}</p>
                  <p>{store.email}</p>
                </div>

                <div className="average-rating">
                  <span className="rating-number">{store.averageRating}</span>
                  <span className="rating-star">★</span>
                  <span className="rating-label">Average Rating</span>
                </div>
              </div>

              <div className="owner-stat">
                <span className="stat-number">{store.ratedUsers.length}</span>
                <span className="stat-label">Users Rated</span>
              </div>

              <div className="rated-users-section">
                <h3>Users Who Rated Your Store</h3>

                {store.ratedUsers.length === 0 ? (
                  <p className="empty-message">
                    No users have rated your store yet.
                  </p>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Rating</th>
                        </tr>
                      </thead>

                      <tbody>
                        {store.ratedUsers.map((user) => (
                          <tr key={user.userId}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className="user-rating">
                                {user.rating} ★
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}

export default OwnerDashboard;
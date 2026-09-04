import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || 'Failed to load user details',
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return <div className="dashboard-page">Loading user details...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <p className="error-message">{error}</p>
        <button
          className="secondary-button"
          onClick={() => navigate('/admin')}
        >
          Back to Admin
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>User Details</h1>
          <p>Complete information about this user</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate('/admin')}
        >
          ← Back to Admin
        </button>
      </header>

      <main className="dashboard-content">
        <section className="details-card">
          <h2>{user.name}</h2>

          <div className="details-grid">
            <div>
              <strong>User ID</strong>
              <p>{user.id}</p>
            </div>

            <div>
              <strong>Name</strong>
              <p>{user.name}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{user.email}</p>
            </div>

            <div>
              <strong>Address</strong>
              <p>{user.address}</p>
            </div>

            <div>
              <strong>Role</strong>
              <p>{user.role.replaceAll('_', ' ')}</p>
            </div>
          </div>
        </section>

        {user.role === 'STORE_OWNER' && (
          <section className="details-card">
            <h2>Store Owner Information</h2>

            {user.stores?.length === 0 ? (
              <p>No store assigned to this owner.</p>
            ) : (
              user.stores?.map((store) => (
                <div className="owner-detail-store" key={store.storeId}>
                  <h3>{store.storeName}</h3>

                  <p>
                    <strong>Store ID:</strong> {store.storeId}
                  </p>

                  <p>
                    <strong>Average Rating:</strong>{' '}
                    {store.rating} ★
                  </p>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminUserDetails;
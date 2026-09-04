import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function UserDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const loadStores = async (searchValue = '') => {
    try {
      setLoading(true);

      const response = await api.get('/stores', {
        params: searchValue ? { search: searchValue } : {},
      });

      setStores(response.data);

      const initialRatings = {};

      response.data.forEach((store) => {
        initialRatings[store.id] = store.userRating ?? '';
      });

      setRatings(initialRatings);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load stores'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleRatingChange = (storeId, value) => {
    setRatings({
      ...ratings,
      [storeId]: value,
    });
  };

  const submitRating = async (storeId) => {
    const rating = Number(ratings[storeId]);

    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }

    try {
      setError('');
      setMessage('');

      await api.post(`/ratings/${storeId}`, {
        rating,
      });

      setMessage('Rating submitted successfully.');

      await loadStores(search);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit rating'
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStores(search);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const goToChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Store Ratings</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <div className="header-actions">
          <button onClick={goToChangePassword}>
            Change Password
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              loadStores('');
            }}
          >
            Clear
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading stores...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Address</th>
                  <th>Overall Rating</th>
                  <th>Your Rating</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.address}</td>
                      <td>
                        ⭐ {store.overallRating}
                      </td>

                      <td>
                        <select
                          value={ratings[store.id] || ''}
                          onChange={(e) =>
                            handleRatingChange(
                              store.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          {[1, 2, 3, 4, 5].map((number) => (
                            <option
                              key={number}
                              value={number}
                            >
                              {number}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            submitRating(store.id)
                          }
                        >
                          {store.userRating
                            ? 'Update Rating'
                            : 'Submit Rating'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
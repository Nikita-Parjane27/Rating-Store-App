import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');

  const [storeSearch, setStoreSearch] = useState('');

  const [userSort, setUserSort] = useState('name');
  const [userOrder, setUserOrder] = useState('asc');

  const [storeSort, setStoreSort] = useState('name');
  const [storeOrder, setStoreOrder] = useState('asc');

  const [activeForm, setActiveForm] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const loadDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load dashboard'
      );
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          search: userSearch || undefined,
          role: userRole || undefined,
          sortBy: userSort,
          order: userOrder,
        },
      });

      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load users'
      );
    }
  };

  const loadStores = async () => {
    try {
      const response = await api.get('/admin/stores', {
        params: {
          search: storeSearch || undefined,
          sortBy: storeSort,
          order: storeOrder,
        },
      });

      setStores(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load stores'
      );
    }
  };

  useEffect(() => {
    loadDashboard();
    loadUsers();
    loadStores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUserSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleStoreSearch = (e) => {
    e.preventDefault();
    loadStores();
  };

  const handleSortUsers = async (field) => {
    const newOrder =
      userSort === field && userOrder === 'asc'
        ? 'desc'
        : 'asc';

    setUserSort(field);
    setUserOrder(newOrder);

    try {
      const response = await api.get('/admin/users', {
        params: {
          search: userSearch || undefined,
          role: userRole || undefined,
          sortBy: field,
          order: newOrder,
        },
      });

      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to sort users'
      );
    }
  };

  const handleSortStores = async (field) => {
    const newOrder =
      storeSort === field && storeOrder === 'asc'
        ? 'desc'
        : 'asc';

    setStoreSort(field);
    setStoreOrder(newOrder);

    try {
      const response = await api.get('/admin/stores', {
        params: {
          search: storeSearch || undefined,
          sortBy: field,
          order: newOrder,
        },
      });

      setStores(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to sort stores'
      );
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <strong>{stats.totalUsers}</strong>
          </div>

          <div className="stat-card">
            <h3>Total Stores</h3>
            <strong>{stats.totalStores}</strong>
          </div>

          <div className="stat-card">
            <h3>Total Ratings</h3>
            <strong>{stats.totalRatings}</strong>
          </div>
        </section>

        {/* Add buttons */}
        <section className="admin-actions">
          <h2>Management</h2>

          <div className="action-buttons">
            <button onClick={() => setActiveForm('user')}>
              Add Normal User
            </button>

            <button onClick={() => setActiveForm('owner')}>
              Add Store Owner
            </button>

            <button onClick={() => setActiveForm('admin')}>
              Add Administrator
            </button>

            <button onClick={() => setActiveForm('store')}>
              Add Store
            </button>
          </div>
        </section>

        {/* Forms */}
        {activeForm === 'user' && (
          <UserForm
            title="Add Normal User"
            endpoint="/admin/users"
            onSuccess={() => {
              setActiveForm('');
              loadUsers();
              loadDashboard();
            }}
            setMessage={setMessage}
            setError={setError}
          />
        )}

        {activeForm === 'owner' && (
          <UserForm
            title="Add Store Owner"
            endpoint="/admin/store-owners"
            onSuccess={() => {
              setActiveForm('');
              loadUsers();
              loadDashboard();
            }}
            setMessage={setMessage}
            setError={setError}
          />
        )}

        {activeForm === 'admin' && (
          <UserForm
            title="Add Administrator"
            endpoint="/admin/admins"
            onSuccess={() => {
              setActiveForm('');
              loadUsers();
              loadDashboard();
            }}
            setMessage={setMessage}
            setError={setError}
          />
        )}

        {activeForm === 'store' && (
          <StoreForm
            users={users}
            onSuccess={() => {
              setActiveForm('');
              loadStores();
              loadDashboard();
            }}
            setMessage={setMessage}
            setError={setError}
          />
        )}

        {/* Users */}
        <section className="table-section">
          <h2>Users</h2>

          <form
            className="search-form"
            onSubmit={handleUserSearch}
          >
            <input
              placeholder="Search name, email or address..."
              value={userSearch}
              onChange={(e) =>
                setUserSearch(e.target.value)
              }
            />

            <select
              value={userRole}
              onChange={(e) =>
                setUserRole(e.target.value)
              }
            >
              <option value="">All Roles</option>
              <option value="NORMAL_USER">
                Normal User
              </option>
              <option value="STORE_OWNER">
                Store Owner
              </option>
              <option value="SYSTEM_ADMINISTRATOR">
                Administrator
              </option>
            </select>

            <button type="submit">Search</button>

            <button
              type="button"
              onClick={async () => {
                setUserSearch('');
                setUserRole('');

                try {
                  const response = await api.get('/admin/users', {
                    params: {
                      sortBy: userSort,
                      order: userOrder,
                    },
                  });

                  setUsers(response.data);
                } catch (err) {
                  setError(
                    err.response?.data?.message || 'Failed to load users'
                  );
                }
              }}
            >
              Clear
            </button>
          </form>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortUsers('name')}>
                    Name ↕
                  </th>

                  <th onClick={() => handleSortUsers('email')}>
                    Email ↕
                  </th>

                  <th onClick={() => handleSortUsers('address')}>
                    Address ↕
                  </th>

                  <th onClick={() => handleSortUsers('role')}>
                    Role ↕
                  </th>

                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.role}</td>

                    <td>
                      <button
                        onClick={() =>
                          navigate(`/admin/users/${item.id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stores */}
        <section className="table-section">
          <h2>Stores</h2>

          <form
            className="search-form"
            onSubmit={handleStoreSearch}
          >
            <input
              placeholder="Search name, email or address..."
              value={storeSearch}
              onChange={(e) =>
                setStoreSearch(e.target.value)
              }
            />

            <button type="submit">Search</button>

            <button
              type="button"
              onClick={async () => {
                setStoreSearch('');

                try {
                  const response = await api.get('/admin/stores', {
                    params: {
                      sortBy: storeSort,
                      order: storeOrder,
                    },
                  });

                  setStores(response.data);
                } catch (err) {
                  setError(
                    err.response?.data?.message || 'Failed to load stores'
                  );
                }
              }}
            >
              Clear
            </button>
          </form>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortStores('name')}>
                    Name ↕
                  </th>

                  <th onClick={() => handleSortStores('email')}>
                    Email ↕
                  </th>

                  <th onClick={() => handleSortStores('address')}>
                    Address ↕
                  </th>

                  <th onClick={() => handleSortStores('rating')}>
                    Rating ↕
                  </th>
                </tr>
              </thead>

              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>⭐ {store.rating}</td>
                  </tr>
                ))}

                {stores.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      No stores found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function UserForm({
  title,
  endpoint,
  onSuccess,
  setMessage,
  setError,
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(endpoint, form);

      setMessage(`${title} created successfully.`);
      setError('');
      onSuccess();
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || `Failed to create ${title}`
      );

      setMessage('');
    }
  };

  return (
    <section className="form-section">
      <h2>{title}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          minLength="20"
          maxLength="60"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          maxLength="400"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          minLength="8"
          maxLength="16"
          required
        />

        <button type="submit">
          Create
        </button>
      </form>
    </section>
  );
}

function StoreForm({
  users,
  onSuccess,
  setMessage,
  setError,
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const owners = users.filter(
    (user) => user.role === 'STORE_OWNER'
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/admin/stores', {
        name: form.name,
        email: form.email,
        address: form.address,
        ownerId: form.ownerId
          ? Number(form.ownerId)
          : undefined,
      });

      setMessage('Store created successfully.');
      setError('');
      onSuccess();
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Failed to create store'
      );

      setMessage('');
    }
  };

  return (
    <section className="form-section">
      <h2>Add Store</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          minLength="20"
          maxLength="60"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Store Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Store Address"
          value={form.address}
          onChange={handleChange}
          maxLength="400"
          required
        />

        <select
          name="ownerId"
          value={form.ownerId}
          onChange={handleChange}
        >
          <option value="">
            Select Store Owner (optional)
          </option>

          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>

        <button type="submit">
          Create Store
        </button>
      </form>
    </section>
  );
}

export default AdminDashboard;
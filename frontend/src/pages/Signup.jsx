import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.name.length < 20 || form.name.length > 60) {
      setError('Name must be between 20 and 60 characters.');
      return;
    }

    if (form.address.length > 400) {
      setError('Address cannot exceed 400 characters.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/users/signup', form);

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Rating Store App</h1>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            minLength="20"
            maxLength="60"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            maxLength="400"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength="8"
            maxLength="16"
            required
          />

          <small>
            8–16 characters, at least one uppercase letter and one special
            character.
          </small>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
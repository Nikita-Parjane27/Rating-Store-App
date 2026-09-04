import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

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

    if (form.newPassword.length < 8 || form.newPassword.length > 16) {
      setError('New password must be 8–16 characters.');
      return;
    }

    if (!/[A-Z]/.test(form.newPassword)) {
      setError('New password must contain an uppercase letter.');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(form.newPassword)) {
      setError('New password must contain a special character.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/users/change-password', form);

      setSuccess('Password changed successfully.');

      setForm({
        currentPassword: '',
        newPassword: '',
      });
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (user?.role === 'SYSTEM_ADMINISTRATOR') {
      navigate('/admin');
    } else if (user?.role === 'STORE_OWNER') {
      navigate('/owner');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Change Password</h1>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />

          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
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
            {loading ? 'Changing...' : 'Change Password'}
          </button>

          <button type="button" onClick={goBack}>
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
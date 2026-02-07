import React, { useState } from 'react';
import { loginRequest } from './Login.service';
import Signup from '../signup/signup';


const Login = () => {
  const [username, setUsername] = useState(''); // labeled username but sent as "email" by default
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // IMPORTANT: repo backend uses "email" field for login; if your backend expects "username",
      // change the body to { username, password }.
      const body = { email: username, password };

      const res = await loginRequest(apiBase, username, password);
      const data = res.data;
      // Adjust if your API returns the token in a different shape (e.g., { token: '...' })
      const token = data?.token ?? data; // accept either { token } or a raw string body

      if (!token) throw new Error('No token returned from login');

      // Persist token for later requests (backend expects raw token in Authorization header)
      localStorage.setItem('token', token);
    } catch (err: any) {
        alert(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
         <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '16px 0' }}>
            <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Username / Email</label>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: 8 }}
                placeholder="you@example.com"
                />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Password</label>
                <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                style={{ width: '100%', padding: 8 }}
                />
            </div>

            <div>
                <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
                {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </div>
        </form>
        <button onClick={() => window.location.href = '/signup'} style={{ padding: '8px 12px' }}>
          Don't have an account? Sign up
        </button>
    </>
  );
}

export default Login;
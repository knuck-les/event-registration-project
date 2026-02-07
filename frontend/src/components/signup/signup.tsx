import React, { useState } from 'react';
import { signupRequest } from './Signup.service';
const Signup = () => {
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

      const res = await signupRequest(apiBase, username, password);

      if (res.code !== 200) {
        const txt = await res.text();
        console.error('Signup failed:', txt || `${res.status} ${res.statusText}`);
      }

      alert('Signup successful!');
      window.location.href = '/login'; // redirect to login page after successful signup
    } catch (err: any) {
      alert(`Signup failed: ${err.message}`);
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
          {loading ? 'Signing in…' : 'Sign up'}
        </button>
      </div>
    </form>
     <button onClick={() => window.location.href = '/login'} style={{ padding: '8px 12px' }}>
          Back to sign in
      </button>
    </>
  );
}

export default Signup;
import React, { useState } from 'react';

type EventItem = {
  id?: number;
  title?: string;
  description?: string;
};

function App() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Vite env var when available; fallback to localhost:8080
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

  async function handleFetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // backend expects raw token in Authorization header (no "Bearer " prefix)
          ...(token ? { Authorization: token } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : [data]);
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={handleFetchEvents} disabled={loading}>
        {loading ? 'Loading…' : 'Fetch Events from Backend'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>
      )}

      {events && (
        <ul style={{ marginTop: 12 }}>
          {events.map((e) => (
            <li key={e.id ?? Math.random()}>
              <strong>{e.title ?? 'Untitled'}</strong>
              {e.description ? ` — ${e.description}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

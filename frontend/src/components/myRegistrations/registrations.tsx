import React, { useEffect, useState } from 'react';
import { getEvents, EventItem } from '../events/Events.service';
import { getMyRegistrations } from './registrations.service';
const Registrations = () => {

     const [events, setEvents] = useState<EventItem[]>([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
    
        const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
    
        useEffect(() => {
            fetchData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const data = await getMyRegistrations(apiBase);
                setEvents(data.data);
            } catch (e: any) {
                setError(e?.message || 'Failed to fetch events');
            } finally {
                setLoading(false);
            }
        }

    return (
        <div style={{ padding: 16 }}>
            <h2>My-Registrations</h2>
            <div style={{ marginBottom: 8 }}>
                <button onClick={fetchData} disabled={loading}>
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
                <button onClick={() => (window.location.href = '/events')} style={{ marginLeft: 8, padding: '8px 12px' }}>
                    Back to Events
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Description</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Location</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Date / Time</th>
                            <th style={{ border: '1px solid #ddd', padding: 8 }}>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!events && !loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 12, textAlign: 'center' }}>
                                    No events registered
                                </td>
                            </tr>
                        ) : (
                            events.map((ev) => (
                                <tr key={ev.ID}>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>{ev.ID}</td>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>{ev.Name}</td>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>{ev.Description}</td>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>{ev.Location}</td>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>
                                        {ev.DateTime ? new Date(ev.DateTime).toLocaleString() : ''}
                                    </td>
                                    <td style={{ border: '1px solid #eee', padding: 8 }}>{ev.UserID ?? '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Registrations;
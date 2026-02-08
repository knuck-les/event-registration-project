import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, EventItem } from './Events.service';
import { deleteEvent, registerEvent, unRegisterEvent } from './Events.service';

export default function EventTable() {
    const navigate = useNavigate();
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
            const data = await getEvents(apiBase);
            setEvents(data);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        console.log("events updated:", events);
    },[events])

    const deleteEventWithId = async (id: number) => {
        if (!window.confirm(`Are you sure you want to delete event ID ${id}?`)) return;
        try {
            const base = apiBase || (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
            const res = await deleteEvent(base, id)
            // Refresh list after deletion
            fetchData();
        } catch (e: any) {
            alert(`Failed to delete event: ${e?.message || e}`);
        }
    }

     const RegisterEventWithId = async (id: number) => {
        if (!window.confirm(`Are you sure you want to register for event ID ${id}?`)) return;
        try {
            const base = apiBase || (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
            const res = await registerEvent(base, id)
        } catch (e: any) {
            alert(`Failed to register for event: ${e?.message || e}`);
        }
    }

     const UnRegisterEventWithId = async (id: number) => {
        if (!window.confirm(`Are you sure you want to unregister for event ID ${id}?`)) return;
        try {
            const base = apiBase || (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
            const res = await unRegisterEvent(base, id)
            // Refresh list after deletion
            fetchData();
        } catch (e: any) {
            alert(`Failed to unregister for event: ${e?.message || e}`);
        }
    }

    return (
        <div style={{ padding: 16 }}>
            <h2>Events</h2>
            <button onClick={() => (window.location.href = '/new-event')} style={{ marginBottom: 16, padding: '8px 12px' }}>
                Add New Event
            </button>
             <button onClick={() => (window.location.href = '/my-registrations')} style={{ marginBottom: 16, padding: '8px 12px' }}>
                My Registrations
            </button>
            <div style={{ marginBottom: 8 }}>
                <button onClick={fetchData} disabled={loading}>
                    {loading ? 'Refreshing…' : 'Refresh'}
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
                        {events.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 12, textAlign: 'center' }}>
                                    No events
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
                                    <button style={{ marginLeft: 8, padding: '4px 8px' }} onClick={() => RegisterEventWithId(ev.ID)}>
                                        Register
                                    </button>
                                    <button style={{ marginLeft: 8, padding: '4px 8px' }} onClick={() => UnRegisterEventWithId(ev.ID)}>
                                        Unregister
                                    </button>
                                    <button style={{ marginLeft: 8, padding: '4px 8px' }} onClick={() => navigate(`/events/${ev.ID}/edit`, { state: ev })}>
                                        Edit
                                    </button>
                                    <button style={{ marginLeft: 8, padding: '4px 8px' }} onClick={() => deleteEventWithId(ev.ID)}>
                                        Delete
                                    </button>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

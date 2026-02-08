// frontend/src/components/createEvent/CreateEvent.tsx
import React, { use, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getEventById, createEvent, updateEvent} from './CreateEvent.service';
import { EventPayload } from './CreateEvent.service';
export default function CreateEvent() {
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // location.state may contain the event when navigated from EventTable
  const navState = location.state as EventPayload | undefined;

  const [initialLoaded, setInitialLoaded] = useState(false);
  const [form, setForm] = useState<EventPayload>({
    Name: '',
    Description: '',
    Location: '',
    DateTime: '',
  });

  useEffect(() => {
    async function load() {
      if (navState) {
        setForm({ ...navState });
        setInitialLoaded(true);
        return;
      }
      if (params.id) {
        // user opened /events/:id/edit directly; fetch the event
        const id = params.id;
        try {
          const ev = await getEventById(apiBase,Number(id)); // implement this service
          console.log("Fetched event for editing:", ev);
          setForm({
            id: ev.ID,
            Name: ev.Name,
            Description: ev.Description,
            Location: ev.Location,
            DateTime: ev.DateTime,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setInitialLoaded(true);
        }
      } else {
        setInitialLoaded(true);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, navState]);

  useEffect(()=>{
    console.log("Form state updated:", form, params);
  },[form, params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (params.id) {
        await updateEvent(apiBase, Number(params.id), form); // call PUT /events/:id
      } else {
        await createEvent(apiBase, form); // call POST /events
      }
      navigate('/events'); // back to list and EventTable will refresh if you implement re-fetch
    } catch (err: any) {
      alert(err?.message || 'Failed');
    }
  }

  if (!initialLoaded) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} placeholder={form.Name ? form.Name : "Name"} required />
      <textarea value={form.Description} onChange={e => setForm({...form, Description: e.target.value})} />
      <input value={form.Location} onChange={e => setForm({...form, Location: e.target.value})} />
      <input
        type="datetime-local"
        value={form.DateTime ? form.DateTime.substring(0,16) : ''}
        onChange={e => setForm({...form, DateTime: new Date(e.target.value).toISOString()})}
        required
      />
      <button type="submit">{params.id ? 'Update Event' : 'Create Event'}</button>
    </form>
  );
}
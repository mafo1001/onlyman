import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight, X, Plus } from 'lucide-react';

const EVENT_EMOJIS = ['🎉', '🌈', '☕', '🏔️', '🎮', '🎨', '⛓️', '🎵', '🍸', '🏋️', '🎬', '🏖️', '🍕', '🎤', '🚴'];

export default function EventsPage({ events = [], onJoinEvent, onCreateEvent }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', category: 'Social', image: '🎉', date: '' });
  const [toast, setToast] = useState(null);
  const categories = ['All', 'Party', 'Social', 'Outdoors', 'Culture'];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return showToast('Please enter an event title');
    if (!newEvent.date) return showToast('Please select a date');
    const event = {
      id: `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      description: newEvent.description.trim() || 'No description provided.',
      date: new Date(newEvent.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      location: newEvent.location.trim() || 'TBD',
      distance: '0 km',
      attendees: 1,
      image: newEvent.image,
      category: newEvent.category,
      joined: true,
    };
    if (onCreateEvent) onCreateEvent(event);
    setShowCreateModal(false);
    setNewEvent({ title: '', description: '', location: '', category: 'Social', image: '🎉', date: '' });
    showToast('Event created!');
  };

  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 16px)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 16px',
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
          <Calendar size={20} style={{ verticalAlign: '-3px', marginRight: '8px', color: 'var(--accent)' }} />
          Events
        </h1>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                fontSize: '12px', fontWeight: 600, flexShrink: 0,
                background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border-default)'}`,
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Featured event */}
        {filtered[0] && (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            cursor: 'pointer',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{
              height: '160px',
              background: 'linear-gradient(135deg, rgba(0,255,102,0.15), rgba(57,255,20,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '64px',
            }}>
              {filtered[0].image}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>Featured</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{filtered[0].title}</h3>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(0,255,102,0.1)', fontSize: '11px',
                  color: 'var(--accent)', fontWeight: 600,
                }}>{filtered[0].category}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                {filtered[0].description}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Calendar size={13} /> {filtered[0].date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <MapPin size={13} /> {filtered[0].location} · {filtered[0].distance}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--accent)' }}>
                  <Users size={13} /> {filtered[0].attendees} going
                </div>
              </div>
              <button onClick={() => onJoinEvent && onJoinEvent(filtered[0].id)} style={{
                width: '100%', marginTop: '14px', padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: filtered[0].joined ? 'var(--bg-elevated)' : 'var(--accent)',
                color: filtered[0].joined ? 'var(--accent)' : '#000',
                fontWeight: 700, fontSize: '14px',
                border: filtered[0].joined ? '1px solid var(--border-accent)' : 'none',
              }}>
                {filtered[0].joined ? '✓ Joined' : 'Join Event'}
              </button>
            </div>
          </div>
        )}

        {/* Other events */}
        {filtered.slice(1).map((event, idx) => (
          <div
            key={event.id}
            style={{
              display: 'flex', gap: '14px',
              padding: '14px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
              minHeight: '64px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', flexShrink: 0,
            }}>
              {event.image}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{event.title}</h3>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {event.date}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={10} /> {event.distance}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Users size={10} /> {event.attendees}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Create event CTA */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(0,255,102,0.05), rgba(0,255,102,0.02))',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-accent)',
          textAlign: 'center',
          marginTop: '8px',
        }}>
          <Calendar size={24} color="var(--accent)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Host Your Own Event</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Create a meetup and connect with the community
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)',
              color: 'var(--accent)', fontWeight: 600, fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Create Event
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto',
              background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0',
              padding: '20px', animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Create Event</h2>
              <button aria-label="Close" onClick={() => setShowCreateModal(false)} style={{ padding: 6, color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Emoji picker */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Event Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {EVENT_EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEvent(p => ({ ...p, image: e }))} style={{
                  width: 40, height: 40, borderRadius: 8, fontSize: 20,
                  background: newEvent.image === e ? 'var(--accent)' : 'var(--bg-tertiary)',
                  border: newEvent.image === e ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{e}</button>
              ))}
            </div>

            {/* Title */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Title *</label>
            <input
              type="text"
              placeholder="e.g. Pride Night Out"
              value={newEvent.title}
              onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
              maxLength={60}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                fontSize: 15, marginBottom: 12, minHeight: 44,
              }}
            />

            {/* Description */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Description</label>
            <textarea
              placeholder="Tell people what to expect..."
              value={newEvent.description}
              onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
              maxLength={300}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                fontSize: 14, marginBottom: 12, resize: 'vertical', fontFamily: 'inherit',
              }}
            />

            {/* Date + Time */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Date & Time *</label>
            <input
              type="datetime-local"
              value={newEvent.date}
              onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                fontSize: 15, marginBottom: 12, minHeight: 44, colorScheme: 'dark',
              }}
            />

            {/* Location */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Location</label>
            <input
              type="text"
              placeholder="e.g. The Green Bean Café"
              value={newEvent.location}
              onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))}
              maxLength={80}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                fontSize: 15, marginBottom: 12, minHeight: 44,
              }}
            />

            {/* Category */}
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Category</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {['Party', 'Social', 'Outdoors', 'Culture'].map(cat => (
                <button key={cat} onClick={() => setNewEvent(p => ({ ...p, category: cat }))} style={{
                  padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: newEvent.category === cat ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: newEvent.category === cat ? '#000' : 'var(--text-secondary)',
                  border: newEvent.category === cat ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}>{cat}</button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleCreateEvent}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: 'var(--accent)', color: '#000',
                fontWeight: 700, fontSize: 15, border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />
              Create Event
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', color: 'var(--text-primary)',
          padding: '10px 24px', borderRadius: 99, fontSize: 13, fontWeight: 600,
          zIndex: 3000, boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-accent)',
          animation: 'fadeIn 0.2s ease',
        }}>{toast}</div>
      )}
    </div>
  );
}

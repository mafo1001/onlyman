import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';

export default function EventsPage({ events = [], onJoinEvent }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Party', 'Social', 'Outdoors', 'Culture'];

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
          <button style={{
            padding: '10px 24px', borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)',
            color: 'var(--accent)', fontWeight: 600, fontSize: '13px',
          }}>
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

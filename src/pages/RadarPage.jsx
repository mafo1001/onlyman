import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RadarPage({ users, myLocation, blockedUsers = [] }) {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const containerRef = useRef();

  const onlineUsers = users.filter(u => u.status === 'online' || u.status === 'away');

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 16px)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={20} color="var(--accent)" />
          <span style={{ fontSize: '18px', fontWeight: 700 }}>Radar</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{onlineUsers.length} nearby</span>
      </div>

      {/* Radar Map */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'hidden',
          background: 'radial-gradient(circle, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
        }}
      >
        {/* Radar rings */}
        {[20, 40, 60, 80].map(r => (
          <div key={r} style={{
            position: 'absolute',
            top: `${50 - r/2}%`, left: `${50 - r/2}%`,
            width: `${r}%`, height: `${r}%`,
            borderRadius: '50%',
            border: '1px solid rgba(0,255,102,0.07)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Radar sweep animation */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '100%', height: '100%',
          transform: 'translate(-50%, -50%)',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,102,0.05) 30deg, transparent 60deg)',
          borderRadius: '50%',
          animation: 'spin 4s linear infinite',
          pointerEvents: 'none',
        }} />
        <style>{`@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>

        {/* Cross hairs */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(0,255,102,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'rgba(0,255,102,0.08)', pointerEvents: 'none' }} />

        {/* Center (me) */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '16px', height: '16px',
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 20px var(--accent-glow-strong), 0 0 40px var(--accent-glow)',
          zIndex: 10,
          animation: 'pulse-glow 2s ease infinite',
        }} />

        {/* Distance labels */}
        {[{ r: 20, label: '1km' }, { r: 40, label: '5km' }, { r: 60, label: '20km' }, { r: 80, label: '50km' }].map(({ r, label }) => (
          <div key={r} style={{
            position: 'absolute',
            top: `${50 - r/2}%`, left: '51%',
            fontSize: '10px', color: 'rgba(0,255,102,0.3)',
            transform: 'translateY(-4px)',
            pointerEvents: 'none',
          }}>{label}</div>
        ))}

        {/* User dots */}
        {users.filter(u => !blockedUsers.includes(u.id)).map((user, i) => {
          const maxD = 50;
          const normalizedDist = Math.min(user.distance / maxD, 1);
          const angle = (i / users.length) * 2 * Math.PI + (user.id.charCodeAt(5) || 0) * 0.3;
          const radius = normalizedDist * 38;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;

          const isOnline = user.status === 'online';
          const dotSize = isOnline ? 12 : 8;

          return (
            <div
              key={user.id}
              onClick={(e) => { e.stopPropagation(); setSelectedUser(selectedUser?.id === user.id ? null : user); }}
              style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: selectedUser?.id === user.id ? 20 : 5,
                transition: 'all 0.3s ease',
              }}
            >
              {selectedUser?.id === user.id ? (
                <img src={user.avatar} alt="" style={{
                  width: '44px', height: '44px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--accent)',
                  boxShadow: '0 0 16px var(--accent-glow-strong)',
                  objectFit: 'cover',
                }} />
              ) : (
                <div style={{
                  width: `${dotSize}px`, height: `${dotSize}px`,
                  borderRadius: '50%',
                  background: isOnline ? 'var(--online)' : user.status === 'away' ? 'var(--away)' : 'var(--offline)',
                  boxShadow: isOnline ? `0 0 8px var(--online)` : 'none',
                  border: '1px solid rgba(0,0,0,0.3)',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected user card */}
      {selectedUser && (
        <div
          onClick={() => navigate(`/profile/${selectedUser.id}`)}
          style={{
            margin: '12px 16px',
            padding: '14px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            animation: 'slideUp 0.3s ease',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <img src={selectedUser.avatar} alt="" style={{
            width: '60px', height: '60px', borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>
              {selectedUser.name}, {selectedUser.age}
              {selectedUser.verified && <span style={{ color: 'var(--accent)', marginLeft: '6px', fontSize: '13px' }}>✓</span>}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {selectedUser.tribe} · {selectedUser.bodyType}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {selectedUser.bio?.slice(0, 60)}...
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>
              {selectedUser.distance < 1 ? `${Math.round(selectedUser.distance * 1000)}m` : `${selectedUser.distance}km`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {selectedUser.lastSeen}
            </div>
          </div>
        </div>
      )}

      {/* Nearby list */}
      <div style={{ padding: '8px 16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Closest to you
        </h3>
        {users.filter(u => u.status === 'online').slice(0, 6).map(user => (
          <div
            key={user.id}
            onClick={() => navigate(`/profile/${user.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <img src={user.avatar} alt="" style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
            }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>{user.name}, {user.age}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
              {user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance}km`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

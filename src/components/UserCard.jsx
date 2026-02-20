import React, { memo, useState } from 'react';
import { MapPin, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default memo(function UserCard({ user, style = {} }) {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={() => navigate(`/profile/${user.id}`)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--bg-card)',
        border: pressed ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        aspectRatio: '3/4',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        boxShadow: pressed ? 'var(--shadow-glow)' : 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Avatar image */}
      <AvatarImg src={user.avatar} alt={user.name} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65%',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        pointerEvents: 'none',
      }} />

      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: user.status === 'online' ? 'var(--online)' :
                    user.status === 'away' ? 'var(--away)' : 'var(--offline)',
        border: '2px solid rgba(0,0,0,0.5)',
        boxShadow: user.status === 'online' ? '0 0 6px var(--online)' : 'none',
      }} />

      {/* NEW badge */}
      {user.isNew && !user.rightNow && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: 'var(--accent)',
          color: '#000',
          fontSize: '9px',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          letterSpacing: '0.5px',
        }}>NEW</div>
      )}

      {/* RIGHT NOW badge */}
      {user.rightNow && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: 'var(--accent)',
          color: '#000',
          fontSize: '9px',
          fontWeight: 800,
          padding: '3px 7px',
          borderRadius: 'var(--radius-sm)',
          letterSpacing: '0.5px',
          display: 'flex', alignItems: 'center', gap: 3,
          boxShadow: '0 0 10px var(--accent-glow)',
          animation: 'pulse-glow 2s infinite',
        }}>
          <Zap size={10} fill="#000" /> RIGHT NOW
        </div>
      )}

      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.age}</span>
          {user.verified && <Shield size={12} color="var(--accent)" fill="var(--accent)" />}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '2px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}>
          <MapPin size={10} />
          <span>{user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance}km`}</span>
          <span style={{ margin: '0 2px' }}>·</span>
          <span>{user.tribe}</span>
        </div>
      </div>
    </div>
  );
});

function AvatarImg({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      {!loaded && !error && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      {error ? (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 24, fontWeight: 700 }}>
          {alt?.[0]?.toUpperCase() || '?'}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
          loading="lazy"
        />
      )}
    </>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid3X3, MapPin, MessageCircle, Calendar, User, Flame, Image } from 'lucide-react';
import DemonLogo from './DemonLogo';

const navItems = [
  { to: '/', icon: Grid3X3, label: 'Explore' },
  { to: '/radar', icon: MapPin, label: 'Radar' },
  { to: '/spark', icon: Flame, label: 'Spark' },
  { to: '/albums', icon: Image, label: 'Albums' },
  { to: '/messages', icon: MessageCircle, label: 'Chat' },
  { to: '/profile', icon: User, label: 'Me' },
];

export default function BottomNav({ unreadCount = 0 }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.99) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 1000,
      padding: '0 4px',
      paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
      paddingTop: '6px',
    }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 8px',
            borderRadius: 'var(--radius-md)',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'color 0.2s ease',
            position: 'relative',
            textDecoration: 'none',
            minWidth: '48px',
            minHeight: '44px',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '2px',
                  background: 'var(--accent)',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px var(--accent-glow)',
                }} />
              )}
              <div style={{ position: 'relative' }}>
                {label === 'Spark' ? (
                  <DemonLogo size={22} glow={isActive} />
                ) : (
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                )}
                {label === 'Chat' && unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -5,
                    right: -8,
                    background: 'var(--accent)',
                    color: '#000',
                    fontSize: '9px',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 5px',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}>{unreadCount}</span>
                )}
              </div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

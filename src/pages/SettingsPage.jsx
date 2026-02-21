import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MapPin, Shield, Eye, Trash2, LogOut, ChevronRight, Moon, FileText, Ghost, Zap, X, Lock } from 'lucide-react';

export default function SettingsPage({ currentUser, setCurrentUser, onLogout, ghostMode, setGhostMode, rightNowMode, rightNowExpiry, activateRightNow, deactivateRightNow, isPremium, distanceUnit, setDistanceUnit, notifications, setNotifications, showOnline, setShowOnline, showDistance, setShowDistance, blockedUsers = [], onUnblock, users = [] }) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const Toggle = ({ value, onChange, label }) => (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      tabIndex={0}
      onClick={() => onChange(!value)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!value); } }}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? 'var(--accent)' : 'var(--bg-tertiary)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        border: 'none', cursor: 'pointer', padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: value ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: value ? '#000' : '#666',
        transition: 'left 0.2s',
      }} />
    </button>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        padding: '0 16px',
      }}>{title}</h3>
      <div style={{
        background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
        margin: '0 16px', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ icon: Icon, label, right, onClick, danger }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)',
        color: danger ? 'var(--danger, #ff4444)' : 'var(--text-primary)',
        fontSize: 15, textAlign: 'left', background: 'none', border: 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {Icon && <Icon size={18} style={{ color: danger ? 'var(--danger, #ff4444)' : 'var(--text-muted)', flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{label}</span>
      {right || (onClick && <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />)}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px', position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button aria-label="Go back" onClick={() => navigate(-1)} style={{ color: 'var(--text-primary)' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Settings</h1>
      </div>

      <div style={{ paddingTop: 16, paddingBottom: 100 }}>
        {/* Profile Info */}
        {currentUser && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px', margin: '0 16px 24px', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-elevated)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
              background: 'var(--bg-tertiary)',
            }}>
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{currentUser.name}, {currentUser.age}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {currentUser.tribe || 'Edit your profile'}
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '8px 14px', borderRadius: 'var(--radius-full)',
                background: 'rgba(0,255,102,0.1)', color: 'var(--accent)',
                fontSize: 13, fontWeight: 600, border: '1px solid var(--border-accent)',
              }}
            >
              View
            </button>
          </div>
        )}

        {/* Distance & Location */}
        <Section title="Location">
          <Row
            icon={MapPin}
            label="Distance Unit"
            right={
              <div style={{ display: 'flex', gap: 4 }}>
                {['km', 'mi'].map(u => (
                  <button
                    key={u}
                    onClick={() => setDistanceUnit(u)}
                    style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-full)',
                      fontSize: 13, fontWeight: 600,
                      background: distanceUnit === u ? 'var(--accent)' : 'var(--bg-tertiary)',
                      color: distanceUnit === u ? '#000' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            }
          />
          <Row
            icon={Eye}
            label="Show Distance"
            right={<Toggle value={showDistance} onChange={setShowDistance} label="Show distance" />}
          />
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <Row
            icon={Ghost}
            label="Privacy Mode"
            right={<Toggle value={ghostMode} onChange={setGhostMode} label="Privacy mode" />}
          />
          {ghostMode && (
            <div style={{
              padding: '8px 16px 12px', fontSize: 11, color: 'var(--text-muted)',
              lineHeight: 1.5, borderBottom: '1px solid var(--border-subtle)',
            }}>
              Your profile is hidden from others. You can still browse and message.
            </div>
          )}
          <Row
            icon={Zap}
            label="Right Now"
            right={
              rightNowMode
                ? <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Active</span>
                : isPremium
                  ? <span style={{ fontSize: 12, color: '#ffd700', fontWeight: 700 }}>FREE ⭐</span>
                  : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>$1/hr</span>
            }
            onClick={() => {
              if (rightNowMode) {
                deactivateRightNow();
              } else {
                navigate('/');
              }
            }}
          />
          {rightNowMode && (
            <div style={{
              padding: '8px 16px 12px', fontSize: 11, color: 'var(--accent)',
              lineHeight: 1.5, borderBottom: '1px solid var(--border-subtle)',
            }}>
              ⚡ You're at the top of everyone's grid. Tap to deactivate.
            </div>
          )}
          <Row
            icon={Eye}
            label="Show Online Status"
            right={<Toggle value={showOnline} onChange={setShowOnline} label="Show online status" />}
          />
          <Row
            icon={Shield}
            label="Blocked Users"
            right={blockedUsers.length > 0 ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{blockedUsers.length}</span> : null}
            hasChevron
            onClick={() => setShowBlockedModal(true)}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row
            icon={Bell}
            label="Push Notifications"
            right={<Toggle value={notifications} onChange={setNotifications} label="Push notifications" />}
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Row
            icon={Moon}
            label="Dark Mode"
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Always On</span>
                <Lock size={12} color="var(--text-muted)" />
              </div>
            }
          />
        </Section>

        {/* Account */}
        <Section title="Account">
          <Row
            icon={LogOut}
            label="Log Out"
            danger
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                if (onLogout) onLogout();
                navigate('/signup');
              }
            }}
          />
          <Row
            icon={Trash2}
            label="Delete Account"
            danger
            onClick={() => setConfirmDelete(true)}
          />
        </Section>

        <Section title="Legal">
          <Row icon={FileText} label="Terms of Service" hasChevron onClick={() => navigate('/terms')} />
          <Row icon={FileText} label="Privacy Policy" hasChevron onClick={() => navigate('/privacy')} />
        </Section>

        {/* App Info */}
        <div style={{
          textAlign: 'center', padding: '24px 16px',
          color: 'var(--text-muted)', fontSize: 12,
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)', marginBottom: 4 }}>
            ONLYMAN
          </div>
          <div>Version 1.0.0</div>
          {isPremium && (
            <div style={{
              marginTop: 8, padding: '6px 16px', borderRadius: 99,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,170,0,0.08))',
              border: '1px solid rgba(255,215,0,0.3)',
              color: '#ffd700', fontSize: 12, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              ⭐ Premium Member #{currentUser?.userNumber}
            </div>
          )}
          <div style={{ marginTop: 4 }}>Made with ❤️</div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete account confirmation"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeInBackdrop 0.2s ease',
          }}
          onClick={() => setConfirmDelete(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
              padding: 24, margin: 16, maxWidth: 340, width: '100%',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Account?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
              This action cannot be undone. All your data, messages, and photos will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                  fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  localStorage.clear();
                  navigate('/signup');
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
                  background: 'var(--danger, #ff4444)', color: '#fff',
                  fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Users Modal */}
      {showBlockedModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Blocked users"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowBlockedModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480, maxHeight: '70vh',
              background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0',
              padding: '20px', overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Blocked Users</h2>
              <button aria-label="Close" onClick={() => setShowBlockedModal(false)} style={{ padding: 6, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {blockedUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                <Shield size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ fontSize: 14 }}>No blocked users</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Users you block will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {blockedUsers.map(userId => {
                  const blockedUser = users.find(u => u.id === userId);
                  return (
                    <div key={userId} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 10,
                      background: 'var(--bg-tertiary)',
                    }}>
                      {blockedUser?.avatar ? (
                        <img src={blockedUser.avatar} alt="" style={{
                          width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                        }} />
                      ) : (
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'var(--bg-elevated)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, color: 'var(--text-muted)',
                        }}>?</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                          {blockedUser?.name || `User ${userId.slice(0, 8)}`}
                        </p>
                        {blockedUser?.age && (
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {blockedUser.age} · {blockedUser.tribe}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onUnblock && onUnblock(userId)}
                        style={{
                          padding: '6px 14px', borderRadius: 99,
                          background: 'rgba(255,59,59,0.1)',
                          border: '1px solid rgba(255,59,59,0.3)',
                          color: '#ff4444', fontSize: 12, fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Unblock
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

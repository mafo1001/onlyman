import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Search, LayoutGrid, List, Zap, Ghost, Clock, DollarSign, X } from 'lucide-react';
import UserCard from '../components/UserCard';
import FilterPanel from '../components/FilterPanel';
import { OnlyManWordmark } from '../components/DemonLogo';
import DemonLogo from '../components/DemonLogo';

function formatTimeLeft(ms) {
  if (ms <= 0) return '0:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GridPage({ users, rightNowMode, rightNowExpiry, activateRightNow, deactivateRightNow, ghostMode, isPremium }) {
  const [showFilters, setShowFilters] = useState(false);
  const [showRightNowModal, setShowRightNowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [timeLeft, setTimeLeft] = useState(0);
  const [filters, setFilters] = useState({
    maxDistance: 100,
    ageMin: 18,
    ageMax: 99,
    bodyType: 'Any',
    tribe: 'Any',
    position: 'Any',
    lookingFor: [],
    onlineOnly: false,
    verifiedOnly: false,
  });

  // Countdown timer for Right Now
  useEffect(() => {
    if (!rightNowMode || !rightNowExpiry) { setTimeLeft(0); return; }
    const tick = () => setTimeLeft(Math.max(0, rightNowExpiry - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [rightNowMode, rightNowExpiry]);

  const handleRightNowClick = () => {
    if (rightNowMode) {
      deactivateRightNow();
    } else {
      setShowRightNowModal(true);
    }
  };

  const handlePurchaseRightNow = () => {
    activateRightNow(isPremium ? Infinity : 60 * 60 * 1000);
    setShowRightNowModal(false);
  };

  const filteredUsers = useMemo(() => {
    let result = users.filter(u => {
      if (filters.onlineOnly && u.status !== 'online') return false;
      if (filters.verifiedOnly && !u.verified) return false;
      if (u.distance > filters.maxDistance) return false;
      if (u.age < filters.ageMin || u.age > filters.ageMax) return false;
      if (filters.bodyType !== 'Any' && u.bodyType !== filters.bodyType) return false;
      if (filters.tribe !== 'Any' && u.tribe !== filters.tribe) return false;
      if (filters.position !== 'Any' && u.position !== filters.position) return false;
      if (filters.lookingFor.length > 0 && !u.lookingFor.some(l => filters.lookingFor.includes(l))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.tribe.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q);
      }
      return true;
    });
    // Sort: "Right Now" users float to top, then by distance
    result.sort((a, b) => {
      const aRN = a.rightNow ? 1 : 0;
      const bRN = b.rightNow ? 1 : 0;
      if (aRN !== bRN) return bRN - aRN;
      return a.distance - b.distance;
    });
    return result;
  }, [users, filters, searchQuery]);

  const onlineCount = users.filter(u => u.status === 'online').length;

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 16px)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DemonLogo size={32} />
            <OnlyManWordmark height={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              color: 'var(--online)',
              fontWeight: 600,
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--online)', animation: 'pulse-glow 2s infinite' }} />
              {onlineCount} online
            </div>
            {/* Right Now toggle */}
            <button
              onClick={handleRightNowClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 'var(--radius-full)',
                fontSize: 11, fontWeight: 700,
                background: rightNowMode ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: rightNowMode ? '#000' : 'var(--text-muted)',
                border: rightNowMode ? 'none' : '1px solid var(--border-default)',
                boxShadow: rightNowMode ? '0 0 12px var(--accent-glow)' : 'none',
                transition: 'all 0.2s',
                minHeight: 32,
              }}
            >
              <Zap size={12} fill={rightNowMode ? '#000' : 'none'} />
              {rightNowMode ? (isPremium ? 'ON' : formatTimeLeft(timeLeft)) : 'RIGHT NOW'}
            </button>
            <button
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              style={{ padding: '8px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
            >
              {viewMode === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
            </button>
            <button
              onClick={() => setShowFilters(true)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                position: 'relative',
              }}
            >
              <SlidersHorizontal size={18} />
              {(filters.onlineOnly || filters.verifiedOnly || filters.bodyType !== 'Any' || filters.tribe !== 'Any') && (
                <div style={{
                  position: 'absolute', top: 4, right: 4,
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--accent)',
                }} />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            placeholder="Search by name, tribe, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              height: '42px',
              fontSize: '16px', /* Prevents auto-zoom on iOS */
              minHeight: '44px',
            }}
          />
        </div>
      </div>

      {/* Premium Banner */}
      {isPremium && !rightNowMode && (
        <div style={{
          margin: '8px 16px 0', padding: '10px 14px', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,170,0,0.05))',
          border: '1px solid rgba(255,215,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: '#ffd700',
        }}>
          <span style={{ fontSize: 16 }}>⭐</span>
          <span><strong>Premium Member</strong> — Right Now boosts are free for you, forever.</span>
        </div>
      )}

      {/* Ghost Mode Banner */}
      {ghostMode && (
        <div style={{
          margin: '0 16px', padding: '10px 14px', borderRadius: 'var(--radius-md)',
          background: 'rgba(128,128,128,0.15)', border: '1px solid rgba(128,128,128,0.3)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: 'var(--text-secondary)',
        }}>
          <Ghost size={18} style={{ color: '#aaa', flexShrink: 0 }} />
          <span><strong style={{ color: 'var(--text-primary)' }}>Privacy Mode ON</strong> — Your profile is hidden from others. You can still browse.</span>
        </div>
      )}

      {/* Right Now Mode Banner */}
      {rightNowMode && (
        <div style={{
          margin: '8px 16px 0', padding: '10px 14px', borderRadius: 'var(--radius-md)',
          background: 'rgba(0,255,102,0.08)', border: '1px solid var(--border-accent)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: 'var(--text-secondary)',
        }}>
          <Zap size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>
            <strong style={{ color: 'var(--accent)' }}>⚡ Right Now Active</strong> — You're on top!{isPremium ? ' Premium — no time limit.' : <> <strong style={{ color: 'var(--accent)' }}>{formatTimeLeft(timeLeft)}</strong> remaining.</>}
          </span>
          <button onClick={deactivateRightNow} style={{ color: 'var(--text-muted)', padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Results count */}
      <div style={{
        padding: '10px 16px 6px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>{filteredUsers.length} guys nearby</span>
        <span>Sorted by distance</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 45vw), 1fr))',
          gap: '4px',
          padding: '4px 6px',
        }}>
          {filteredUsers.map((user, idx) => (
            <div key={user.id} style={{ animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}>
              <UserCard user={user} />
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div style={{ padding: '4px 8px' }}>
          {filteredUsers.map((user, idx) => (
            <ListItem key={user.id} user={user} delay={idx * 0.02} />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          <DemonLogo size={64} glow={false} />
          <p style={{ marginTop: '16px', fontSize: '15px', fontWeight: 500 }}>No guys match your filters</p>
          <p style={{ marginTop: '4px', fontSize: '13px' }}>Try adjusting your search criteria</p>
        </div>
      )}

      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Right Now Payment Modal */}
      {showRightNowModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setShowRightNowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
              padding: 0, margin: 16, maxWidth: 360, width: '100%',
              overflow: 'hidden', border: '1px solid var(--border-accent)',
              boxShadow: '0 0 40px rgba(0,255,102,0.15)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 24px 16px', textAlign: 'center',
              background: 'linear-gradient(180deg, rgba(0,255,102,0.08) 0%, transparent 100%)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                background: 'rgba(0,255,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}>
                <Zap size={28} color="var(--accent)" fill="var(--accent)" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                ⚡ Right Now
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Jump to the <strong style={{ color: 'var(--accent)' }}>top of everyone's grid</strong>{isPremium ? ' — unlimited, free for you.' : ' for 1 hour. Get seen first.'}
              </p>
            </div>

            {/* Features */}
            <div style={{ padding: '0 24px 16px' }}>
              {[
                { icon: '🔝', text: 'Appear first in the grid' },
                { icon: '⚡', text: 'Glowing "RIGHT NOW" badge on your profile' },
                { icon: '👀', text: '10x more profile views' },
                { icon: '⏱️', text: isPremium ? 'No time limit — Premium perk' : 'Active for 1 full hour' },
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', fontSize: 13, color: 'var(--text-secondary)',
                }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '0 24px 20px' }}>
              {isPremium ? (
                <>
                  <button
                    onClick={handlePurchaseRightNow}
                    style={{
                      width: '100%', padding: 16, borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                      color: '#000', fontWeight: 800, fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 0 24px rgba(255,215,0,0.3)',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    <Zap size={18} fill="#000" strokeWidth={3} /> Activate FREE
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 11, color: '#ffd700', marginTop: 8, fontWeight: 600 }}>
                    ⭐ Premium Member — unlimited free boosts
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePurchaseRightNow}
                    style={{
                      width: '100%', padding: 16, borderRadius: 'var(--radius-md)',
                      background: 'var(--accent)', color: '#000', fontWeight: 800, fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 0 24px var(--accent-glow)',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    <DollarSign size={18} strokeWidth={3} /> Boost for $1.00
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    1 hour • instant activation • cancel anytime
                  </p>
                </>
              )}
            </div>

            {/* Cancel */}
            <button
              onClick={() => setShowRightNowModal(false)}
              style={{
                width: '100%', padding: '14px', borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)', fontSize: 14, textAlign: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ListItem({ user, delay }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/profile/${user.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background 0.15s, transform 0.15s',
        animation: `fadeIn 0.3s ease ${delay}s both`,
        minHeight: '64px',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={user.avatar} alt="" style={{
          width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
          objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', bottom: -1, right: -1,
          width: '12px', height: '12px', borderRadius: '50%',
          background: user.status === 'online' ? 'var(--online)' : user.status === 'away' ? 'var(--away)' : 'var(--offline)',
          border: '2px solid var(--bg-primary)',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}, {user.age}</span>
          {user.verified && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>✓</span>}
          {user.rightNow && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              fontSize: 9, fontWeight: 800, color: '#000',
              background: 'var(--accent)', padding: '1px 5px',
              borderRadius: 4, letterSpacing: 0.3,
            }}>⚡ NOW</span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {user.tribe} · {user.bodyType}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
          {user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance}km`}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {user.lastSeen}
        </div>
      </div>
    </div>
  );
}

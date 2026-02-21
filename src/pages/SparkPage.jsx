import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Heart, X, MessageCircle, Shield, MapPin, Zap, Users, Sparkles } from 'lucide-react';
import DemonLogo from '../components/DemonLogo';

export default function SparkPage({ users, blockedUsers = [] }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('om_spark_liked') || '[]')); } catch { return new Set(); }
  });
  const [passed, setPassed] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('om_spark_passed') || '[]')); } catch { return new Set(); }
  });
  const [mutualMatches, setMutualMatches] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('om_spark_matches') || '[]')); } catch { return new Set(); }
  });
  const [matched, setMatched] = useState(null);
  const [tab, setTab] = useState('spotlight'); // 'spotlight' | 'matches' | 'likes'

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem('om_spark_liked', JSON.stringify([...liked]));
  }, [liked]);
  React.useEffect(() => {
    localStorage.setItem('om_spark_passed', JSON.stringify([...passed]));
  }, [passed]);
  React.useEffect(() => {
    localStorage.setItem('om_spark_matches', JSON.stringify([...mutualMatches]));
  }, [mutualMatches]);

  const availableUsers = useMemo(() => {
    return users.filter(u => !passed.has(u.id) && !liked.has(u.id) && !blockedUsers.includes(u.id));
  }, [users, liked, passed, blockedUsers]);

  const currentUser = availableUsers.length > 0 ? availableUsers[0] : null;

  const handleLike = () => {
    if (!currentUser) return;
    setLiked(prev => new Set([...prev, currentUser.id]));
    // Mutual match: users who also "liked" back (simulated per user seed)
    const matchChance = ((currentUser.id.charCodeAt(5) || 0) % 10) / 10;
    if (matchChance > 0.5) {
      setMutualMatches(prev => new Set([...prev, currentUser.id]));
      setMatched(currentUser);
    }
  };

  const handlePass = () => {
    if (!currentUser) return;
    setPassed(prev => new Set([...prev, currentUser.id]));
  };

  const likedUsers = users.filter(u => liked.has(u.id) && !mutualMatches.has(u.id));
  const matchedUsers = users.filter(u => mutualMatches.has(u.id));

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 16px)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <DemonLogo size={28} />
          <span style={{ fontSize: '18px', fontWeight: 800 }}>Spark</span>
          <Zap size={16} color="var(--accent)" fill="var(--accent)" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
          {[
            { key: 'spotlight', label: 'Spotlight', icon: Sparkles },
            { key: 'matches', label: 'Matches', icon: Heart },
            { key: 'likes', label: `Liked (${liked.size})`, icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '5px', padding: '8px', borderRadius: 'var(--radius-full)',
                fontSize: '12px', fontWeight: 600,
                background: tab === key ? 'var(--accent)' : 'transparent',
                color: tab === key ? '#000' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight Tab — empty state */}
      {tab === 'spotlight' && !currentUser && (
        <div style={{ padding: '60px 20px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
          <DemonLogo size={80} glow={false} />
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '20px' }}>You've Seen Everyone!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', lineHeight: 1.5 }}>
            You've gone through all available profiles. Check back later for new guys nearby.
          </p>
          <button
            onClick={() => { setPassed(new Set()); setLiked(new Set()); setMutualMatches(new Set()); }}
            style={{ marginTop: '24px', padding: '12px 28px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: '14px' }}
          >Reset & Start Over</button>
        </div>
      )}

      {/* Spotlight Tab - Full screen profile viewer */}
      {tab === 'spotlight' && currentUser && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* Profile card */}
          <div style={{
            margin: '12px', borderRadius: 'var(--radius-lg)',
            overflow: 'hidden', background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
          }}>
            <div style={{ aspectRatio: '3/4', position: 'relative', maxHeight: '55vh' }}>
              <img src={currentUser.avatar} alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              }} />

              {/* Info overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h2 style={{ fontSize: '26px', fontWeight: 800 }}>{currentUser.name}</h2>
                  <span style={{ fontSize: '22px', fontWeight: 300, color: 'var(--text-secondary)' }}>{currentUser.age}</span>
                  {currentUser.verified && <Shield size={16} color="var(--accent)" fill="var(--accent)" />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={13} color="var(--accent)" />
                  <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                    {currentUser.distance < 1 ? `${Math.round(currentUser.distance * 1000)}m` : `${currentUser.distance}km`}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{currentUser.tribe}</span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{currentUser.bodyType}</span>
                </div>
              </div>
            </div>

            {/* Bio & interests */}
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                {currentUser.bio}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentUser.interests?.map(i => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)', fontSize: '11px',
                    color: 'var(--text-secondary)', border: '1px solid var(--border-default)',
                  }}>{i}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {currentUser.lookingFor?.map(l => (
                  <span key={l} style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(0,255,102,0.08)', fontSize: '11px',
                    color: 'var(--accent)', border: '1px solid var(--border-accent)',
                  }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '16px',
            padding: '8px 16px',
          }}>
            <button
              aria-label="Pass"
              onClick={handlePass}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <X size={26} color="var(--text-muted)" />
            </button>
            <button
              aria-label="View profile"
              onClick={() => navigate(`/profile/${currentUser.id}`)}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              <Users size={20} color="var(--text-secondary)" />
            </button>
            <button
              aria-label="Like"
              onClick={handleLike}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={26} color="#000" fill="#000" />
            </button>
          </div>
        </div>
      )}

      {/* Matches Tab — mutual matches only */}
      {tab === 'matches' && (
        <div style={{ padding: '20px 16px', animation: 'fadeIn 0.3s ease' }}>
          {matchedUsers.length > 0 ? (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}>
              {matchedUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/chat/${user.id}`)}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-accent)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <img src={user.avatar} alt="" style={{
                    width: '100%', aspectRatio: '1', objectFit: 'cover',
                  }} />
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}, {user.age}</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '2px' }}>
                      <MessageCircle size={10} style={{ verticalAlign: '-1px', marginRight: '4px' }} />
                      Send a message
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <DemonLogo size={64} glow={false} />
              <p style={{ marginTop: '16px', fontWeight: 500 }}>No matches yet</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Keep sparking to find your match!</p>
            </div>
          )}
        </div>
      )}

      {/* Likes Tab */}
      {tab === 'likes' && (
        <div style={{ padding: '20px 16px', animation: 'fadeIn 0.3s ease' }}>
          {likedUsers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {likedUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img src={user.avatar} alt="" style={{
                    width: '50px', height: '50px', borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}, {user.age}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.tribe} · {user.distance}km</div>
                  </div>
                  <Heart size={16} color="var(--accent)" fill="var(--accent)" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>You haven't liked anyone yet</p>
            </div>
          )}
        </div>
      )}

      {/* Match Modal */}
      {matched && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="It's a Spark match"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 3000,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setMatched(null)}
        >
          <DemonLogo size={80} glow={true} />
          <h2 style={{
            fontSize: '32px', fontWeight: 900, marginTop: '16px',
            background: 'linear-gradient(135deg, #00ff66, #39ff14)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>IT'S A SPARK! 🔥</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>
            You and {matched.name} liked each other
          </p>
          <img src={matched.avatar} alt="" style={{
            width: '100px', height: '100px', borderRadius: '50%',
            objectFit: 'cover', marginTop: '20px',
            border: '3px solid var(--accent)',
            boxShadow: '0 0 30px var(--accent-glow-strong)',
          }} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/chat/${matched.id}`); }}
              style={{
                padding: '14px 32px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent)', color: '#000',
                fontWeight: 700, fontSize: '15px',
              }}
            >
              <MessageCircle size={16} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
              Message
            </button>
            <button
              onClick={() => setMatched(null)}
              style={{
                padding: '14px 24px', borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)',
                fontWeight: 600, fontSize: '15px',
                border: '1px solid var(--border-default)',
              }}
            >
              Keep Sparking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Shield, MapPin, Heart, MessageCircle, Ban, Flag,
  Share2, Camera, Ruler, Weight, Star, Eye, MoreHorizontal, Send,
  Image, FolderOpen, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';

export default function ProfilePage({ users, isOwnProfile = false, currentUser = null, onBlock, blockedUsers = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [toast, setToast] = useState(null);

  const user = isOwnProfile
    ? (currentUser ? {
        ...currentUser,
        id: 'me',
        status: 'online',
        distance: 0,
        lastSeen: 'Now',
        verified: true,
        photos: currentUser.photos || [],
        interests: currentUser.interests || ['Gym', 'Travel', 'Music', 'Cooking'],
        lookingFor: currentUser.lookingFor || ['Dates', 'Friends'],
        height: currentUser.height || '180cm',
        weight: currentUser.weight || '78kg',
        bodyType: currentUser.bodyType || 'Athletic',
        position: currentUser.position || 'Versatile',
        tribe: currentUser.tribe || 'Jock',
      } : {
        id: 'me',
        name: 'You',
        age: 28,
        bio: 'Edit your profile to add a bio ✏️',
        avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=myprofile&backgroundColor=1a1a1a',
        photos: [
          'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=myprofile-1&backgroundColor=1a1a1a',
          'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=myprofile-2&backgroundColor=1a1a1a',
        ],
        status: 'online',
        tribe: 'Jock',
        interests: ['Gym', 'Travel', 'Music', 'Cooking'],
        lookingFor: ['Dates', 'Friends'],
        height: '180cm',
        weight: '78kg',
        bodyType: 'Athletic',
        position: 'Versatile',
        verified: true,
        distance: 0,
        lastSeen: 'Now',
      })
    : users.find(u => u.id === id);

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        User not found
        <br />
        <button onClick={() => navigate(-1)} style={{ color: 'var(--accent)', marginTop: '12px', fontSize: '14px' }}>Go back</button>
      </div>
    );
  }

  const allPhotos = [user.avatar, ...(user.photos || [])];

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 80px)', minHeight: '100vh' }}>
      {/* Photo Gallery */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%',
          aspectRatio: '3/4',
          maxHeight: '65vh',
          overflow: 'hidden',
          background: 'var(--bg-card)',
        }}>
          <img
            src={allPhotos[activePhoto]}
            alt={user.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Photo dots */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px',
        }}>
          {allPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i)}
              style={{
                width: activePhoto === i ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: activePhoto === i ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Photo prev/next arrows */}
        {allPhotos.length > 1 && activePhoto > 0 && (
          <button
            onClick={() => setActivePhoto(p => p - 1)}
            style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          ><ChevronLeft size={20} /></button>
        )}
        {allPhotos.length > 1 && activePhoto < allPhotos.length - 1 && (
          <button
            onClick={() => setActivePhoto(p => p + 1)}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          ><ChevronRight size={20} /></button>
        )}

        {/* Back button */}
        {!isOwnProfile && (
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute', top: '12px', left: '12px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* More button */}
        {!isOwnProfile && (
          <button
            aria-label="More options"
            onClick={() => setShowActions(!showActions)}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <MoreHorizontal size={18} />
          </button>
        )}

        {/* Gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(transparent, var(--bg-primary))',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Profile Info */}
      <div style={{ padding: '0 16px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        {/* Name & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{user.name}</h1>
          <span style={{ fontSize: '22px', fontWeight: 300, color: 'var(--text-secondary)' }}>{user.age}</span>
          {user.verified && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(0,255,102,0.1)',
              padding: '3px 8px', borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-accent)',
            }}>
              <Shield size={12} color="var(--accent)" fill="var(--accent)" />
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>Verified</span>
            </div>
          )}
        </div>

        {/* Status & Distance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: user.status === 'online' ? 'var(--online)' : user.status === 'away' ? 'var(--away)' : 'var(--offline)',
              boxShadow: user.status === 'online' ? '0 0 6px var(--online)' : 'none',
            }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.lastSeen || 'Online'}</span>
          </div>
          {!isOwnProfile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} color="var(--accent)" />
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                {user.distance < 1 ? `${Math.round(user.distance * 1000)}m away` : `${user.distance}km away`}
              </span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p style={{
          marginTop: '16px', fontSize: '14px', lineHeight: '1.6',
          color: 'var(--text-secondary)',
        }}>{user.bio}</p>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => navigate(`/chat/${user.id}`)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: '15px',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.2s',
              }}
            >
              <MessageCircle size={18} />
              Message
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              style={{
                width: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: isFavorited ? 'rgba(255,59,59,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${isFavorited ? 'var(--danger)' : 'var(--border-default)'}`,
                transition: 'all 0.2s',
              }}
            >
              <Heart size={20}
                color={isFavorited ? 'var(--danger)' : 'var(--text-secondary)'}
                fill={isFavorited ? 'var(--danger)' : 'none'}
              />
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
              style={{
                width: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
            >
              <Share2 size={18} color="var(--text-secondary)" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginTop: '24px',
        }}>
          {[
            { icon: Ruler, label: 'Height', value: user.height },
            { icon: Weight, label: 'Weight', value: user.weight },
            { icon: Star, label: 'Body Type', value: user.bodyType },
            { icon: Eye, label: 'Position', value: user.position },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              background: 'var(--bg-card)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={14} color="var(--accent)" />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tribe */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tribe
          </h3>
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(0,255,102,0.1)', border: '1px solid var(--border-accent)',
            color: 'var(--accent)', fontSize: '13px', fontWeight: 600,
          }}>{user.tribe}</span>
        </div>

        {/* Interests */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interests
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {user.interests?.map(interest => (
              <span key={interest} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)', fontSize: '12px', fontWeight: 500,
                border: '1px solid var(--border-default)',
              }}>{interest}</span>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Looking For
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {user.lookingFor?.map(item => (
              <span key={item} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)',
                background: 'rgba(0,255,102,0.08)', fontSize: '12px', fontWeight: 500,
                color: 'var(--accent)', border: '1px solid var(--border-accent)',
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Report/Block */}
        {!isOwnProfile && (
          <div style={{
            display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button onClick={() => { if (onBlock) onBlock(user.id); navigate(-1); }} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: 'var(--text-muted)',
            }}>
              <Ban size={14} /> Block
            </button>
            <button onClick={() => { setToast('User reported. Our team will review this.'); setTimeout(() => setToast(null), 3000); }} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: 'var(--text-muted)',
            }}>
              <Flag size={14} /> Report
            </button>
          </div>
        )}

        {/* Own profile edit */}
        {isOwnProfile && (
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => navigate('/albums')}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
                background: 'rgba(0,255,102,0.1)', border: '1px solid var(--border-accent)',
                fontWeight: 600, fontSize: '14px', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Image size={16} /> My Albums
            </button>
            <button
              onClick={() => setShowEdit(true)}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <Camera size={16} /> Edit Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <Settings size={16} /> Settings
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            animation: 'fadeInBackdrop 0.2s ease',
          }}
          onClick={() => setShowEdit(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-elevated)', borderRadius: '20px 20px 0 0',
              width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto',
              padding: '20px 16px 40px', animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <button onClick={() => setShowEdit(false)} style={{ fontSize: 15, color: 'var(--text-muted)' }}>Cancel</button>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Edit Profile</h3>
              <button
                onClick={() => {
                  if (editForm) {
                    const updated = { ...user, ...editForm };
                    // Persist if we can
                    try { localStorage.setItem('om_currentUser', JSON.stringify(updated)); } catch {}
                    window.location.reload();
                  }
                  setShowEdit(false);
                }}
                style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}
              >
                Save
              </button>
            </div>

            {(() => {
              const form = editForm || {
                name: user.name || '',
                age: user.age || '',
                bio: user.bio || '',
                tribe: user.tribe || '',
                height: user.height || '',
                weight: user.weight || '',
                bodyType: user.bodyType || '',
                position: user.position || '',
              };
              if (!editForm) {
                // Initialize once
                setTimeout(() => setEditForm(form), 0);
              }
              const update = (key, val) => setEditForm(prev => ({ ...(prev || form), [key]: val }));
              const Field = ({ label, field, placeholder, multiline }) => (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={(editForm || form)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={placeholder}
                      rows={3}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)', fontSize: 14, resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(editForm || form)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)', fontSize: 14,
                      }}
                    />
                  )}
                </div>
              );
              const Select = ({ label, field, options }) => (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                    {label}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => update(field, opt)}
                        style={{
                          padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13,
                          fontWeight: 500, cursor: 'pointer', border: 'none',
                          background: (editForm || form)[field] === opt ? 'var(--accent)' : 'var(--bg-tertiary)',
                          color: (editForm || form)[field] === opt ? '#000' : 'var(--text-secondary)',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
              return (
                <>
                  {/* Photo Upload Section */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
                      Photos
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {/* Existing photos */}
                      {(editForm?.photos || [user.avatar, ...(user.photos || [])]).map((photo, idx) => (
                        <div key={idx} style={{
                          aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                          position: 'relative', background: 'var(--bg-tertiary)',
                        }}>
                          <img src={photo} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{
                              position: 'absolute', bottom: 4, left: 4,
                              padding: '2px 6px', borderRadius: 4,
                              background: 'var(--accent)', color: '#000',
                              fontSize: 9, fontWeight: 700,
                            }}>MAIN</span>
                          )}
                        </div>
                      ))}
                      {/* Add photo button */}
                      <label style={{
                        aspectRatio: '1', borderRadius: 'var(--radius-md)',
                        border: '2px dashed var(--border-accent)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: 'rgba(0,255,102,0.04)',
                        gap: 4,
                      }}>
                        <Camera size={22} color="var(--accent)" />
                        <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setEditForm(prev => ({
                                  ...(prev || form),
                                  photos: [...(prev?.photos || [user.avatar, ...(user.photos || [])]), ev.target.result],
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                        />
                      </label>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      Photos are stored locally. Connect Supabase for cloud storage.
                    </p>
                  </div>

                  <Field label="Name" field="name" placeholder="Your name" />
                  <Field label="Age" field="age" placeholder="Your age" />
                  <Field label="Bio" field="bio" placeholder="Write something about yourself..." multiline />
                  <Select label="Tribe" field="tribe" options={['Bear', 'Jock', 'Twink', 'Otter', 'Daddy', 'Geek', 'Rugged', 'Discreet', 'Leather', 'Clean-cut']} />
                  <Field label="Height" field="height" placeholder="e.g. 180cm" />
                  <Field label="Weight" field="weight" placeholder="e.g. 78kg" />
                  <Select label="Body Type" field="bodyType" options={['Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large']} />
                  <Select label="Position" field="position" options={['Top', 'Bottom', 'Versatile', 'Side']} />
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Action menu overlay */}
      {showActions && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}
          onClick={() => setShowActions(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 'calc(var(--bottom-nav-height) + 16px)',
              left: '16px', right: '16px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease',
            }}
          >
            {[
              { icon: Share2, label: 'Share Profile', color: 'var(--text-primary)', action: () => { navigator.clipboard?.writeText(window.location.href); setShowActions(false); } },
              { icon: Ban, label: 'Block User', color: 'var(--text-primary)', action: () => { if (onBlock) onBlock(user.id); setShowActions(false); navigate(-1); } },
              { icon: Flag, label: 'Report User', color: 'var(--danger)', action: () => { setToast('User reported. Our team will review this.'); setTimeout(() => setToast(null), 3000); setShowActions(false); } },
            ].map(({ icon: Icon, label, color, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                  color, fontSize: '15px', fontWeight: 500, textAlign: 'left',
                }}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 'calc(var(--bottom-nav-height) + 20px)',
          left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', color: 'var(--text-primary)',
          padding: '12px 24px', borderRadius: 'var(--radius-lg)',
          fontSize: '14px', fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-accent)',
          zIndex: 10000, whiteSpace: 'nowrap',
          animation: 'slideUp 0.3s ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

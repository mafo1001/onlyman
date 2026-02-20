import React, { useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Image, Lock, Unlock, Users, ChevronLeft, X, Upload,
  Check, Search, MoreHorizontal, Trash2, Share2, Eye, EyeOff,
  Camera, FolderPlus, Grid3X3, Heart, Download
} from 'lucide-react';

/* ════════════════════════════════════════
   ALBUMS PAGE - View all albums
   ════════════════════════════════════════ */
export default function AlbumsPage({ albums, setAlbums, users }) {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const publicAlbums = albums.filter(a => a.visibility === 'public');
  const privateAlbums = albums.filter(a => a.visibility === 'private');
  const sharedAlbums = albums.filter(a => a.visibility === 'shared');

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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Albums</h1>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 99,
            background: 'var(--accent)', color: '#000',
            fontWeight: 700, fontSize: 13,
          }}
        >
          <FolderPlus size={16} /> New
        </button>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 12, padding: '12px 16px',
        overflowX: 'auto',
      }}>
        {[
          { label: 'Total', count: albums.length, icon: Grid3X3 },
          { label: 'Public', count: publicAlbums.length, icon: Eye },
          { label: 'Private', count: privateAlbums.length, icon: Lock },
          { label: 'Shared', count: sharedAlbums.length, icon: Users },
        ].map(({ label, count, icon: Icon }) => (
          <div key={label} style={{
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            minWidth: 80, textAlign: 'center',
          }}>
            <Icon size={16} color="var(--accent)" style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>{count}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Album sections */}
      {albums.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Camera size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No albums yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
            Create your first album and start sharing photos with the community or specific users.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: '12px 32px', borderRadius: 'var(--radius-md)',
              background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: 14,
            }}
          >
            Create Album
          </button>
        </div>
      ) : (
        <div style={{ padding: '8px 16px' }}>
          {[
            { title: 'Public Albums', items: publicAlbums, icon: Eye },
            { title: 'Shared Albums', items: sharedAlbums, icon: Users },
            { title: 'Private Albums', items: privateAlbums, icon: Lock },
          ].filter(s => s.items.length > 0).map(section => (
            <div key={section.title} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <section.icon size={14} color="var(--accent)" />
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {section.title}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {section.items.map(album => (
                  <AlbumCard key={album.id} album={album} onClick={() => navigate(`/albums/${album.id}`)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      {showCreate && (
        <CreateAlbumModal
          onClose={() => setShowCreate(false)}
          onCreate={(album) => {
            setAlbums(prev => [...prev, album]);
            setShowCreate(false);
          }}
          users={users}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ALBUM DETAIL PAGE
   ════════════════════════════════════════ */
export function AlbumDetailPage({ albums, setAlbums, users }) {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [showShare, setShowShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const album = albums.find(a => a.id === albumId);

  if (!album) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Album not found
        <br />
        <button onClick={() => navigate('/albums')} style={{ color: 'var(--accent)', marginTop: 12, fontSize: 14 }}>Go back</button>
      </div>
    );
  }

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = [];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: ev.target.result,
          name: file.name,
          addedAt: new Date().toISOString(),
          likes: 0,
        });
        loaded++;
        if (loaded === files.length) {
          setAlbums(prev => prev.map(a =>
            a.id === albumId
              ? { ...a, photos: [...a.photos, ...newPhotos], updatedAt: new Date().toISOString() }
              : a
          ));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (photoId) => {
    setAlbums(prev => prev.map(a =>
      a.id === albumId
        ? { ...a, photos: a.photos.filter(p => p.id !== photoId) }
        : a
    ));
    setSelectedPhoto(null);
  };

  const handleDeleteAlbum = () => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    navigate('/albums');
  };

  const handleUpdateSharing = (sharedWith) => {
    setAlbums(prev => prev.map(a =>
      a.id === albumId
        ? { ...a, sharedWith, visibility: sharedWith.length > 0 ? 'shared' : a.visibility }
        : a
    ));
  };

  const visIcon = album.visibility === 'public' ? Eye : album.visibility === 'private' ? Lock : Users;
  const VisIcon = visIcon;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/albums')} style={{ color: 'var(--text-primary)' }}>
            <ChevronLeft size={22} />
          </button>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>{album.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <VisIcon size={11} />
              <span>{album.visibility}</span>
              <span>· {album.photos.length} photos</span>
              {album.sharedWith?.length > 0 && <span>· Shared with {album.sharedWith.length}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowShare(true)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg-elevated)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border-default)',
          }}>
            <Share2 size={16} color="var(--accent)" />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg-elevated)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border-default)',
          }}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Cover / description */}
      {album.description && (
        <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
          {album.description}
        </div>
      )}

      {/* Shared with badges */}
      {album.sharedWith?.length > 0 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Shared with:</span>
          {album.sharedWith.map(uid => {
            const u = users.find(user => user.id === uid);
            return u ? (
              <span key={uid} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 99,
                background: 'rgba(0,255,102,0.08)', border: '1px solid var(--border-accent)',
                fontSize: 11, color: 'var(--accent)',
              }}>
                <img src={u.avatar} alt="" style={{ width: 14, height: 14, borderRadius: '50%' }} />
                {u.name}
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Photo grid */}
      <div style={{ padding: '0 8px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 3,
        }}>
          {/* Add photo tile */}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              aspectRatio: '1',
              background: 'var(--bg-card)',
              border: '2px dashed var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              color: 'var(--accent)',
              transition: 'border-color 0.2s',
            }}
          >
            <Plus size={24} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>Add Photos</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAddPhotos} hidden />

          {album.photos.map(photo => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                aspectRatio: '1', overflow: 'hidden',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)',
                position: 'relative',
              }}
            >
              <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareAlbumModal
          album={album}
          users={users}
          onClose={() => setShowShare(false)}
          onSave={handleUpdateSharing}
        />
      )}

      {/* Photo lightbox */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={() => handleDeletePhoto(selectedPhoto.id)}
        />
      )}

      {/* Menu overlay */}
      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000 }} onClick={() => setShowMenu(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', bottom: 'calc(var(--bottom-nav-height) + 16px)',
            left: 16, right: 16, background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            animation: 'slideUp 0.2s ease',
          }}>
            {[
              { icon: Share2, label: 'Share Album', action: () => { setShowMenu(false); setShowShare(true); } },
              { icon: Trash2, label: 'Delete Album', action: handleDeleteAlbum, color: 'var(--danger)' },
            ].map(({ icon: Icon, label, action, color }) => (
              <button key={label} onClick={action} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                color: color || 'var(--text-primary)', fontSize: 15, fontWeight: 500,
              }}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ALBUM CARD
   ════════════════════════════════════════ */
function AlbumCard({ album, onClick }) {
  const coverUrl = album.photos[0]?.url || null;
  const visIcon = album.visibility === 'public' ? Eye : album.visibility === 'private' ? Lock : Users;
  const VisIcon = visIcon;

  return (
    <button onClick={onClick} style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      textAlign: 'left',
      transition: 'border-color 0.2s, transform 0.15s',
    }}>
      {/* Cover */}
      <div style={{ aspectRatio: '4/3', background: 'var(--bg-tertiary)', overflow: 'hidden', position: 'relative' }}>
        {coverUrl ? (
          <img src={coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image size={32} color="var(--text-muted)" />
          </div>
        )}
        {/* Badge */}
        <div style={{
          position: 'absolute', top: 6, right: 6,
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '3px 7px', borderRadius: 99,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          fontSize: 10, color: 'var(--text-secondary)',
        }}>
          <VisIcon size={10} />
          {album.photos.length}
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{album.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {album.visibility === 'shared' && album.sharedWith?.length > 0
            ? `Shared with ${album.sharedWith.length} user${album.sharedWith.length > 1 ? 's' : ''}`
            : album.visibility.charAt(0).toUpperCase() + album.visibility.slice(1)
          }
        </div>
      </div>
    </button>
  );
}

/* ════════════════════════════════════════
   CREATE ALBUM MODAL
   ════════════════════════════════════════ */
function CreateAlbumModal({ onClose, onCreate, users }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [sharedWith, setSharedWith] = useState([]);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: ev.target.result,
          name: file.name,
          addedAt: new Date().toISOString(),
          likes: 0,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      id: `album-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      visibility,
      sharedWith: visibility === 'shared' ? sharedWith : [],
      photos,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0',
        animation: 'slideUp 0.25s ease',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 10,
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>New Album</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={22} /></button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>Album Name</label>
            <input
              type="text" placeholder="e.g. Summer vibes"
              value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14 }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>Description (optional)</label>
            <textarea
              placeholder="What's this album about?"
              value={description} onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14, minHeight: 60, resize: 'vertical' }}
            />
          </div>

          {/* Visibility */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 8 }}>Visibility</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'public', label: 'Public', icon: Eye, desc: 'Everyone can see' },
                { value: 'shared', label: 'Shared', icon: Users, desc: 'Specific users only' },
                { value: 'private', label: 'Private', icon: Lock, desc: 'Only you' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setVisibility(opt.value)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                  background: visibility === opt.value ? 'rgba(0,255,102,0.1)' : 'var(--bg-card)',
                  border: `1.5px solid ${visibility === opt.value ? 'var(--accent)' : 'var(--border-default)'}`,
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}>
                  <opt.icon size={18} color={visibility === opt.value ? 'var(--accent)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: visibility === opt.value ? 'var(--accent)' : 'var(--text-primary)' }}>{opt.label}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Share with users - only when shared */}
          {visibility === 'shared' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 8 }}>Share with</label>
              {sharedWith.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {sharedWith.map(uid => {
                    const u = users.find(user => user.id === uid);
                    return u ? (
                      <span key={uid} style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 99,
                        background: 'rgba(0,255,102,0.1)', border: '1px solid var(--border-accent)',
                        fontSize: 12, color: 'var(--accent)',
                      }}>
                        <img src={u.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%' }} />
                        {u.name}
                        <button onClick={() => setSharedWith(prev => prev.filter(id => id !== uid))} style={{ color: 'var(--accent)' }}>
                          <X size={12} />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <button onClick={() => setShowUserPicker(true)} style={{
                width: '100%', padding: '10px', borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-default)', background: 'var(--bg-input)',
                color: 'var(--text-muted)', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Plus size={16} /> Add users
              </button>

              {showUserPicker && (
                <UserPickerInline
                  users={users}
                  selected={sharedWith}
                  onToggle={(uid) => setSharedWith(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid])}
                  onClose={() => setShowUserPicker(false)}
                />
              )}
            </div>
          )}

          {/* Photos */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 8 }}>
              Photos ({photos.length})
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              <button onClick={() => fileRef.current?.click()} style={{
                aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                border: '2px dashed var(--border-default)', background: 'var(--bg-card)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, color: 'var(--accent)',
              }}>
                <Upload size={18} />
                <span style={{ fontSize: 9, fontWeight: 600 }}>Upload</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos} hidden />
              {photos.map(p => (
                <div key={p.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => setPhotos(prev => prev.filter(ph => ph.id !== p.id))}
                    style={{
                      position: 'absolute', top: 3, right: 3,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={10} color="#fff" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
              background: name.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
              color: name.trim() ? '#000' : 'var(--text-muted)',
              fontWeight: 800, fontSize: 15,
              boxShadow: name.trim() ? '0 0 20px var(--accent-glow)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Create Album
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SHARE ALBUM MODAL
   ════════════════════════════════════════ */
function ShareAlbumModal({ album, users, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(album.sharedWith || []));
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    onSave(Array.from(selected));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '70vh',
        background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0',
        animation: 'slideUp 0.25s ease', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Share "{album.name}"</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={22} /></button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search users..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14 }}
            />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, marginBottom: 4 }}>
            {selected.size} user{selected.size !== 1 ? 's' : ''} selected
          </div>
        </div>

        {/* User list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
          {filteredUsers.map(user => {
            const isSelected = selected.has(user.id);
            return (
              <button
                key={user.id}
                onClick={() => {
                  setSelected(prev => {
                    const next = new Set(prev);
                    if (next.has(user.id)) next.delete(user.id);
                    else next.add(user.id);
                    return next;
                  });
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <img src={user.avatar} alt="" style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'border-color 0.15s',
                }} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}, {user.age}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.distance}km away · {user.tribe}</div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && <Check size={14} color="#000" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Save */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={handleSave} style={{
            width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: 15,
            boxShadow: '0 0 16px var(--accent-glow)',
          }}>
            Save Sharing ({selected.size} user{selected.size !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   INLINE USER PICKER (for create modal)
   ════════════════════════════════════════ */
function UserPickerInline({ users, selected, onToggle, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{
      marginTop: 8, borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)', background: 'var(--bg-card)',
      maxHeight: 240, overflowY: 'auto',
    }}>
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '6px 6px 6px 28px', borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }} />
        </div>
      </div>
      {filtered.slice(0, 20).map(u => (
        <button key={u.id} onClick={() => onToggle(u.id)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <img src={u.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 500 }}>{u.name}</span>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: `1.5px solid ${selected.includes(u.id) ? 'var(--accent)' : 'var(--border-default)'}`,
            background: selected.includes(u.id) ? 'var(--accent)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selected.includes(u.id) && <Check size={10} color="#000" />}
          </div>
        </button>
      ))}
      <div style={{ padding: 8, textAlign: 'center' }}>
        <button onClick={onClose} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Done</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PHOTO LIGHTBOX
   ════════════════════════════════════════ */
function PhotoLightbox({ photo, onClose, onDelete }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px',
      }}>
        <button onClick={onClose} style={{ color: '#fff' }}><X size={24} /></button>
        <button onClick={onDelete} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 99,
          background: 'rgba(255,59,59,0.2)', color: 'var(--danger)',
          fontSize: 13, fontWeight: 600,
        }}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
      <img src={photo.url} alt="" style={{
        maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain',
        borderRadius: 'var(--radius-md)',
      }} />
    </div>
  );
}

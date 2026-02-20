import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, MoreHorizontal, Send, Image, Smile, Mic, Phone, Video, Shield, MapPin } from 'lucide-react';

export function MessagesPage({ conversations }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter(c =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 16px)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 16px',
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Messages</h1>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: '36px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)', height: '42px', fontSize: '16px',
              minHeight: '44px',
            }}
          />
        </div>
      </div>

      {/* Online users strip */}
      <div style={{
        display: 'flex', gap: '12px', padding: '14px 16px',
        overflowX: 'auto', borderBottom: '1px solid var(--border-subtle)',
      }}>
        {conversations.filter(c => c.user.status === 'online').slice(0, 10).map(c => (
          <div
            key={c.user.id}
            onClick={() => navigate(`/chat/${c.user.id}`)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative' }}>
              <img src={c.user.avatar} alt="" style={{
                width: '48px', height: '48px', borderRadius: '50%',
                objectFit: 'cover', border: '2px solid var(--accent)',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'var(--online)',
                border: '2px solid var(--bg-primary)',
              }} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.user.name}
            </span>
          </div>
        ))}
      </div>

      {/* Conversations list */}
      <div style={{ padding: '4px 0' }}>
        {filtered.map(conv => (
          <div
            key={conv.id}
            onClick={() => navigate(`/chat/${conv.user.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 0.15s',
              background: conv.unread > 0 ? 'rgba(0,255,102,0.03)' : 'transparent',
              minHeight: '64px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={conv.user.avatar} alt="" style={{
                width: '52px', height: '52px', borderRadius: '50%',
                objectFit: 'cover',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '12px', height: '12px', borderRadius: '50%',
                background: conv.user.status === 'online' ? 'var(--online)' :
                            conv.user.status === 'away' ? 'var(--away)' : 'var(--offline)',
                border: '2px solid var(--bg-primary)',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontWeight: conv.unread > 0 ? 700 : 500,
                  fontSize: '14px',
                }}>{conv.user.name}</span>
                <span style={{
                  fontSize: '11px',
                  color: conv.unread > 0 ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  {formatTime(conv.lastMessage.timestamp)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                <p style={{
                  fontSize: '13px',
                  color: conv.unread > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: conv.unread > 0 ? 500 : 400,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '200px',
                }}>
                  {conv.lastMessage.fromMe ? 'You: ' : ''}{conv.lastMessage.text}
                </p>
                {conv.unread > 0 && (
                  <span style={{
                    background: 'var(--accent)', color: '#000',
                    fontSize: '10px', fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 7px', minWidth: '18px', textAlign: 'center',
                    flexShrink: 0,
                  }}>{conv.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No conversations yet</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Start chatting with guys near you!</p>
        </div>
      )}
    </div>
  );
}

export function ChatPage({ conversations, users, onSendMessage }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef();

  const conv = conversations.find(c => c.user.id === id);
  const user = conv?.user || users.find(u => u.id === id);
  const messages = conv?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;
    if (onSendMessage) onSendMessage(user.id, newMessage.trim());
    setNewMessage('');
  };

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>User not found</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', height: '100dvh', background: 'var(--bg-primary)' }}>
      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 12px',
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <button onClick={() => navigate('/messages')} style={{ padding: '6px' }}>
          <ArrowLeft size={20} />
        </button>
        <div
          onClick={() => navigate(`/profile/${user.id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer' }}
        >
          <div style={{ position: 'relative' }}>
            <img src={user.avatar} alt="" style={{
              width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover',
            }} />
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: '10px', height: '10px', borderRadius: '50%',
              background: user.status === 'online' ? 'var(--online)' : 'var(--offline)',
              border: '2px solid var(--bg-primary)',
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>{user.name}</span>
              {user.verified && <Shield size={12} color="var(--accent)" />}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {user.status === 'online' ? (
                <span style={{ color: 'var(--online)' }}>Online</span>
              ) : user.lastSeen}
              {' · '}
              {user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance}km`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={{ padding: '8px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
            <Phone size={18} />
          </button>
          <button style={{ padding: '8px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 12px',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {/* Distance badge */}
        <div style={{
          alignSelf: 'center',
          background: 'var(--bg-card)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <MapPin size={11} />
          {user.distance < 1 ? `${Math.round(user.distance * 1000)}m away` : `${user.distance}km away`}
        </div>

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              maxWidth: '75%',
              alignSelf: msg.fromMe ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.fromMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.fromMe
                ? 'linear-gradient(135deg, var(--accent), var(--accent-dim))'
                : 'var(--bg-elevated)',
              color: msg.fromMe ? '#000' : 'var(--text-primary)',
              fontSize: '14px',
              lineHeight: '1.4',
            }}>
              {msg.text}
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginTop: '3px',
              textAlign: msg.fromMe ? 'right' : 'left',
              padding: '0 4px',
            }}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {msg.fromMe && <span style={{ marginLeft: '4px' }}>{msg.read ? '✓✓' : '✓'}</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <button style={{ padding: '8px', color: 'var(--text-muted)' }}>
          <Image size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          enterKeyHint="send"
          style={{
            flex: 1, borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            padding: '10px 16px',
            fontSize: '16px',
            minHeight: '44px',
          }}
        />
        {newMessage.trim() ? (
          <button
            onClick={sendMessage}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Send size={18} color="#000" />
          </button>
        ) : (
          <button style={{ padding: '8px', color: 'var(--text-muted)' }}>
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

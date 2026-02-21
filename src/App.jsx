import React, { useState, useEffect, useMemo, useCallback, Component } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { generateMockUsers, generateMockMessages, generateMockEvents } from './data/mockUsers';
import BottomNav from './components/BottomNav';
import GridPage from './pages/GridPage';
import RadarPage from './pages/RadarPage';
import SparkPage from './pages/SparkPage';
import { MessagesPage, ChatPage } from './pages/MessagesPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import AlbumsPage, { AlbumDetailPage } from './pages/AlbumsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RouteErrorBoundary from './components/RouteErrorBoundary';

/* ── Error Boundary ── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0a0a0a', color: '#ff4444', padding: 40, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
          <h2>Something went wrong</h2>
          <pre style={{ color: '#888', whiteSpace: 'pre-wrap', fontSize: 13 }}>{String(this.state.error)}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 24px', background: '#00ff66', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Splash Screen ── */
function SplashScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ fontSize: 48, fontWeight: 900, color: '#00ff66', letterSpacing: -2, animation: 'pulse-glow 2s ease-in-out infinite' }}>
        ONLYMAN
      </div>
      <div style={{ marginTop: 12, color: '#555', fontSize: 14 }}>Loading...</div>
    </div>
  );
}

/* ── Main App ── */
function App() {
  const [users] = useState(() => generateMockUsers(40));
  const [conversations, setConversations] = useState([]);
  const [events, setEvents] = useState(() => generateMockEvents());
  const [albums, setAlbums] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_blocked') || '[]'); } catch { return []; }
  });
  const [isSignedUp, setIsSignedUp] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_signedUp') || 'false'); } catch { return false; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_currentUser') || 'null'); } catch { return null; }
  });
  const isPremium = currentUser?.userNumber != null && currentUser.userNumber <= 1000;
  const [rightNowMode, setRightNowMode] = useState(() => {
    try {
      const expiry = JSON.parse(localStorage.getItem('om_rightNowExpiry') || '0');
      return expiry > Date.now();
    } catch { return false; }
  });
  const [rightNowExpiry, setRightNowExpiry] = useState(() => {
    try {
      const v = localStorage.getItem('om_rightNowExpiry');
      if (v === 'Infinity') return Infinity;
      return JSON.parse(v || '0');
    } catch { return 0; }
  });
  const [ghostMode, setGhostMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_ghostMode') || 'false'); } catch { return false; }
  });
  const [distanceUnit, setDistanceUnit] = useState(() => {
    try { return localStorage.getItem('om_distanceUnit') || 'km'; } catch { return 'km'; }
  });
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_notifications') ?? 'true'); } catch { return true; }
  });
  const [showOnline, setShowOnline] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_showOnline') ?? 'true'); } catch { return true; }
  });
  const [showDistance, setShowDistance] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_showDistance') ?? 'true'); } catch { return true; }
  });
  const [ready, setReady] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const location = useLocation();

  // Generate conversations once users are available
  useEffect(() => {
    if (users.length > 0) {
      setConversations(generateMockMessages(users));
      setReady(true);
    }
  }, [users]);

  // Try to get geolocation (non-blocking)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setMyLocation({ lat: 45.5017, lng: -73.5673 }), // Default to Montréal
        { timeout: 5000 }
      );
    } else {
      setMyLocation({ lat: 45.5017, lng: -73.5673 });
    }
  }, []);

  // Persist auth state
  useEffect(() => {
    localStorage.setItem('om_signedUp', JSON.stringify(isSignedUp));
  }, [isSignedUp]);
  useEffect(() => {
    localStorage.setItem('om_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem('om_blocked', JSON.stringify(blockedUsers));
  }, [blockedUsers]);
  useEffect(() => {
    localStorage.setItem('om_rightNowExpiry', rightNowExpiry === Infinity ? 'Infinity' : JSON.stringify(rightNowExpiry));
    // Check if expired (Infinity = premium lifetime, never expires)
    if (rightNowExpiry === Infinity || (rightNowExpiry > 0 && rightNowExpiry > Date.now())) {
      setRightNowMode(true);
      if (rightNowExpiry !== Infinity) {
        const timeout = setTimeout(() => {
          setRightNowMode(false);
          setRightNowExpiry(0);
        }, rightNowExpiry - Date.now());
        return () => clearTimeout(timeout);
      }
    } else if (rightNowExpiry > 0 && rightNowExpiry <= Date.now()) {
      setRightNowMode(false);
      setRightNowExpiry(0);
    }
  }, [rightNowExpiry]);
  const activateRightNow = useCallback((durationMs = 60 * 60 * 1000) => {
    const expiry = Date.now() + durationMs;
    setRightNowExpiry(expiry);
    setRightNowMode(true);
  }, []);

  const deactivateRightNow = useCallback(() => {
    setRightNowExpiry(0);
    setRightNowMode(false);
  }, []);
  useEffect(() => {
    localStorage.setItem('om_ghostMode', JSON.stringify(ghostMode));
  }, [ghostMode]);
  useEffect(() => {
    localStorage.setItem('om_distanceUnit', distanceUnit);
  }, [distanceUnit]);
  useEffect(() => {
    localStorage.setItem('om_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('om_showOnline', JSON.stringify(showOnline));
  }, [showOnline]);
  useEffect(() => {
    localStorage.setItem('om_showDistance', JSON.stringify(showDistance));
  }, [showDistance]);

  const handleSignUp = (userData) => {
    // Assign sequential user number (first 1000 get lifetime premium)
    const prevCount = parseInt(localStorage.getItem('om_userCount') || '0', 10);
    const userNumber = prevCount + 1;
    localStorage.setItem('om_userCount', String(userNumber));
    const enrichedUser = { ...userData, userNumber };
    setCurrentUser(enrichedUser);
    setIsSignedUp(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSignedUp(false);
    localStorage.removeItem('om_signedUp');
    localStorage.removeItem('om_currentUser');
  };

  // Send a message and persist into conversations state
  const handleSendMessage = useCallback((userId, text) => {
    const newMsg = {
      id: `msg-new-${Date.now()}`,
      text,
      fromMe: true,
      timestamp: new Date(),
      read: false,
    };
    setConversations(prev => {
      const idx = prev.findIndex(c => c.user.id === userId);
      if (idx >= 0) {
        const updated = [...prev];
        const conv = { ...updated[idx] };
        conv.messages = [...conv.messages, newMsg];
        conv.lastMessage = newMsg;
        updated[idx] = conv;
        return updated;
      }
      // New conversation with a user
      const user = users.find(u => u.id === userId);
      if (!user) return prev;
      return [{
        id: `conv-new-${Date.now()}`,
        user,
        messages: [newMsg],
        lastMessage: newMsg,
        unread: 0,
      }, ...prev];
    });
  }, [users]);

  // Block / report
  const handleBlock = useCallback((userId) => {
    setBlockedUsers(prev => [...prev, userId]);
  }, []);

  // Join event
  const handleJoinEvent = useCallback((eventId) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, attendees: e.attendees + 1, joined: true } : e
    ));
  }, []);

  // Create event
  const handleCreateEvent = useCallback((event) => {
    setEvents(prev => [event, ...prev]);
  }, []);

  // Unblock user
  const handleUnblock = useCallback((userId) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
  }, []);

  // Total unread count
  const unreadCount = useMemo(() =>
    conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
  [conversations]);

  if (!ready) return <SplashScreen />;

  // Hide bottom nav on signup & settings pages
  const hideNav = ['/signup', '/settings', '/terms', '/privacy'].includes(location.pathname);

  return (
    <div style={{ background: 'var(--bg-primary, #0a0a0a)', minHeight: '100dvh', paddingBottom: hideNav ? 0 : 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))', fontFamily: 'Inter, sans-serif' }}>
      <Routes>
        <Route path="/" element={isSignedUp ? <RouteErrorBoundary name="Grid"><GridPage users={users} blockedUsers={blockedUsers} rightNowMode={rightNowMode} rightNowExpiry={rightNowExpiry} activateRightNow={activateRightNow} deactivateRightNow={deactivateRightNow} ghostMode={ghostMode} isPremium={isPremium} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/radar" element={isSignedUp ? <RouteErrorBoundary name="Radar"><RadarPage users={users} myLocation={myLocation} blockedUsers={blockedUsers} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/spark" element={isSignedUp ? <RouteErrorBoundary name="Spark"><SparkPage users={users} blockedUsers={blockedUsers} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/messages" element={isSignedUp ? <RouteErrorBoundary name="Messages"><MessagesPage conversations={conversations} blockedUsers={blockedUsers} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/chat/:id" element={isSignedUp ? <RouteErrorBoundary name="Chat"><ChatPage conversations={conversations} users={users} onSendMessage={handleSendMessage} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/events" element={isSignedUp ? <RouteErrorBoundary name="Events"><EventsPage events={events} onJoinEvent={handleJoinEvent} onCreateEvent={handleCreateEvent} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/profile" element={isSignedUp ? <RouteErrorBoundary name="Profile"><ProfilePage isOwnProfile={true} users={users} albums={albums} currentUser={currentUser} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/profile/:id" element={isSignedUp ? <RouteErrorBoundary name="Profile"><ProfilePage users={users} albums={albums} onBlock={handleBlock} blockedUsers={blockedUsers} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleSignUp} />} />
        <Route path="/settings" element={isSignedUp ? <RouteErrorBoundary name="Settings"><SettingsPage currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} ghostMode={ghostMode} setGhostMode={setGhostMode} rightNowMode={rightNowMode} rightNowExpiry={rightNowExpiry} activateRightNow={activateRightNow} deactivateRightNow={deactivateRightNow} isPremium={isPremium} distanceUnit={distanceUnit} setDistanceUnit={setDistanceUnit} notifications={notifications} setNotifications={setNotifications} showOnline={showOnline} setShowOnline={setShowOnline} showDistance={showDistance} setShowDistance={setShowDistance} blockedUsers={blockedUsers} onUnblock={handleUnblock} users={users} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/albums" element={isSignedUp ? <RouteErrorBoundary name="Albums"><AlbumsPage albums={albums} setAlbums={setAlbums} users={users} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/albums/:albumId" element={isSignedUp ? <RouteErrorBoundary name="Album"><AlbumDetailPage albums={albums} setAlbums={setAlbums} users={users} /></RouteErrorBoundary> : <Navigate to="/signup" replace />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      {!hideNav && isSignedUp && <BottomNav unreadCount={unreadCount} />}
    </div>
  );
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;

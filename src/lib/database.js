import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Database service for ONLYMAN.
 * Falls back to localStorage when Supabase is not configured.
 */

// ── Profiles ──

export async function getProfile(userId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) { console.error('getProfile error:', error); return null; }
  return data;
}

export async function updateProfile(userId, updates) {
  if (!isSupabaseConfigured()) {
    // Fallback: merge into localStorage
    try {
      const current = JSON.parse(localStorage.getItem('om_currentUser') || '{}');
      const updated = { ...current, ...updates };
      localStorage.setItem('om_currentUser', JSON.stringify(updated));
      return updated;
    } catch { return null; }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) { console.error('updateProfile error:', error); return null; }
  return data;
}

export async function getNearbyProfiles(lat, lng, radiusKm = 50) {
  if (!isSupabaseConfigured()) return [];
  // Uses PostGIS extension (see schema.sql)
  const { data, error } = await supabase.rpc('get_nearby_profiles', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
  });
  if (error) { console.error('getNearbyProfiles error:', error); return []; }
  return data || [];
}

// ── Conversations / Messages ──

export async function getConversations(userId) {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      created_at,
      participant1:profiles!conversations_participant1_fkey(id, name, avatar_url),
      participant2:profiles!conversations_participant2_fkey(id, name, avatar_url),
      messages(id, text, sender_id, created_at, read)
    `)
    .or(`participant1.eq.${userId},participant2.eq.${userId}`)
    .order('created_at', { foreignTable: 'messages', ascending: false })
    .limit(1, { foreignTable: 'messages' });
  if (error) { console.error('getConversations error:', error); return []; }
  return data || [];
}

export async function sendMessage(conversationId, senderId, text) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      text,
    })
    .select()
    .single();
  if (error) { console.error('sendMessage error:', error); return null; }
  return data;
}

export async function markMessagesRead(conversationId, userId) {
  if (!isSupabaseConfigured()) return;
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);
}

// ── Blocking ──

export async function blockUser(blockerId, blockedId) {
  if (!isSupabaseConfigured()) return;
  await supabase.from('blocks').insert({ blocker_id: blockerId, blocked_id: blockedId });
}

export async function getBlockedUsers(userId) {
  if (!isSupabaseConfigured()) {
    try { return JSON.parse(localStorage.getItem('om_blocked') || '[]'); } catch { return []; }
  }
  const { data } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', userId);
  return (data || []).map(b => b.blocked_id);
}

// ── Events ──

export async function getEvents() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });
  if (error) { console.error('getEvents error:', error); return []; }
  return data || [];
}

export async function joinEvent(eventId, userId) {
  if (!isSupabaseConfigured()) return;
  await supabase.from('event_attendees').insert({ event_id: eventId, user_id: userId });
  await supabase.rpc('increment_event_attendees', { event_id_input: eventId });
}

// ── Storage (Photos) ──

export async function uploadPhoto(userId, file) {
  if (!isSupabaseConfigured()) {
    // Fallback: return base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) { console.error('uploadPhoto error:', error); return null; }

  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deletePhoto(path) {
  if (!isSupabaseConfigured()) return;
  await supabase.storage.from('photos').remove([path]);
}

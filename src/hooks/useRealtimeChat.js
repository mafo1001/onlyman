import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Real-time messaging hook for ONLYMAN.
 * 
 * When Supabase is configured, subscribes to real-time message inserts
 * for the given conversation. Falls back gracefully when not configured.
 * 
 * Usage:
 *   const { messages, sendMessage, isConnected } = useRealtimeChat(conversationId, userId);
 */
export function useRealtimeChat(conversationId, userId) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef(null);
  const configured = isSupabaseConfigured();

  // Load initial messages
  useEffect(() => {
    if (!configured || !conversationId) return;

    async function loadMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    }

    loadMessages();
  }, [conversationId, configured]);

  // Subscribe to real-time message inserts
  useEffect(() => {
    if (!configured || !conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Mark as read if from the other person
          if (newMsg.sender_id !== userId) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id)
              .then(() => {});
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, userId, configured]);

  // Send a message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return null;

    if (!configured) {
      // Fallback: local-only message
      const localMsg = {
        id: `local-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: userId,
        text: text.trim(),
        read: false,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, localMsg]);
      return localMsg;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        text: text.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Send message error:', error);
      return null;
    }

    return data;
  }, [conversationId, userId, configured]);

  return {
    messages,
    sendMessage,
    isConnected,
    configured,
  };
}

/**
 * Hook to subscribe to real-time presence (who's online).
 * 
 * Usage:
 *   const { onlineUsers } = usePresence(userId);
 */
export function usePresence(userId) {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured || !userId) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: { key: userId },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const online = new Set(Object.keys(state));
        setOnlineUsers(online);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, configured]);

  return { onlineUsers };
}

/**
 * Hook to listen for new matches (real-time spark likes).
 * 
 * Usage:
 *   useMatchListener(userId, (match) => { showMatchModal(match); });
 */
export function useMatchListener(userId, onMatch) {
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured || !userId) return;

    const channel = supabase
      .channel(`matches:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'spark_likes',
          filter: `liked_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.is_mutual && !payload.old.is_mutual) {
            // New mutual match!
            onMatch?.(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, configured, onMatch]);
}

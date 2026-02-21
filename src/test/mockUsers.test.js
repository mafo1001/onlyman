import { describe, it, expect } from 'vitest';
import { generateMockUsers, generateMockMessages, generateMockEvents } from '../data/mockUsers';

describe('generateMockUsers', () => {
  it('generates the requested number of users', () => {
    const users = generateMockUsers(10);
    expect(users).toHaveLength(10);
  });

  it('generates users with required fields', () => {
    const users = generateMockUsers(5);
    users.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('age');
      expect(user).toHaveProperty('avatar');
      expect(user).toHaveProperty('bio');
      expect(user).toHaveProperty('distance');
      expect(user).toHaveProperty('tribe');
      expect(user).toHaveProperty('status');
      expect(user).toHaveProperty('verified');
      expect(user).toHaveProperty('interests');
      expect(user).toHaveProperty('lookingFor');
    });
  });

  it('generates unique user IDs', () => {
    const users = generateMockUsers(20);
    const ids = users.map(u => u.id);
    expect(new Set(ids).size).toBe(20);
  });

  it('generates valid ages (18+)', () => {
    const users = generateMockUsers(40);
    users.forEach(user => {
      expect(user.age).toBeGreaterThanOrEqual(18);
    });
  });

  it('generates valid distances (non-negative)', () => {
    const users = generateMockUsers(20);
    users.forEach(user => {
      expect(user.distance).toBeGreaterThanOrEqual(0);
    });
  });

  it('generates valid statuses', () => {
    const users = generateMockUsers(20);
    const validStatuses = ['online', 'offline', 'away'];
    users.forEach(user => {
      expect(validStatuses).toContain(user.status);
    });
  });
});

describe('generateMockMessages', () => {
  it('generates conversations from users', () => {
    const users = generateMockUsers(10);
    const conversations = generateMockMessages(users);
    expect(conversations.length).toBeGreaterThan(0);
  });

  it('each conversation has required fields', () => {
    const users = generateMockUsers(10);
    const conversations = generateMockMessages(users);
    conversations.forEach(conv => {
      expect(conv).toHaveProperty('id');
      expect(conv).toHaveProperty('user');
      expect(conv).toHaveProperty('messages');
      expect(conv).toHaveProperty('lastMessage');
      expect(conv.user).toHaveProperty('name');
      expect(Array.isArray(conv.messages)).toBe(true);
      expect(conv.messages.length).toBeGreaterThan(0);
    });
  });
});

describe('generateMockEvents', () => {
  it('generates events', () => {
    const events = generateMockEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it('each event has required fields', () => {
    const events = generateMockEvents();
    events.forEach(event => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('category');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('attendees');
    });
  });
});

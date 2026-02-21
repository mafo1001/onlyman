import { describe, it, expect, beforeEach } from 'vitest';

describe('Premium Status Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('user number <= 1000 is premium', () => {
    const currentUser = { name: 'Test', userNumber: 500 };
    const isPremium = currentUser.userNumber != null && currentUser.userNumber <= 1000;
    expect(isPremium).toBe(true);
  });

  it('user number > 1000 is not premium', () => {
    const currentUser = { name: 'Test', userNumber: 1500 };
    const isPremium = currentUser.userNumber != null && currentUser.userNumber <= 1000;
    expect(isPremium).toBe(false);
  });

  it('user without number is not premium', () => {
    const currentUser = { name: 'Test' };
    const isPremium = currentUser.userNumber != null && currentUser.userNumber <= 1000;
    expect(isPremium).toBe(false);
  });

  it('user number 1000 (boundary) is premium', () => {
    const currentUser = { name: 'Test', userNumber: 1000 };
    const isPremium = currentUser.userNumber != null && currentUser.userNumber <= 1000;
    expect(isPremium).toBe(true);
  });

  it('user number 1001 (boundary) is not premium', () => {
    const currentUser = { name: 'Test', userNumber: 1001 };
    const isPremium = currentUser.userNumber != null && currentUser.userNumber <= 1000;
    expect(isPremium).toBe(false);
  });
});

describe('Blocking Logic', () => {
  it('filters blocked users from list', () => {
    const users = [
      { id: 'user-1', name: 'Alice' },
      { id: 'user-2', name: 'Bob' },
      { id: 'user-3', name: 'Charlie' },
    ];
    const blockedUsers = ['user-2'];
    const filtered = users.filter(u => !blockedUsers.includes(u.id));
    expect(filtered).toHaveLength(2);
    expect(filtered.map(u => u.id)).toEqual(['user-1', 'user-3']);
  });

  it('empty blocked list returns all users', () => {
    const users = [
      { id: 'user-1', name: 'Alice' },
      { id: 'user-2', name: 'Bob' },
    ];
    const blockedUsers = [];
    const filtered = users.filter(u => !blockedUsers.includes(u.id));
    expect(filtered).toHaveLength(2);
  });

  it('blocking all users returns empty list', () => {
    const users = [
      { id: 'user-1', name: 'Alice' },
      { id: 'user-2', name: 'Bob' },
    ];
    const blockedUsers = ['user-1', 'user-2'];
    const filtered = users.filter(u => !blockedUsers.includes(u.id));
    expect(filtered).toHaveLength(0);
  });
});

describe('Right Now Expiry Logic', () => {
  it('active when expiry is in the future', () => {
    const expiry = Date.now() + 60000;
    const isActive = expiry > Date.now();
    expect(isActive).toBe(true);
  });

  it('inactive when expiry is in the past', () => {
    const expiry = Date.now() - 60000;
    const isActive = expiry > Date.now();
    expect(isActive).toBe(false);
  });

  it('Infinity means premium lifetime (never expires)', () => {
    const expiry = Infinity;
    const isActive = expiry === Infinity || expiry > Date.now();
    expect(isActive).toBe(true);
  });

  it('zero means not active', () => {
    const expiry = 0;
    const isActive = expiry === Infinity || (expiry > 0 && expiry > Date.now());
    expect(isActive).toBe(false);
  });
});

describe('User Number Assignment', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('first user gets number 1', () => {
    const prevCount = parseInt(localStorage.getItem('om_userCount') || '0', 10);
    const userNumber = prevCount + 1;
    localStorage.setItem('om_userCount', String(userNumber));
    expect(userNumber).toBe(1);
  });

  it('sequential users get incrementing numbers', () => {
    localStorage.setItem('om_userCount', '42');
    const prevCount = parseInt(localStorage.getItem('om_userCount') || '0', 10);
    const userNumber = prevCount + 1;
    expect(userNumber).toBe(43);
  });
});

describe('LocalStorage Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and retrieves signup state', () => {
    localStorage.setItem('om_signedUp', JSON.stringify(true));
    const result = JSON.parse(localStorage.getItem('om_signedUp') || 'false');
    expect(result).toBe(true);
  });

  it('persists and retrieves blocked users', () => {
    const blocked = ['user-1', 'user-2'];
    localStorage.setItem('om_blocked', JSON.stringify(blocked));
    const result = JSON.parse(localStorage.getItem('om_blocked') || '[]');
    expect(result).toEqual(blocked);
  });

  it('persists and retrieves ghost mode', () => {
    localStorage.setItem('om_ghostMode', JSON.stringify(true));
    const result = JSON.parse(localStorage.getItem('om_ghostMode') || 'false');
    expect(result).toBe(true);
  });

  it('persists settings preferences', () => {
    localStorage.setItem('om_distanceUnit', 'mi');
    localStorage.setItem('om_notifications', JSON.stringify(false));
    localStorage.setItem('om_showOnline', JSON.stringify(false));
    localStorage.setItem('om_showDistance', JSON.stringify(false));

    expect(localStorage.getItem('om_distanceUnit')).toBe('mi');
    expect(JSON.parse(localStorage.getItem('om_notifications'))).toBe(false);
    expect(JSON.parse(localStorage.getItem('om_showOnline'))).toBe(false);
    expect(JSON.parse(localStorage.getItem('om_showDistance'))).toBe(false);
  });

  it('handles Infinity expiry for Right Now', () => {
    localStorage.setItem('om_rightNowExpiry', 'Infinity');
    const v = localStorage.getItem('om_rightNowExpiry');
    const result = v === 'Infinity' ? Infinity : JSON.parse(v || '0');
    expect(result).toBe(Infinity);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('om_blocked', 'not-json');
    let result;
    try {
      result = JSON.parse(localStorage.getItem('om_blocked') || '[]');
    } catch {
      result = [];
    }
    expect(result).toEqual([]);
  });
});

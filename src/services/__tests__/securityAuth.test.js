import { describe, it, expect, beforeEach } from 'vitest';
import { getAuthHeaders } from '../apiClient';

describe('Frontend API Security & JWT Header Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns plain JSON headers when no user session is present', () => {
    const headers = getAuthHeaders();
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('attaches Bearer JWT token when authenticated user session exists in localStorage', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWFyanVuIn0.signature';
    localStorage.setItem('apnavaidya_auth_user', JSON.stringify({
      user: { id: 'user-arjun', name: 'Arjun Sharma' },
      token: fakeToken
    }));

    const headers = getAuthHeaders();
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Authorization']).toBe(`Bearer ${fakeToken}`);
  });
});

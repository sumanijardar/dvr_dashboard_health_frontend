import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, buildApiUrl } from '../config/apiConfig';

const AuthContext = createContext(null);

// Use sessionStorage so the session is isolated strictly to the current tab.
// Opening another tab or new browser window will NOT share credentials and will require login.
const TOKEN_KEY = 'sentinel_auth_token';
const USER_KEY = 'sentinel_auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Clean up any old localStorage tokens from previous sessions to prevent cross-tab leaks
  useEffect(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Verify stored session token on initial tab load
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken('');
          setIsLoading(false);
        }
        return;
      }

      try {
        const url = buildApiUrl(API_ENDPOINTS.AUTH_VERIFY);
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Accept': 'application/json'
          }
        });
        const data = await res.json();

        if (isMounted) {
          if (data.Code === 200 && data.data?.user) {
            setUser(data.data.user);
            setToken(storedToken);
            sessionStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
          } else {
            // Token expired or invalid
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            setUser(null);
            setToken('');
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Verification failed:', err);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        if (isMounted) {
          setUser(null);
          setToken('');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  // Login handler
  const login = useCallback(async (username, password) => {
    const url = buildApiUrl(API_ENDPOINTS.AUTH_LOGIN);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.Code === 200 && data.data) {
      const newToken = data.data.token;
      const newUser = data.data.user;

      // Save strictly to this tab's sessionStorage
      sessionStorage.setItem(TOKEN_KEY, newToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } else {
      throw new Error(data.message || 'Invalid username or password.');
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    const currentToken = sessionStorage.getItem(TOKEN_KEY);
    if (currentToken) {
      try {
        const url = buildApiUrl(API_ENDPOINTS.AUTH_LOGOUT);
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'application/json'
          }
        });
      } catch (e) {
        console.warn('[AuthContext] Remote logout notification failed:', e);
      }
    }

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

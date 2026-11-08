import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  setIsAdmin: (val: boolean) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  setIsAdmin: () => {},
  logoutAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdminState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin-session', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : { authenticated: false })
      .then((data) => setIsAdminState(Boolean(data.authenticated)))
      .catch(() => setIsAdminState(false))
      .finally(() => setLoading(false));
  }, []);

  const setIsAdmin = (value: boolean) => setIsAdminState(value);

  const logoutAdmin = () => {
    setIsAdminState(false);
    void fetch('/api/admin-logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        loading,
        setIsAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

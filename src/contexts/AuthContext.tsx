import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminPin: string;
  setAdminPin: (pin: string) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  setIsAdmin: () => {},
  adminPin: '',
  setAdminPin: () => {},
  logoutAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('master_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(true);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(true);
        localStorage.setItem('master_admin_auth', 'true');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('master_admin_auth');
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        setIsAdmin: (val: boolean) => {
          setIsAdmin(val);
          if (val) localStorage.setItem('master_admin_auth', 'true');
          else localStorage.removeItem('master_admin_auth');
        },
        adminPin,
        setAdminPin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

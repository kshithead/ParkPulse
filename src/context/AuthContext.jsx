import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_ADMIN } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_current_user');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_registered_users');
      return stored ? JSON.parse(stored) : [
        { ...INITIAL_USER, email: 'alex@campus.edu', password: 'password123' },
        { ...INITIAL_ADMIN, email: 'admin@parkpulse.edu', password: 'admin123' }
      ];
    } catch {
      return [
        { ...INITIAL_USER, email: 'alex@campus.edu', password: 'password123' },
        { ...INITIAL_ADMIN, email: 'admin@parkpulse.edu', password: 'admin123' }
      ];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('parkpulse_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('parkpulse_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('parkpulse_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  /**
   * Login with email and password for a specified portal role
   */
  const login = (email, password, role = 'user') => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Look up in registered users
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === role
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }

    // Default driver or admin check
    if (role === 'admin') {
      if (cleanEmail === 'admin@parkpulse.edu' || cleanEmail.includes('admin')) {
        const adminUser = { ...INITIAL_ADMIN, email: cleanEmail };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
    } else {
      if (cleanEmail === 'alex@campus.edu' || cleanEmail.includes('alex') || cleanEmail.includes('student')) {
        const driverUser = { ...INITIAL_USER, email: cleanEmail };
        setCurrentUser(driverUser);
        return { success: true, user: driverUser };
      }
    }

    // Fallback: create account for the entered email with chosen role
    const newUser = role === 'admin'
      ? {
          id: 'usr_admin_' + Date.now(),
          name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: cleanEmail,
          role: 'admin',
          badgeId: 'PP-OFFICER-' + Math.floor(100 + Math.random() * 900),
          department: 'Campus Security',
          phone: '+91 98450 00000',
          joinedDate: 'Nov 2026'
        }
      : {
          id: 'usr_driver_' + Date.now(),
          name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: cleanEmail,
          role: 'user',
          vehicleNumber: 'KA-05-AB-1234',
          vehicleModel: 'Campus Registered Vehicle',
          phone: '+91 98765 00000',
          joinedDate: 'Nov 2026'
        };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const register = ({ name, email, vehicleNumber, vehicleModel, phone }) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      role: 'user', // Registrations are always driver accounts
      vehicleNumber: vehicleNumber ? vehicleNumber.toUpperCase() : 'KA-01-EXP-99',
      vehicleModel: vehicleModel || 'Campus Registered Vehicle',
      phone: phone || '+91 98765 00000',
      joinedDate: 'Nov 2026'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      setRegisteredUsers((all) =>
        all.map((u) => (u.id === updated.id ? updated : u))
      );
      return updated;
    });
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isDriver: currentUser?.role === 'user',
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

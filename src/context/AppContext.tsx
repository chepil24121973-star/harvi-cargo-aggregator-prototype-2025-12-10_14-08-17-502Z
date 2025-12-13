import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Application, LogisticsCompany } from '../types';
import { mockApplications, mockLogisticsCompanies } from '../data/mockData';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationById: (id: string) => Application | undefined;
  logisticsCompanies: LogisticsCompany[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [logisticsCompanies] = useState<LogisticsCompany[]>(mockLogisticsCompanies);

  const login = (email: string) => {
    setUser({
      id: '1',
      email,
      name: 'Иван Петров',
      phone: '+7 999 123-45-67',
      telegram: '@ivan_petrov',
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addApplication = (app: Application) => {
    setApplications([...applications, app]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const getApplicationById = (id: string) => {
    return applications.find((app) => app.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        applications,
        addApplication,
        updateApplication,
        getApplicationById,
        logisticsCompanies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

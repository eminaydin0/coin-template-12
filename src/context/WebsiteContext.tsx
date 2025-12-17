import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getWebsiteInfo } from '../services/api';

interface WebsiteInfo {
  key: string;
  value: string;
}

interface BankAccount {
  name: string;
  iban: string;
}

interface HeroItem {
  short1: string;
  short2: string;
  short3: string;
  slogan: string;
  url: string;
}

interface Contract {
  id: string;
  name: string;
  slug: string;
  content?: string;
}

interface WebsiteData {
  domain: string;
  websiteInfos: WebsiteInfo[];
  bankAccounts: BankAccount[];
  contracts: Contract[];
}

interface WebsiteContextType {
  websiteData: WebsiteData | null;
  loading: boolean;
  error: string | null;
  getInfoValue: (key: string) => string;
  getHeroList: () => HeroItem[];
  refreshData: () => void;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

interface WebsiteProviderProps {
  children: ReactNode;
}

export const WebsiteProvider: React.FC<WebsiteProviderProps> = ({ children }) => {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        const data = await getWebsiteInfo();
        setWebsiteData(data);
      } catch (err) {
        console.error('Website data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, []);

  const getInfoValue = (key: string): string => {
    if (!websiteData?.websiteInfos) return '';
    const info = websiteData.websiteInfos.find(item => item.key === key);
    return info?.value || '';
  };

  const getHeroList = (): HeroItem[] => {
    try {
      const heroListValue = getInfoValue('HERO_LIST');
      if (!heroListValue) return [];
      
      const parsed = JSON.parse(heroListValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Hero list parse error:', err);
      return [];
    }
  };

  const refreshData = () => {
    fetchWebsiteData();
  };

  const value: WebsiteContextType = {
    websiteData,
    loading,
    error,
    getInfoValue,
    getHeroList,
    refreshData
  };

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  );
};






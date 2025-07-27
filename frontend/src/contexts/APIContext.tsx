import React, { createContext, useContext, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';

interface APIContextType {
  api: AxiosInstance;
  getStrategyStatus: () => Promise<any>;
  getDecisions: () => Promise<any>;
  sendChatMessage: (message: string, context?: any) => Promise<any>;
  evaluateStrategy: () => Promise<any>;
  emergencyStop: () => Promise<any>;
}

const APIContext = createContext<APIContextType | undefined>(undefined);

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const APIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getStrategyStatus = async () => {
    try {
      const response = await api.get('/strategy/status');
      return response.data;
    } catch (error) {
      console.error('Error getting strategy status:', error);
      throw error;
    }
  };

  const getDecisions = async () => {
    try {
      const response = await api.get('/decisions');
      return response.data;
    } catch (error) {
      console.error('Error getting decisions:', error);
      throw error;
    }
  };

  const sendChatMessage = async (message: string, context?: any) => {
    try {
      const response = await api.post('/chat', { message, context });
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  };

  const evaluateStrategy = async () => {
    try {
      const response = await api.post('/strategy/evaluate');
      return response.data;
    } catch (error) {
      console.error('Error evaluating strategy:', error);
      throw error;
    }
  };

  const emergencyStop = async () => {
    try {
      const response = await api.post('/emergency/stop');
      return response.data;
    } catch (error) {
      console.error('Error activating emergency stop:', error);
      throw error;
    }
  };

  const value: APIContextType = {
    api,
    getStrategyStatus,
    getDecisions,
    sendChatMessage,
    evaluateStrategy,
    emergencyStop,
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export const useAPI = (): APIContextType => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
};

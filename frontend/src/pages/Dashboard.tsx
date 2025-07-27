import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAPI } from '../contexts/APIContext';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon,
  PlayIcon,
  StopIcon 
} from '@heroicons/react/24/outline';

interface StrategyStatus {
  isActive: boolean;
  lastEvaluation: number;
  totalDecisions: number;
  successRate: number;
  portfolioHealth: any;
  riskMetrics: any;
}

const Dashboard: React.FC = () => {
  const { getStrategyStatus, evaluateStrategy, emergencyStop } = useAPI();
  const [isEvaluating, setIsEvaluating] = useState(false);

  const { data: status, isLoading, error, refetch } = useQuery<StrategyStatus>(
    'strategyStatus',
    getStrategyStatus,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 3,
    }
  );

  const handleEvaluateStrategy = async () => {
    setIsEvaluating(true);
    try {
      await evaluateStrategy();
      toast.success('Strategy evaluation triggered successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to evaluate strategy');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEmergencyStop = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to activate emergency stop? This will halt all autonomous trading.'
    );
    
    if (confirmed) {
      try {
        await emergencyStop();
        toast.success('Emergency stop activated');
        refetch();
      } catch (error) {
        toast.error('Failed to activate emergency stop');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading ChainMind...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error loading dashboard</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ChainMind Dashboard</h1>
        <p className="text-gray-400">Autonomous AI-Powered DeFi Strategy Management</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI Status</p>
              <p className={`text-lg font-semibold ${status?.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {status?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <ShieldCheckIcon className={`w-8 h-8 ${status?.isActive ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Decisions</p>
              <p className="text-lg font-semibold text-white">{status?.totalDecisions || 0}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-lg font-semibold text-white">{status?.successRate?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Portfolio Health</p>
              <p className="text-lg font-semibold text-white">
                {status?.portfolioHealth?.riskScore || 'Unknown'}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Strategy Controls</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleEvaluateStrategy}
            disabled={isEvaluating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            <PlayIcon className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Strategy'}</span>
          </button>
          
          <button
            onClick={handleEmergencyStop}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <StopIcon className="w-4 h-4" />
            <span>Emergency Stop</span>
          </button>
        </div>
      </div>

      {/* Portfolio Health */}
      {status?.portfolioHealth && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Diversification Score</p>
              <p className="text-2xl font-bold text-blue-500">
                {status.portfolioHealth.diversificationScore || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Liquidity Score</p>
              <p className="text-2xl font-bold text-green-500">
                {status.portfolioHealth.liquidityScore || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-purple-500">
                {status.portfolioHealth.totalValue || '$0'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Metrics */}
      {status?.riskMetrics && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Risk Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Sharpe Ratio</p>
              <p className="text-lg font-semibold">{status.riskMetrics.sharpeRatio || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Max Drawdown</p>
              <p className="text-lg font-semibold">
                {status.riskMetrics.maxDrawdown ? `${(status.riskMetrics.maxDrawdown * 100).toFixed(2)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Volatility</p>
              <p className="text-lg font-semibold">
                {status.riskMetrics.volatility ? `${(status.riskMetrics.volatility * 100).toFixed(2)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">VaR (95%)</p>
              <p className="text-lg font-semibold">
                {status.riskMetrics.var95 ? `${(status.riskMetrics.var95 * 100).toFixed(2)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Last Update */}
      <div className="mt-8 text-center text-sm text-gray-400">
        Last updated: {status?.lastEvaluation ? new Date(status.lastEvaluation).toLocaleString() : 'Never'}
      </div>
    </div>
  );
};

export default Dashboard;

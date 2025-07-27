import React, { useState } from 'react';
import { 
  CogIcon,
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'yield' | 'arbitrage' | 'lending' | 'liquidity';
  status: 'active' | 'paused' | 'stopped';
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  lastExecution: Date;
  totalProfit: number;
  successRate: number;
}

const Strategies: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'ETH Staking Optimizer',
      description: 'Automatically stakes ETH across Lido, Rocket Pool, and other validators for optimal returns',
      type: 'yield',
      status: 'active',
      apy: 5.4,
      tvl: 20384.50,
      risk: 'low',
      lastExecution: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalProfit: 892.34,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Stablecoin Yield Maximizer',
      description: 'Rotates USDC/USDT between Compound, AAVE, and Curve for highest yield',
      type: 'yield',
      status: 'active',
      apy: 8.3,
      tvl: 8920.30,
      risk: 'low',
      lastExecution: new Date(Date.now() - 30 * 60 * 1000),
      totalProfit: 445.67,
      successRate: 99.2
    },
    {
      id: '3',
      name: 'DEX Arbitrage Bot',
      description: 'Exploits price differences between Uniswap, SushiSwap, and 1inch',
      type: 'arbitrage',
      status: 'active',
      apy: 12.7,
      tvl: 4680.00,
      risk: 'medium',
      lastExecution: new Date(Date.now() - 5 * 60 * 1000),
      totalProfit: 234.89,
      successRate: 85.3
    },
    {
      id: '4',
      name: 'Flash Loan Liquidator',
      description: 'Identifies and executes profitable liquidations across lending protocols',
      type: 'arbitrage',
      status: 'paused',
      apy: 18.9,
      tvl: 1120.74,
      risk: 'high',
      lastExecution: new Date(Date.now() - 4 * 60 * 60 * 1000),
      totalProfit: 156.23,
      successRate: 76.8
    },
    {
      id: '5',
      name: 'Cross-Chain Bridge Optimizer',
      description: 'Optimizes asset transfers between Ethereum, Polygon, and Arbitrum',
      type: 'arbitrage',
      status: 'stopped',
      apy: 6.2,
      tvl: 0,
      risk: 'medium',
      lastExecution: new Date(Date.now() - 24 * 60 * 60 * 1000),
      totalProfit: 89.12,
      successRate: 91.4
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id 
        ? { ...strategy, status: strategy.status === 'active' ? 'paused' : 'active' }
        : strategy
    ));
  };

  const deleteStrategy = (id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/20';
      case 'paused': return 'text-yellow-500 bg-yellow-500/20';
      case 'stopped': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'yield': return '🌾';
      case 'arbitrage': return '⚡';
      case 'lending': return '🏦';
      case 'liquidity': return '💧';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">DeFi Strategies</h1>
            <p className="text-gray-400">Manage your automated trading strategies</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Strategy</span>
          </button>
        </div>

        {/* Strategy Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <CogIcon className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Active Strategies</p>
                <p className="text-2xl font-bold">{strategies.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Total TVL</p>
                <p className="text-2xl font-bold">${strategies.reduce((sum, s) => sum + s.tvl, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold">${strategies.reduce((sum, s) => sum + s.totalProfit, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <CheckIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {(strategies.reduce((sum, s) => sum + s.successRate, 0) / strategies.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              {/* Strategy Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(strategy.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{strategy.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                        {strategy.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStrategy(strategy.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        strategy.status === 'active' 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {strategy.status === 'active' ? 
                        <PauseIcon className="w-4 h-4" /> : 
                        <PlayIcon className="w-4 h-4" />
                      }
                    </button>
                    <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteStrategy(strategy.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{strategy.description}</p>
              </div>

              {/* Strategy Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">APY</p>
                    <p className="text-xl font-bold text-green-400">{strategy.apy}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">TVL</p>
                    <p className="text-xl font-bold">${strategy.tvl.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Risk Level</p>
                    <p className={`font-semibold capitalize ${getRiskColor(strategy.risk)}`}>
                      {strategy.risk}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="font-semibold">{strategy.successRate}%</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Profit:</span>
                    <span className="font-semibold text-green-400">+${strategy.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Last Execution:</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>{strategy.lastExecution.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Strategy Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Strategy</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Strategy Templates */}
                <div className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🌾</span>
                    <h3 className="font-semibold">Yield Farming</h3>
                  </div>
                  <p className="text-sm text-gray-400">Automatically optimize yield across lending protocols</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">⚡</span>
                    <h3 className="font-semibold">Arbitrage Bot</h3>
                  </div>
                  <p className="text-sm text-gray-400">Exploit price differences across DEXs</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🏦</span>
                    <h3 className="font-semibold">Lending Strategy</h3>
                  </div>
                  <p className="text-sm text-gray-400">Optimize lending rates across protocols</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">💧</span>
                    <h3 className="font-semibold">Liquidity Mining</h3>
                  </div>
                  <p className="text-sm text-gray-400">Provide liquidity for maximum rewards</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Create Strategy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Strategies;

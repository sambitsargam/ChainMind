import React, { useState } from 'react';
import { 
  BeakerIcon,
  PlayIcon,
  ChartBarIcon,
  CogIcon,
  PauseIcon,
  BookmarkIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Strategy {
  id: string;
  name: string;
  type: 'custom' | 'template' | 'ai-generated';
  status: 'draft' | 'testing' | 'running' | 'paused' | 'completed';
  description: string;
  protocols: string[];
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedAPY: number;
  backtestScore: number;
  createdAt: Date;
  author?: string;
}

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  avgTrade: number;
  totalTrades: number;
  volatility: number;
  startDate: Date;
  endDate: Date;
}

const DeFiLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'strategies' | 'backtest' | 'templates' | 'ai-builder'>('strategies');
  const [isBacktesting, setIsBacktesting] = useState(false);

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'DCA + Yield Optimizer',
      type: 'custom',
      status: 'running',
      description: 'Dollar-cost averaging with automatic yield farming optimization across multiple protocols',
      protocols: ['AAVE', 'Compound', 'Curve'],
      timeframe: '1 week',
      riskLevel: 'low',
      estimatedAPY: 12.5,
      backtestScore: 8.7,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: 'You'
    },
    {
      id: '2',
      name: 'Impermanent Loss Hedge',
      type: 'template',
      status: 'testing',
      description: 'Hedges impermanent loss in LP positions using perpetual futures',
      protocols: ['Uniswap V3', 'dYdX', 'GMX'],
      timeframe: '1 day',
      riskLevel: 'medium',
      estimatedAPY: 18.3,
      backtestScore: 7.9,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'MEV Protection Layer',
      type: 'ai-generated',
      status: 'draft',
      description: 'AI-powered MEV protection with automated front-running detection',
      protocols: ['Flashbots', 'CowSwap', '1inch'],
      timeframe: 'Real-time',
      riskLevel: 'high',
      estimatedAPY: 25.8,
      backtestScore: 9.2,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: 'ChainMind AI'
    },
    {
      id: '4',
      name: 'Cross-Chain Arbitrage',
      type: 'custom',
      status: 'paused',
      description: 'Automated arbitrage opportunities across different blockchain networks',
      protocols: ['Polygon', 'Arbitrum', 'Optimism'],
      timeframe: '15 minutes',
      riskLevel: 'medium',
      estimatedAPY: 15.7,
      backtestScore: 8.1,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      author: 'You'
    }
  ];

  const backtestResults: BacktestResult = {
    totalReturn: 34.7,
    sharpeRatio: 2.1,
    maxDrawdown: -8.3,
    winRate: 68.5,
    avgTrade: 1.2,
    totalTrades: 247,
    volatility: 16.4,
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  };

  const templates = [
    {
      id: '1',
      name: 'Conservative DeFi',
      description: 'Low-risk strategy focusing on stable yields',
      protocols: ['AAVE', 'Compound'],
      estimatedAPY: 8.5,
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Yield Farming Maximizer',
      description: 'High-yield farming with automated compounding',
      protocols: ['Curve', 'Convex', 'Yearn'],
      estimatedAPY: 22.3,
      riskLevel: 'medium'
    },
    {
      id: '3',
      name: 'Liquidity Mining Pro',
      description: 'Advanced LP strategies with IL protection',
      protocols: ['Uniswap V3', 'Balancer', 'SushiSwap'],
      estimatedAPY: 28.7,
      riskLevel: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500 bg-green-500/20';
      case 'testing': return 'text-blue-500 bg-blue-500/20';
      case 'paused': return 'text-yellow-500 bg-yellow-500/20';
      case 'draft': return 'text-gray-500 bg-gray-500/20';
      case 'completed': return 'text-purple-500 bg-purple-500/20';
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
      case 'custom': return '🔧';
      case 'template': return '📋';
      case 'ai-generated': return '🤖';
      default: return '💡';
    }
  };

  const runBacktest = () => {
    setIsBacktesting(true);
    setTimeout(() => {
      setIsBacktesting(false);
    }, 5000);
  };

  const deployStrategy = (strategyId: string) => {
    console.log(`Deploying strategy: ${strategyId}`);
  };

  const pauseStrategy = (strategyId: string) => {
    console.log(`Pausing strategy: ${strategyId}`);
  };

  const tabs = [
    { key: 'strategies', name: 'My Strategies', icon: BeakerIcon },
    { key: 'backtest', name: 'Backtest Lab', icon: ChartBarIcon },
    { key: 'templates', name: 'Templates', icon: DocumentTextIcon },
    { key: 'ai-builder', name: 'AI Builder', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">DeFi Lab</h1>
            <p className="text-gray-400">Build, test, and deploy advanced DeFi strategies</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
            + Create New Strategy
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(strategy.type)}</span>
                      <div>
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <p className="text-sm text-gray-400">{strategy.author || 'Community'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                      {strategy.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">{strategy.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Est. APY</p>
                      <p className="font-semibold text-green-400">{strategy.estimatedAPY}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Risk Level</p>
                      <p className={`font-semibold capitalize ${getRiskColor(strategy.riskLevel)}`}>
                        {strategy.riskLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Timeframe</p>
                      <p className="font-semibold">{strategy.timeframe}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Score</p>
                      <p className="font-semibold">{strategy.backtestScore}/10</p>
                    </div>
                  </div>

                  {/* Protocols */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Protocols:</p>
                    <div className="flex flex-wrap gap-2">
                      {strategy.protocols.map((protocol, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 rounded text-xs">
                          {protocol}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {strategy.status === 'draft' && (
                      <button
                        onClick={() => deployStrategy(strategy.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <PlayIcon className="w-4 h-4" />
                        <span>Deploy</span>
                      </button>
                    )}
                    {strategy.status === 'running' && (
                      <button
                        onClick={() => pauseStrategy(strategy.id)}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <PauseIcon className="w-4 h-4" />
                        <span>Pause</span>
                      </button>
                    )}
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backtest Lab Tab */}
        {activeTab === 'backtest' && (
          <div className="space-y-6">
            {/* Backtest Controls */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-6">Backtest Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Strategy</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
                    <option>DCA + Yield Optimizer</option>
                    <option>Impermanent Loss Hedge</option>
                    <option>MEV Protection Layer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Time Period</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last 1 year</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Initial Capital</label>
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={runBacktest}
                  disabled={isBacktesting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  <span>{isBacktesting ? 'Running Backtest...' : 'Run Backtest'}</span>
                </button>
              </div>
            </div>

            {/* Backtest Results */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-6">Latest Backtest Results</h2>
              
              {/* Performance Chart Placeholder */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Performance chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Interactive chart showing strategy performance over time</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Return</p>
                  <p className="text-2xl font-bold text-green-400">+{backtestResults.totalReturn}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{backtestResults.sharpeRatio}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-400">{backtestResults.maxDrawdown}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-2xl font-bold">{backtestResults.winRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Avg Trade</p>
                  <p className="text-2xl font-bold text-green-400">+{backtestResults.avgTrade}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Trades</p>
                  <p className="text-2xl font-bold">{backtestResults.totalTrades}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Volatility</p>
                  <p className="text-2xl font-bold">{backtestResults.volatility}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-2xl font-bold">90 days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-300">{template.description}</p>
                    </div>
                    <BookmarkIcon className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Est. APY:</span>
                      <span className="text-sm font-semibold text-green-400">{template.estimatedAPY}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Risk Level:</span>
                      <span className={`text-sm font-semibold capitalize ${getRiskColor(template.riskLevel)}`}>
                        {template.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Protocols:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.protocols.map((protocol, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 rounded text-xs">
                          {protocol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Builder Tab */}
        {activeTab === 'ai-builder' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-6">🤖 AI Strategy Builder</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Describe your investment goal</label>
                  <textarea
                    placeholder="E.g., I want to earn 15% APY with medium risk, focusing on stablecoin strategies..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Risk Tolerance</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
                      <option>Conservative (Low risk)</option>
                      <option>Balanced (Medium risk)</option>
                      <option>Aggressive (High risk)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Time Horizon</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
                      <option>Short-term (1-3 months)</option>
                      <option>Medium-term (3-12 months)</option>
                      <option>Long-term (1+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Investment Amount</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Preferred Protocols (optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['AAVE', 'Compound', 'Uniswap', 'Curve', 'Balancer', 'Yearn', 'Convex', 'SushiSwap'].map(protocol => (
                      <label key={protocol} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{protocol}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span>Generate AI Strategy</span>
                </button>
              </div>
            </div>

            {/* AI Generated Strategy Preview */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4">🤖 AI-Generated Strategy Preview</h3>
              <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-purple-500">
                <h4 className="font-semibold mb-2">Optimized Yield Farming Strategy</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Based on your preferences, I've created a diversified strategy that allocates 60% to stablecoin farming
                  on Curve and Convex, 30% to blue-chip LP positions on Uniswap V3, and 10% to leveraged AAVE positions.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Expected APY</p>
                    <p className="font-semibold text-green-400">16.8%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Risk Score</p>
                    <p className="font-semibold text-yellow-400">6/10</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Protocols</p>
                    <p className="font-semibold">5 protocols</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                    Accept Strategy
                  </button>
                  <button className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded text-sm font-medium transition-colors">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeFiLab;

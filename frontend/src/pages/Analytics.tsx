import React, { useState } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  avgTradeReturn: number;
  volatility: number;
}

interface PerformanceData {
  date: string;
  value: number;
  return: number;
}

const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('portfolio');

  const analyticsData: AnalyticsData = {
    totalReturn: 8420.50,
    totalReturnPercent: 22.8,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
    winRate: 73.5,
    totalTrades: 247,
    avgTradeReturn: 2.1,
    volatility: 15.6
  };

  const performanceData: PerformanceData[] = [
    { date: '2025-01-01', value: 37000, return: 0 },
    { date: '2025-01-08', value: 38200, return: 3.2 },
    { date: '2025-01-15', value: 39800, return: 7.6 },
    { date: '2025-01-22', value: 41200, return: 11.4 },
    { date: '2025-01-29', value: 42600, return: 15.1 },
    { date: '2025-02-05', value: 44100, return: 19.2 },
    { date: '2025-02-12', value: 45400, return: 22.7 },
    { date: '2025-02-19', value: 44800, return: 21.1 },
    { date: '2025-02-26', value: 46200, return: 24.9 },
    { date: '2025-03-05', value: 45800, return: 23.8 },
    { date: '2025-03-12', value: 47100, return: 27.3 },
    { date: '2025-03-19', value: 45400, return: 22.7 },
    { date: '2025-03-26', value: 45420, return: 22.8 }
  ];

  const timeframes = ['7d', '30d', '90d', '1y', 'all'];
  const metrics = [
    { key: 'portfolio', name: 'Portfolio Value', icon: ChartBarIcon },
    { key: 'returns', name: 'Returns', icon: ArrowTrendingUpIcon },
    { key: 'allocation', name: 'Allocation', icon: ChartPieIcon },
    { key: 'yield', name: 'Yield', icon: CurrencyDollarIcon }
  ];

  const protocolAnalytics = [
    { name: 'Uniswap V3', allocation: 28.5, pnl: 1240.50, apy: 12.7, risk: 'medium' },
    { name: 'Compound', allocation: 22.3, pnl: 890.30, apy: 8.3, risk: 'low' },
    { name: 'AAVE', allocation: 18.7, pnl: 650.80, apy: 6.9, risk: 'low' },
    { name: 'Curve Finance', allocation: 15.2, pnl: 420.60, apy: 15.2, risk: 'medium' },
    { name: 'Yearn Finance', allocation: 10.1, pnl: 310.20, apy: 18.4, risk: 'high' },
    { name: 'Lido', allocation: 5.2, pnl: 180.90, apy: 5.4, risk: 'low' }
  ];

  const topPerformers = [
    { asset: 'ETH', return: 28.5, volume: '$20,384' },
    { asset: 'UNI', return: 15.7, volume: '$4,680' },
    { asset: 'LINK', return: 12.3, volume: '$2,890' },
    { asset: 'WBTC', return: 8.9, volume: '$7,234' },
    { asset: 'MATIC', return: -2.1, volume: '$1,120' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Analytics</h1>
          <p className="text-gray-400">Deep insights into your DeFi performance</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          {/* Timeframe Selector */}
          <div className="flex space-x-2 mb-4 sm:mb-0">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex space-x-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <metric.icon className="w-4 h-4" />
                <span>{metric.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Total Return</span>
            </div>
            <p className="text-2xl font-bold text-green-400">+${analyticsData.totalReturn.toLocaleString()}</p>
            <p className="text-sm text-green-400">+{analyticsData.totalReturnPercent}%</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Sharpe Ratio</span>
            </div>
            <p className="text-xl font-bold">{analyticsData.sharpeRatio}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Max Drawdown</span>
            </div>
            <p className="text-xl font-bold text-red-400">{analyticsData.maxDrawdown}%</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Win Rate</span>
            </div>
            <p className="text-xl font-bold text-green-400">{analyticsData.winRate}%</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Total Trades</span>
            </div>
            <p className="text-xl font-bold">{analyticsData.totalTrades}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Avg Return</span>
            </div>
            <p className="text-xl font-bold text-blue-400">{analyticsData.avgTradeReturn}%</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Volatility</span>
            </div>
            <p className="text-xl font-bold text-yellow-400">{analyticsData.volatility}%</p>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Performance Chart</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-80 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Interactive performance chart</p>
              <p className="text-sm text-gray-500">Portfolio value over time with trend analysis</p>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Protocol Performance */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-4">Protocol Performance</h3>
            <div className="space-y-4">
              {protocolAnalytics.map((protocol, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {protocol.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{protocol.name}</p>
                      <p className="text-sm text-gray-400">{protocol.allocation}% allocation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">+${protocol.pnl.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{protocol.apy}% APY</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {performer.asset}
                    </div>
                    <div>
                      <p className="font-semibold">{performer.asset}</p>
                      <p className="text-sm text-gray-400">{performer.volume}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {performer.return >= 0 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`font-semibold ${
                      performer.return >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {performer.return >= 0 ? '+' : ''}{performer.return}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-semibold mb-4">Risk Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold">72</span>
              </div>
              <h4 className="font-semibold">Risk Score</h4>
              <p className="text-sm text-gray-400">Moderate risk level</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold">85</span>
              </div>
              <h4 className="font-semibold">Diversification</h4>
              <p className="text-sm text-gray-400">Well diversified</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold">91</span>
              </div>
              <h4 className="font-semibold">Liquidity</h4>
              <p className="text-sm text-gray-400">High liquidity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

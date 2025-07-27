import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface YieldOpportunity {
  id: string;
  protocol: string;
  pool: string;
  tokens: string[];
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  type: 'lending' | 'liquidity' | 'staking';
  lockPeriod?: number;
  rewards: string[];
  impermanentLoss?: number;
}

interface Position {
  id: string;
  protocol: string;
  pool: string;
  amount: number;
  value: number;
  apy: number;
  earned: number;
  startDate: Date;
}

const YieldFarming: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('apy');

  const yieldOpportunities: YieldOpportunity[] = [
    {
      id: '1',
      protocol: 'Curve Finance',
      pool: '3Pool',
      tokens: ['USDC', 'USDT', 'DAI'],
      apy: 18.4,
      tvl: 1250000000,
      risk: 'low',
      type: 'liquidity',
      rewards: ['CRV', 'CVX'],
      impermanentLoss: 0.2
    },
    {
      id: '2',
      protocol: 'Convex Finance',
      pool: 'cvxCRV',
      tokens: ['CRV'],
      apy: 16.7,
      tvl: 450000000,
      risk: 'medium',
      type: 'staking',
      rewards: ['CVX', 'CRV'],
      lockPeriod: 16
    },
    {
      id: '3',
      protocol: 'Yearn Finance',
      pool: 'USDC Vault',
      tokens: ['USDC'],
      apy: 15.2,
      tvl: 89000000,
      risk: 'low',
      type: 'lending',
      rewards: ['YFI']
    },
    {
      id: '4',
      protocol: 'Uniswap V3',
      pool: 'ETH/USDC 0.05%',
      tokens: ['ETH', 'USDC'],
      apy: 12.7,
      tvl: 234000000,
      risk: 'medium',
      type: 'liquidity',
      rewards: ['UNI'],
      impermanentLoss: 3.8
    },
    {
      id: '5',
      protocol: 'Compound',
      pool: 'cUSDC',
      tokens: ['USDC'],
      apy: 8.3,
      tvl: 1800000000,
      risk: 'low',
      type: 'lending',
      rewards: ['COMP']
    },
    {
      id: '6',
      protocol: 'AAVE',
      pool: 'aETH',
      tokens: ['ETH'],
      apy: 6.9,
      tvl: 678000000,
      risk: 'low',
      type: 'lending',
      rewards: ['AAVE']
    },
    {
      id: '7',
      protocol: 'Lido',
      pool: 'stETH',
      tokens: ['ETH'],
      apy: 5.4,
      tvl: 9800000000,
      risk: 'low',
      type: 'staking',
      rewards: ['LDO']
    }
  ];

  const positions: Position[] = [
    {
      id: '1',
      protocol: 'Curve Finance',
      pool: '3Pool',
      amount: 8920.30,
      value: 8965.45,
      apy: 18.4,
      earned: 156.23,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      protocol: 'Uniswap V3',
      pool: 'ETH/USDC',
      amount: 4680.00,
      value: 4758.90,
      apy: 12.7,
      earned: 78.90,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      protocol: 'Lido',
      pool: 'stETH',
      amount: 12.5,
      value: 20384.50,
      apy: 5.4,
      earned: 234.67,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    }
  ];

  const categories = [
    { key: 'all', name: 'All Opportunities' },
    { key: 'lending', name: 'Lending' },
    { key: 'liquidity', name: 'Liquidity Mining' },
    { key: 'staking', name: 'Staking' }
  ];

  const sortOptions = [
    { key: 'apy', name: 'APY (High to Low)' },
    { key: 'tvl', name: 'TVL (High to Low)' },
    { key: 'risk', name: 'Risk (Low to High)' }
  ];

  const filteredOpportunities = yieldOpportunities
    .filter(opp => selectedCategory === 'all' || opp.type === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'apy': return b.apy - a.apy;
        case 'tvl': return b.tvl - a.tvl;
        case 'risk': 
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        default: return 0;
      }
    });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <ShieldCheckIcon className="w-4 h-4" />;
      case 'medium': case 'high': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ShieldCheckIcon className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lending': return '🏦';
      case 'liquidity': return '💧';
      case 'staking': return '🥩';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yield Farming</h1>
          <p className="text-gray-400">Maximize your DeFi yields across protocols</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold">${positions.reduce((sum, p) => sum + p.value, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">+${positions.reduce((sum, p) => sum + p.earned, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Avg APY</p>
                <p className="text-2xl font-bold">
                  {(positions.reduce((sum, p) => sum + p.apy * p.value, 0) / positions.reduce((sum, p) => sum + p.value, 0)).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Positions */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Positions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-400 text-sm">
                <tr>
                  <th className="pb-3">Protocol</th>
                  <th className="pb-3">Pool</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Current Value</th>
                  <th className="pb-3">APY</th>
                  <th className="pb-3">Earned</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const daysSince = Math.floor((Date.now() - position.startDate.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={position.id} className="border-t border-slate-700">
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {position.protocol.slice(0, 2)}
                          </div>
                          <span className="font-medium">{position.protocol}</span>
                        </div>
                      </td>
                      <td className="py-4">{position.pool}</td>
                      <td className="py-4">${position.amount.toLocaleString()}</td>
                      <td className="py-4">${position.value.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="text-green-400 font-medium">{position.apy}%</span>
                      </td>
                      <td className="py-4">
                        <span className="text-green-400 font-medium">+${position.earned.toLocaleString()}</span>
                      </td>
                      <td className="py-4">{daysSince} days</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yield Opportunities */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Yield Opportunities</h2>
            <div className="flex space-x-4">
              {/* Category Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.name}</option>
                ))}
              </select>
              
              {/* Sort Options */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.key} value={option.key}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-slate-700 rounded-lg border border-slate-600 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getTypeIcon(opportunity.type)}</span>
                    <div>
                      <h3 className="font-semibold">{opportunity.protocol}</h3>
                      <p className="text-sm text-gray-400">{opportunity.pool}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getRiskColor(opportunity.risk)}`}>
                    {getRiskIcon(opportunity.risk)}
                    <span className="text-sm capitalize">{opportunity.risk}</span>
                  </div>
                </div>

                {/* Tokens */}
                <div className="flex space-x-2 mb-4">
                  {opportunity.tokens.map((token, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-600 rounded text-xs font-medium">
                      {token}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">APY</p>
                    <p className="text-xl font-bold text-green-400">{opportunity.apy}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">TVL</p>
                    <p className="text-lg font-semibold">
                      ${(opportunity.tvl / 1000000).toFixed(0)}M
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4 text-sm">
                  {opportunity.lockPeriod && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period:</span>
                      <span>{opportunity.lockPeriod} weeks</span>
                    </div>
                  )}
                  {opportunity.impermanentLoss !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">IL Risk:</span>
                      <span className="text-yellow-400">{opportunity.impermanentLoss}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rewards:</span>
                    <span>{opportunity.rewards.join(', ')}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors font-medium">
                  Enter Position
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldFarming;

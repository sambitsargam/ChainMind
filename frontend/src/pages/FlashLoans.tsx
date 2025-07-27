import React, { useState } from 'react';
import { 
  BoltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface FlashLoanOpportunity {
  id: string;
  type: 'arbitrage' | 'liquidation' | 'refinancing';
  profit: number;
  capital: number;
  duration: number;
  risk: 'low' | 'medium' | 'high';
  protocols: string[];
  gasEstimate: number;
  success_rate: number;
  description: string;
}

interface FlashLoanHistory {
  id: string;
  timestamp: Date;
  type: string;
  profit: number;
  gasUsed: number;
  status: 'success' | 'failed' | 'pending';
  protocols: string[];
}

const FlashLoans: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [isScanning, setIsScanning] = useState(false);

  const opportunities: FlashLoanOpportunity[] = [
    {
      id: '1',
      type: 'arbitrage',
      profit: 234.50,
      capital: 50000,
      duration: 1,
      risk: 'low',
      protocols: ['Uniswap V3', 'SushiSwap'],
      gasEstimate: 0.12,
      success_rate: 94.5,
      description: 'ETH/USDC price difference between Uniswap and SushiSwap'
    },
    {
      id: '2',
      type: 'liquidation',
      profit: 1820.75,
      capital: 100000,
      duration: 1,
      risk: 'medium',
      protocols: ['Compound', 'AAVE'],
      gasEstimate: 0.28,
      success_rate: 87.3,
      description: 'Liquidate undercollateralized COMP position'
    },
    {
      id: '3',
      type: 'arbitrage',
      profit: 156.30,
      capital: 25000,
      duration: 1,
      risk: 'low',
      protocols: ['Curve', '1inch'],
      gasEstimate: 0.08,
      success_rate: 96.2,
      description: 'DAI/USDC spread across Curve and 1inch'
    },
    {
      id: '4',
      type: 'refinancing',
      profit: 445.60,
      capital: 75000,
      duration: 2,
      risk: 'medium',
      protocols: ['AAVE', 'Compound'],
      gasEstimate: 0.15,
      success_rate: 91.8,
      description: 'Refinance high-interest debt from AAVE to Compound'
    },
    {
      id: '5',
      type: 'liquidation',
      profit: 89.40,
      capital: 15000,
      duration: 1,
      risk: 'high',
      protocols: ['MakerDAO'],
      gasEstimate: 0.22,
      success_rate: 78.5,
      description: 'Liquidate risky CDP vault in MakerDAO'
    }
  ];

  const history: FlashLoanHistory[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'Arbitrage',
      profit: 189.30,
      gasUsed: 0.09,
      status: 'success',
      protocols: ['Uniswap', 'SushiSwap']
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'Liquidation',
      profit: 1240.50,
      gasUsed: 0.31,
      status: 'success',
      protocols: ['Compound']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'Arbitrage',
      profit: 0,
      gasUsed: 0.15,
      status: 'failed',
      protocols: ['Curve', '1inch']
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      type: 'Refinancing',
      profit: 320.80,
      gasUsed: 0.18,
      status: 'success',
      protocols: ['AAVE', 'Compound']
    }
  ];

  const strategies = [
    { key: 'all', name: 'All Opportunities' },
    { key: 'arbitrage', name: 'Arbitrage' },
    { key: 'liquidation', name: 'Liquidations' },
    { key: 'refinancing', name: 'Refinancing' }
  ];

  const filteredOpportunities = opportunities.filter(
    opp => selectedStrategy === 'all' || opp.type === selectedStrategy
  );

  const totalStats = {
    totalProfit: history.filter(h => h.status === 'success').reduce((sum, h) => sum + h.profit, 0),
    successRate: (history.filter(h => h.status === 'success').length / history.length) * 100,
    totalGasUsed: history.reduce((sum, h) => sum + h.gasUsed, 0),
    opportunitiesScanned: 1247
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/20';
      case 'failed': return 'text-red-500 bg-red-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'arbitrage': return '⚡';
      case 'liquidation': return '🎯';
      case 'refinancing': return '🔄';
      default: return '💰';
    }
  };

  const executeFlashLoan = (opportunityId: string) => {
    console.log(`Executing flash loan opportunity: ${opportunityId}`);
    // Implement flash loan execution logic
  };

  const scanForOpportunities = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Flash Loan Hub</h1>
            <p className="text-gray-400">Execute profitable flash loan strategies</p>
          </div>
          <button
            onClick={scanForOpportunities}
            disabled={isScanning}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Opportunities'}</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-green-400">${totalStats.totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <CheckIcon className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold">{totalStats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <BoltIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Gas Used</p>
                <p className="text-2xl font-bold">{totalStats.totalGasUsed.toFixed(2)} ETH</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Opportunities</p>
                <p className="text-2xl font-bold">{totalStats.opportunitiesScanned.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Opportunities */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Live Opportunities</h2>
            <select 
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              {strategies.map(strategy => (
                <option key={strategy.key} value={strategy.key}>{strategy.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-slate-700 rounded-lg border border-slate-600 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeEmoji(opportunity.type)}</span>
                    <div>
                      <h3 className="font-semibold capitalize">{opportunity.type}</h3>
                      <div className={`flex items-center space-x-1 ${getRiskColor(opportunity.risk)}`}>
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span className="text-sm capitalize">{opportunity.risk} Risk</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">+${opportunity.profit}</p>
                    <p className="text-xs text-gray-400">Est. Profit</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-4">{opportunity.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-400">Capital Needed</p>
                    <p className="font-semibold">${opportunity.capital.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="font-semibold">{opportunity.duration} block{opportunity.duration > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Gas Est.</p>
                    <p className="font-semibold">{opportunity.gasEstimate} ETH</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Success Rate</p>
                    <p className="font-semibold">{opportunity.success_rate}%</p>
                  </div>
                </div>

                {/* Protocols */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Protocols:</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.protocols.map((protocol, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-600 rounded text-xs">
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  onClick={() => executeFlashLoan(opportunity.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Execute Flash Loan</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Execution History */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-6">Execution History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-400 text-sm">
                <tr>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Protocols</th>
                  <th className="pb-3">Profit/Loss</th>
                  <th className="pb-3">Gas Used</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-700">
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{entry.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span>{getTypeEmoji(entry.type.toLowerCase())}</span>
                        <span>{entry.type}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        {entry.protocols.map((protocol, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-700 rounded text-xs">
                            {protocol}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${
                        entry.status === 'success' && entry.profit > 0 
                          ? 'text-green-400' 
                          : entry.status === 'failed' 
                          ? 'text-red-400' 
                          : 'text-gray-400'
                      }`}>
                        {entry.status === 'success' && entry.profit > 0 
                          ? `+$${entry.profit.toLocaleString()}` 
                          : entry.status === 'failed' 
                          ? '-$0.00' 
                          : 'Pending'
                        }
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm">{entry.gasUsed.toFixed(3)} ETH</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flash Loan Info */}
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4">⚡ Flash Loan Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">How Flash Loans Work:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Borrow any amount without collateral</li>
                <li>• Execute arbitrage or liquidation</li>
                <li>• Repay loan + fees in same transaction</li>
                <li>• Keep the profit from price differences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Supported Protocols:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• AAVE (0.09% fee)</li>
                <li>• Balancer (0.05% fee)</li>
                <li>• dYdX (0% fee)</li>
                <li>• Uniswap V3 (0.05% fee)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashLoans;

import React, { useState } from 'react';
import { 
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ChartPieIcon,
  BanknotesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
  protocol: string;
  apy?: number;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent: number;
  assets: Asset[];
}

const Portfolio: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  
  const portfolioData: PortfolioData = {
    totalValue: 45230.84,
    totalChange24h: 1040.50,
    totalChangePercent: 2.35,
    assets: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 12.5,
        value: 20384.50,
        price: 1630.76,
        change24h: 3.2,
        allocation: 45.1,
        protocol: 'Lido Staking',
        apy: 5.4
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 8920.30,
        value: 8920.30,
        price: 1.00,
        change24h: 0.1,
        allocation: 19.7,
        protocol: 'Compound',
        apy: 8.3
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        balance: 0.42,
        value: 7234.80,
        price: 17225.00,
        change24h: 1.8,
        allocation: 16.0,
        protocol: 'AAVE',
        apy: 2.1
      },
      {
        symbol: 'UNI',
        name: 'Uniswap',
        balance: 450.0,
        value: 4680.00,
        price: 10.40,
        change24h: -2.1,
        allocation: 10.3,
        protocol: 'Uniswap V3 LP',
        apy: 12.7
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        balance: 320.5,
        value: 2890.45,
        price: 9.02,
        change24h: 4.6,
        allocation: 6.4,
        protocol: 'Yearn Finance',
        apy: 15.2
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        balance: 1200.0,
        value: 1120.74,
        price: 0.93,
        change24h: -1.5,
        allocation: 2.5,
        protocol: 'QuickSwap LP',
        apy: 18.9
      }
    ]
  };

  const timeframes = ['1h', '24h', '7d', '30d', '90d', '1y'];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Overview</h1>
          <p className="text-gray-400">Track your DeFi positions and performance</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Value Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Total Portfolio Value</h2>
              <div className="flex space-x-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-3xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {portfolioData.totalChangePercent >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-semibold ${
                    portfolioData.totalChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ${Math.abs(portfolioData.totalChange24h).toLocaleString()} ({portfolioData.totalChangePercent}%)
                  </span>
                  <span className="text-gray-400 text-sm">24h</span>
                </div>
              </div>
            </div>

            {/* Portfolio Chart Placeholder */}
            <div className="mt-6 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Portfolio Performance Chart</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <ChartPieIcon className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Positions</p>
                  <p className="text-xl font-bold">{portfolioData.assets.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <BanknotesIcon className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Avg APY</p>
                  <p className="text-xl font-bold">
                    {(portfolioData.assets.reduce((sum, asset) => sum + (asset.apy || 0) * asset.allocation, 0) / 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Daily Yield</p>
                  <p className="text-xl font-bold">$34.20</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Holdings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="text-left p-4 font-medium">Asset</th>
                  <th className="text-left p-4 font-medium">Balance</th>
                  <th className="text-left p-4 font-medium">Value</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">24h Change</th>
                  <th className="text-left p-4 font-medium">Allocation</th>
                  <th className="text-left p-4 font-medium">Protocol</th>
                  <th className="text-left p-4 font-medium">APY</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.assets.map((asset, index) => (
                  <tr key={asset.symbol} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold">{asset.symbol}</p>
                          <p className="text-sm text-gray-400">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{asset.balance.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">${asset.value.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p>${asset.price.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {asset.change24h >= 0 ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${asset.allocation}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{asset.allocation}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-700 rounded text-sm">{asset.protocol}</span>
                    </td>
                    <td className="p-4">
                      {asset.apy && (
                        <span className="text-green-400 font-semibold">{asset.apy}%</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors">
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Asset Allocation</h3>
            <div className="space-y-3">
              {portfolioData.assets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>{asset.symbol}</span>
                  </div>
                  <span className="font-semibold">{asset.allocation}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Protocol Distribution</h3>
            <div className="space-y-3">
              {Array.from(new Set(portfolioData.assets.map(a => a.protocol))).map((protocol) => {
                const protocolValue = portfolioData.assets
                  .filter(a => a.protocol === protocol)
                  .reduce((sum, a) => sum + a.value, 0);
                const percentage = (protocolValue / portfolioData.totalValue * 100).toFixed(1);
                
                return (
                  <div key={protocol} className="flex items-center justify-between">
                    <span>{protocol}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">${protocolValue.toLocaleString()}</span>
                      <span className="font-semibold">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

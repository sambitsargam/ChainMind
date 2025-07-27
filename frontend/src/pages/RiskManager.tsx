import React, { useState } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  FireIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface RiskAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface RiskMetric {
  name: string;
  current: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  description: string;
}

const RiskManager: React.FC = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High ETH Concentration',
      description: 'ETH allocation exceeds 40% of portfolio. Consider diversifying.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Protocol Risk',
      description: 'Yearn Finance vault shows increased volatility.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '3',
      type: 'critical',
      title: 'Smart Contract Risk',
      description: 'Unusual activity detected in Compound protocol.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: true
    }
  ]);

  const riskMetrics: RiskMetric[] = [
    {
      name: 'Portfolio Concentration',
      current: 45.2,
      threshold: 40.0,
      status: 'warning',
      description: 'Maximum allocation in single asset'
    },
    {
      name: 'Smart Contract Risk',
      current: 15.8,
      threshold: 20.0,
      status: 'safe',
      description: 'Exposure to unaudited protocols'
    },
    {
      name: 'Liquidity Risk',
      current: 8.3,
      threshold: 15.0,
      status: 'safe',
      description: 'Assets in low-liquidity pools'
    },
    {
      name: 'Impermanent Loss',
      current: 22.1,
      threshold: 25.0,
      status: 'warning',
      description: 'Potential IL from LP positions'
    },
    {
      name: 'Slippage Risk',
      current: 3.2,
      threshold: 5.0,
      status: 'safe',
      description: 'Expected slippage on exits'
    },
    {
      name: 'Gas Price Risk',
      current: 180.5,
      threshold: 200.0,
      status: 'safe',
      description: 'Current network congestion'
    }
  ];

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'info': return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <ShieldCheckIcon className="w-6 h-6 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'critical': return <FireIcon className="w-6 h-6 text-red-500" />;
      default: return <ChartBarIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Risk Management</h1>
          <p className="text-gray-400">Monitor and manage your DeFi portfolio risks</p>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold">Overall Risk Score</h3>
                <p className="text-sm text-gray-400">Composite risk assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Risk Level</span>
                  <span className="text-yellow-400">Moderate</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full w-3/5"></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">6.8</p>
                <p className="text-xs text-gray-400">/ 10</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <BellIcon className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold">Active Alerts</h3>
                <p className="text-sm text-gray-400">Unresolved risk alerts</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-400">{alerts.filter(a => !a.resolved).length}</p>
                <p className="text-sm text-gray-400">Require attention</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-red-400">{alerts.filter(a => !a.resolved && a.type === 'critical').length} Critical</p>
                <p className="text-yellow-400">{alerts.filter(a => !a.resolved && a.type === 'warning').length} Warning</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <CogIcon className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold">Auto Protection</h3>
                <p className="text-sm text-gray-400">Automated risk management</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">ON</p>
                <p className="text-sm text-gray-400">Stop-loss active</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-400">Max Loss: 15%</p>
                <p className="text-gray-400">Auto-exit: Enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Risk Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(metric.status)}
                    <h3 className="font-semibold">{metric.name}</h3>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current: {metric.current}%</span>
                    <span>Threshold: {metric.threshold}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.status === 'critical' ? 'bg-red-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((metric.current / metric.threshold) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-6">Risk Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-4 ${getAlertColor(alert.type)} ${
                  alert.resolved ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
                      {alert.resolved && (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <p className="text-xs opacity-75">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  
                  {!alert.resolved && (
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                      >
                        Resolve
                      </button>
                      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Settings */}
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-6">Risk Management Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Stop-Loss Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Maximum Portfolio Loss</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      defaultValue="15" 
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">15%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Maximum Single Asset Loss</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      defaultValue="20" 
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">20%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Alert Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">SMS alerts for critical risks</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Discord webhook notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Telegram bot alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManager;

import { DecisionEngine } from '../engine/DecisionEngine';
import { NoditMCPClient } from '../mcp/NoditMCPClient';
import { Logger } from '../utils/Logger';

export interface StrategyMonitorConfig {
    decisionEngine: DecisionEngine;
    mcpClient: NoditMCPClient;
    logger: Logger;
}

export interface StrategyStatus {
    isActive: boolean;
    lastEvaluation: number;
    totalDecisions: number;
    successRate: number;
    currentMarketConditions: any;
    portfolioHealth: any;
    riskMetrics: any;
}

export class StrategyMonitor {
    private decisionEngine: DecisionEngine;
    private mcpClient: NoditMCPClient;
    private logger: Logger;
    private isActive: boolean = false;
    private lastEvaluation: number = 0;
    private marketDataCache: any = {};
    private emergencyStopActivated: boolean = false;

    constructor(config: StrategyMonitorConfig) {
        this.decisionEngine = config.decisionEngine;
        this.mcpClient = config.mcpClient;
        this.logger = config.logger;
    }

    async start(): Promise<void> {
        this.logger.info('Starting strategy monitor');
        this.isActive = true;
        this.emergencyStopActivated = false;
        
        // Initial market data update
        await this.updateMarketData();
    }

    async stop(): Promise<void> {
        this.logger.info('Stopping strategy monitor');
        this.isActive = false;
    }

    async emergencyStop(): Promise<void> {
        this.logger.warn('Emergency stop activated');
        this.emergencyStopActivated = true;
        this.isActive = false;
        
        // Additional emergency procedures could be implemented here
        // such as immediately closing all positions, sending alerts, etc.
    }

    async evaluateAndExecute(): Promise<any> {
        if (!this.isActive || this.emergencyStopActivated) {
            this.logger.warn('Strategy monitor is not active or emergency stop is activated');
            return null;
        }

        try {
            this.logger.info('Evaluating strategy and executing if needed');
            
            // Check if enough time has passed since last evaluation
            const minInterval = parseInt(process.env.MIN_EVALUATION_INTERVAL || '300000'); // 5 minutes
            const timeSinceLastEvaluation = Date.now() - this.lastEvaluation;
            
            if (timeSinceLastEvaluation < minInterval) {
                this.logger.debug(`Skipping evaluation, not enough time passed: ${timeSinceLastEvaluation}ms`);
                return null;
            }

            // Perform risk checks before executing
            const riskCheck = await this.performRiskChecks();
            if (!riskCheck.passed) {
                this.logger.warn('Risk checks failed, skipping execution:', riskCheck.reasons);
                return null;
            }

            // Execute decision engine
            const result = await this.decisionEngine.evaluateAndExecute();
            this.lastEvaluation = Date.now();

            return result;
        } catch (error) {
            this.logger.error('Error in strategy evaluation:', error);
            throw error;
        }
    }

    async updateMarketData(): Promise<void> {
        try {
            this.logger.debug('Updating market data cache');
            
            const chains = ['ethereum', 'polygon', 'arbitrum'];
            const tokens = ['USDC', 'WETH', 'WMATIC', 'USDT'];
            
            for (const chain of chains) {
                this.marketDataCache[chain] = {};
                
                for (const token of tokens) {
                    try {
                        const [tokenData, lendingRates] = await Promise.all([
                            this.mcpClient.getTokenData(token, chain),
                            this.mcpClient.getLendingRates('aave', token, chain)
                        ]);
                        
                        this.marketDataCache[chain][token] = {
                            ...tokenData,
                            ...lendingRates,
                            lastUpdated: Date.now()
                        };
                    } catch (error) {
                        this.logger.warn(`Failed to update data for ${token} on ${chain}:`, error);
                    }
                }
            }
            
            this.logger.debug('Market data cache updated');
        } catch (error) {
            this.logger.error('Error updating market data:', error);
        }
    }

    async getStrategyStatus(): Promise<StrategyStatus> {
        const stats = this.decisionEngine.getStats();
        const portfolioHealth = await this.assessPortfolioHealth();
        const riskMetrics = await this.calculateRiskMetrics();
        
        return {
            isActive: this.isActive && !this.emergencyStopActivated,
            lastEvaluation: this.lastEvaluation,
            totalDecisions: stats.totalDecisions,
            successRate: stats.successRate,
            currentMarketConditions: this.marketDataCache,
            portfolioHealth,
            riskMetrics
        };
    }

    private async performRiskChecks(): Promise<{ passed: boolean; reasons: string[] }> {
        const reasons: string[] = [];

        try {
            // Check gas prices
            const gasLimit = parseFloat(process.env.MAX_GAS_PRICE || '100'); // 100 gwei
            const currentGasPrices = await Promise.all([
                this.mcpClient.getGasPrice('ethereum'),
                this.mcpClient.getGasPrice('polygon')
            ]);

            for (const gasPrice of currentGasPrices) {
                if (gasPrice > gasLimit) {
                    reasons.push(`Gas price too high: ${gasPrice} gwei`);
                }
            }

            // Check market volatility
            const volatilityCheck = await this.checkMarketVolatility();
            if (!volatilityCheck.passed) {
                reasons.push(`High market volatility detected: ${volatilityCheck.reason}`);
            }

            // Check portfolio concentration
            const concentrationCheck = await this.checkPortfolioConcentration();
            if (!concentrationCheck.passed) {
                reasons.push(`Portfolio concentration risk: ${concentrationCheck.reason}`);
            }

            return {
                passed: reasons.length === 0,
                reasons
            };
        } catch (error) {
            this.logger.error('Error performing risk checks:', error);
            return {
                passed: false,
                reasons: ['Risk check system error']
            };
        }
    }

    private async checkMarketVolatility(): Promise<{ passed: boolean; reason?: string }> {
        try {
            // Simple volatility check based on price changes
            const maxVolatility = 0.1; // 10% price change threshold
            
            for (const [chain, tokens] of Object.entries(this.marketDataCache)) {
                for (const [token, data] of Object.entries(tokens as Record<string, any>)) {
                    if (data.priceChange24h && Math.abs(data.priceChange24h) > maxVolatility) {
                        return {
                            passed: false,
                            reason: `${token} on ${chain} has high volatility: ${(data.priceChange24h * 100).toFixed(2)}%`
                        };
                    }
                }
            }
            
            return { passed: true };
        } catch (error) {
            this.logger.error('Error checking market volatility:', error);
            return { passed: false, reason: 'Volatility check error' };
        }
    }

    private async checkPortfolioConcentration(): Promise<{ passed: boolean; reason?: string }> {
        try {
            // This would implement portfolio concentration risk checks
            // For now, return passed
            return { passed: true };
        } catch (error) {
            this.logger.error('Error checking portfolio concentration:', error);
            return { passed: false, reason: 'Concentration check error' };
        }
    }

    private async assessPortfolioHealth(): Promise<any> {
        try {
            return {
                diversificationScore: 85,
                liquidityScore: 92,
                riskScore: 'medium',
                totalValue: '$50,000', // Placeholder
                lastUpdated: Date.now()
            };
        } catch (error) {
            this.logger.error('Error assessing portfolio health:', error);
            return null;
        }
    }

    private async calculateRiskMetrics(): Promise<any> {
        try {
            return {
                sharpeRatio: 1.2,
                maxDrawdown: 0.05,
                volatility: 0.15,
                beta: 0.8,
                var95: 0.03, // Value at Risk 95%
                lastCalculated: Date.now()
            };
        } catch (error) {
            this.logger.error('Error calculating risk metrics:', error);
            return null;
        }
    }

    async generateDailyReport(): Promise<any> {
        try {
            this.logger.info('Generating daily strategy report');
            
            const status = await this.getStrategyStatus();
            const recentDecisions = await this.decisionEngine.getDecisionHistory(10);
            
            const report = {
                date: new Date().toISOString().split('T')[0],
                summary: {
                    totalDecisions: status.totalDecisions,
                    successRate: status.successRate,
                    portfolioHealth: status.portfolioHealth,
                    riskMetrics: status.riskMetrics
                },
                recentDecisions: recentDecisions.map(decision => ({
                    id: decision.id,
                    action: decision.decision.action,
                    success: decision.executionResult?.success,
                    timestamp: decision.timestamp
                })),
                marketConditions: status.currentMarketConditions,
                recommendations: await this.generateRecommendations(),
                timestamp: Date.now()
            };
            
            this.logger.info('Daily report generated');
            return report;
        } catch (error) {
            this.logger.error('Error generating daily report:', error);
            throw error;
        }
    }

    private async generateRecommendations(): Promise<string[]> {
        const recommendations: string[] = [];
        
        try {
            const stats = this.decisionEngine.getStats();
            
            if (stats.successRate < 70) {
                recommendations.push('Consider reviewing AI decision parameters - success rate below 70%');
            }
            
            if (stats.totalDecisions < 5) {
                recommendations.push('Low activity detected - market conditions may not be favorable for rebalancing');
            }
            
            // Add more intelligent recommendations based on market analysis
            
            return recommendations;
        } catch (error) {
            this.logger.error('Error generating recommendations:', error);
            return ['Error generating recommendations'];
        }
    }
}

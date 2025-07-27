import express from 'express';
import { NoditMCPClient, TokenTransfer } from '../ai-agent/src/mcp/NoditMCPClient';
import { DecisionEngine } from '../ai-agent/src/engine/DecisionEngine';
import { Logger } from '../ai-agent/src/utils/Logger';

export interface WhaleTransfer extends TokenTransfer {
    valueUSD: number;
    classification: 'whale' | 'institution' | 'normal';
}

export class WhaleMovementHandler {
    private mcpClient: NoditMCPClient;
    private decisionEngine: DecisionEngine;
    private logger: Logger;
    private app: express.Application;

    constructor(
        mcpClient: NoditMCPClient,
        decisionEngine: DecisionEngine
    ) {
        this.mcpClient = mcpClient;
        this.decisionEngine = decisionEngine;
        this.logger = new Logger('WhaleMovementHandler');
        this.app = express();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.app.use(express.json());

        // Webhook endpoint for Nodit whale transfer notifications
        this.app.post('/webhook/whale-transfer', async (req, res) => {
            try {
                const transfer: WhaleTransfer = req.body;
                await this.handleWhaleTransfer(transfer);
                res.status(200).json({ success: true });
            } catch (error) {
                this.logger.error('Error handling whale transfer webhook:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Endpoint to manually trigger whale movement analysis
        this.app.post('/api/analyze-whale-movements', async (req, res) => {
            try {
                const analysis = await this.analyzeRecentWhaleMovements();
                res.json(analysis);
            } catch (error) {
                this.logger.error('Error analyzing whale movements:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }

    async handleWhaleTransfer(transfer: WhaleTransfer): Promise<void> {
        this.logger.info(`Whale transfer detected: ${transfer.valueUSD} USD`, {
            hash: transfer.hash,
            from: transfer.from,
            to: transfer.to,
            token: transfer.token,
            value: transfer.value
        });

        try {
            // Analyze the impact of this whale movement
            const impact = await this.analyzeTransferImpact(transfer);
            
            // If significant impact, trigger strategy re-evaluation
            if (impact.shouldRebalance) {
                this.logger.info('Whale movement suggests rebalancing opportunity');
                await this.decisionEngine.evaluateAndExecute();
            }
        } catch (error) {
            this.logger.error('Error analyzing whale transfer impact:', error);
        }
    }

    private async analyzeTransferImpact(transfer: WhaleTransfer): Promise<{
        shouldRebalance: boolean;
        reasoning: string;
        impactScore: number;
    }> {
        try {
            // Get current market data for the token
            const tokenData = await this.mcpClient.getTokenData(transfer.token, 'ethereum');
            
            // Calculate impact as percentage of daily volume
            const impactPercentage = transfer.valueUSD / (tokenData.volume24h || 1);
            
            // Determine if this is a significant movement
            const isSignificant = impactPercentage > 0.05; // 5% of daily volume
            const isLargeAmount = transfer.valueUSD > 1000000; // $1M+
            
            let reasoning = '';
            let shouldRebalance = false;
            let impactScore = 0;

            if (isSignificant && isLargeAmount) {
                impactScore = Math.min(impactPercentage * 10, 10); // Score 0-10
                shouldRebalance = impactScore > 3;
                
                reasoning = `Large transfer of ${transfer.valueUSD.toLocaleString()} USD ` +
                          `represents ${(impactPercentage * 100).toFixed(2)}% of daily volume. `;
                
                if (this.isMovingToExchange(transfer.to)) {
                    reasoning += 'Tokens moved to exchange - potential selling pressure.';
                    shouldRebalance = true;
                    impactScore += 2;
                } else if (this.isMovingFromExchange(transfer.from)) {
                    reasoning += 'Tokens moved from exchange - potential accumulation.';
                    impactScore += 1;
                } else {
                    reasoning += 'Wallet-to-wallet transfer - monitoring for follow-up moves.';
                }
            } else {
                reasoning = 'Transfer not significant enough to warrant immediate action.';
            }

            return {
                shouldRebalance,
                reasoning,
                impactScore
            };
        } catch (error) {
            this.logger.error('Error analyzing transfer impact:', error);
            return {
                shouldRebalance: false,
                reasoning: 'Error analyzing impact',
                impactScore: 0
            };
        }
    }

    private async analyzeRecentWhaleMovements(): Promise<any> {
        try {
            // This would fetch recent large transfers and analyze patterns
            const chains = ['ethereum', 'polygon', 'arbitrum'];
            const movements: any[] = [];

            for (const chain of chains) {
                try {
                    // Get recent large transfers (this would be implemented with Nodit APIs)
                    const transfers = await this.getRecentLargeTransfers(chain);
                    movements.push(...transfers);
                } catch (error) {
                    this.logger.warn(`Failed to get transfers for ${chain}:`, error);
                }
            }

            // Analyze patterns
            const analysis = this.analyzeMovementPatterns(movements);
            
            return {
                totalMovements: movements.length,
                totalValue: movements.reduce((sum, m) => sum + (m.valueUSD || 0), 0),
                patterns: analysis,
                recommendations: this.generateRecommendations(analysis),
                timestamp: Date.now()
            };
        } catch (error) {
            this.logger.error('Error analyzing recent whale movements:', error);
            throw error;
        }
    }

    private async getRecentLargeTransfers(chain: string): Promise<WhaleTransfer[]> {
        // This would use Nodit's APIs to get recent large transfers
        // For now, return empty array as placeholder
        return [];
    }

    private analyzeMovementPatterns(movements: WhaleTransfer[]): any {
        const patterns = {
            netFlowToExchanges: 0,
            netFlowFromExchanges: 0,
            largestMovements: movements
                .sort((a, b) => (b.valueUSD || 0) - (a.valueUSD || 0))
                .slice(0, 5),
            tokenDistribution: {} as Record<string, number>,
            timeDistribution: {} as Record<string, number>
        };

        movements.forEach(movement => {
            // Calculate net flows
            if (this.isMovingToExchange(movement.to)) {
                patterns.netFlowToExchanges += movement.valueUSD || 0;
            } else if (this.isMovingFromExchange(movement.from)) {
                patterns.netFlowFromExchanges += movement.valueUSD || 0;
            }

            // Token distribution
            if (movement.token) {
                patterns.tokenDistribution[movement.token] = 
                    (patterns.tokenDistribution[movement.token] || 0) + (movement.valueUSD || 0);
            }

            // Time distribution (hourly)
            const hour = new Date(movement.timestamp * 1000).getHours();
            const hourKey = `${hour}:00`;
            patterns.timeDistribution[hourKey] = 
                (patterns.timeDistribution[hourKey] || 0) + (movement.valueUSD || 0);
        });

        return patterns;
    }

    private generateRecommendations(patterns: any): string[] {
        const recommendations: string[] = [];

        const netFlow = patterns.netFlowFromExchanges - patterns.netFlowToExchanges;
        
        if (netFlow > 10000000) { // $10M+ net outflow from exchanges
            recommendations.push('Significant outflow from exchanges detected - potential accumulation phase');
        } else if (netFlow < -10000000) { // $10M+ net inflow to exchanges
            recommendations.push('Significant inflow to exchanges detected - potential selling pressure');
        }

        if (patterns.largestMovements.length > 10) {
            recommendations.push('High whale activity detected - increased market volatility expected');
        }

        return recommendations;
    }

    private isMovingToExchange(address: string): boolean {
        // List of known exchange addresses (simplified)
        const exchangeAddresses = [
            '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', // Binance
            '0xd551234ae421e3bcba99a0da6d736074f22192ff', // Binance
            '0x28c6c06298d514db089934071355e5743bf21d60', // Binance
            '0x21a31ee1afc51d94c2efccaa2092ad1028285549', // Binance
            '0x564286362092d8e7936f0549571a803b203aaced', // FTX
            '0xf89d7b9c864f589bbf53a82105107622b35eaa40', // Bybit
            // Add more exchange addresses as needed
        ];
        
        return exchangeAddresses.includes(address.toLowerCase());
    }

    private isMovingFromExchange(address: string): boolean {
        return this.isMovingToExchange(address);
    }

    public startServer(port: number = 3002): void {
        this.app.listen(port, () => {
            this.logger.info(`Whale movement webhook server started on port ${port}`);
        });
    }
}

// Export for use in main application
export async function createWhaleMovementHandler(
    mcpClient: NoditMCPClient,
    decisionEngine: DecisionEngine
): Promise<WhaleMovementHandler> {
    return new WhaleMovementHandler(mcpClient, decisionEngine);
}

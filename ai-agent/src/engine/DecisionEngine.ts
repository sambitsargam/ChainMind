import { AIAgent, RebalanceDecision } from '../agent/AIAgent';
import { BlockchainClient } from '../blockchain/BlockchainClient';
import { NoditMCPClient } from '../mcp/NoditMCPClient';
import { Logger } from '../utils/Logger';

export interface DecisionEngineConfig {
    aiAgent: AIAgent;
    blockchainClient: BlockchainClient;
    mcpClient: NoditMCPClient;
    vaultAddress?: string;
    executorAddress?: string;
    defaultNetwork?: string;
}

export interface ExecutionResult {
    decisionId: string;
    success: boolean;
    transactionHash?: string;
    error?: string;
    gasUsed?: number;
    timestamp: number;
}

export interface DecisionRecord {
    id: string;
    decision: RebalanceDecision;
    executionResult?: ExecutionResult;
    timestamp: number;
    marketContext: any;
}

export class DecisionEngine {
    private aiAgent: AIAgent;
    private blockchainClient: BlockchainClient;
    private mcpClient: NoditMCPClient;
    private logger: Logger;
    private config: DecisionEngineConfig;
    private decisionHistory: DecisionRecord[] = [];
    private isExecuting: boolean = false;

    constructor(config: DecisionEngineConfig) {
        this.config = config;
        this.aiAgent = config.aiAgent;
        this.blockchainClient = config.blockchainClient;
        this.mcpClient = config.mcpClient;
        this.logger = new Logger('DecisionEngine');
    }

    async evaluateAndExecute(): Promise<ExecutionResult | null> {
        if (this.isExecuting) {
            this.logger.warn('Decision engine is already executing, skipping');
            return null;
        }

        this.isExecuting = true;
        
        try {
            this.logger.info('Starting decision evaluation cycle');

            // 1. Analyze current market conditions
            const marketData = await this.aiAgent.analyzeMarketConditions();
            
            // 2. Get current portfolio state
            const portfolio = await this.getCurrentPortfolio();
            
            // 3. Generate AI decision
            const decision = await this.aiAgent.generateRebalanceDecision(
                portfolio,
                marketData,
                this.getConstraints()
            );

            if (!decision) {
                this.logger.info('No rebalancing action recommended');
                return null;
            }

            // 4. Validate decision
            if (!this.validateDecision(decision)) {
                this.logger.warn('Decision validation failed:', decision);
                return null;
            }

            // 5. Execute decision
            const executionResult = await this.executeDecision(decision, marketData);
            
            // 6. Record decision and result
            this.recordDecision(decision, marketData, executionResult);

            this.logger.info('Decision evaluation cycle completed', {
                decisionId: executionResult.decisionId,
                success: executionResult.success
            });

            return executionResult;
        } catch (error) {
            this.logger.error('Error in decision evaluation cycle:', error);
            throw error;
        } finally {
            this.isExecuting = false;
        }
    }

    private async getCurrentPortfolio(): Promise<any> {
        try {
            const vaultAddress = this.config.vaultAddress || process.env.VAULT_ADDRESS;
            const network = this.config.defaultNetwork || 'ethereum';

            if (!vaultAddress) {
                throw new Error('Vault address not configured');
            }

            // Get vault info
            const vaultInfo = await this.blockchainClient.getVaultInfo(vaultAddress, network);
            
            // Get token balances for each supported token
            const tokenBalances: any = {};
            
            for (const token of vaultInfo.supportedTokens) {
                try {
                    const balance = await this.blockchainClient.getTokenBalance(
                        token,
                        vaultAddress,
                        network
                    );
                    tokenBalances[token] = balance;
                } catch (error) {
                    this.logger.warn(`Failed to get balance for token ${token}:`, error);
                }
            }

            return {
                vault: vaultAddress,
                network,
                strategies: vaultInfo.activeStrategies,
                tokenBalances,
                supportedTokens: vaultInfo.supportedTokens
            };
        } catch (error) {
            this.logger.error('Error getting current portfolio:', error);
            throw error;
        }
    }

    private getConstraints(): any {
        return {
            maxGasPrice: process.env.MAX_GAS_PRICE || '50', // 50 gwei
            minTransactionValue: process.env.MIN_TRANSACTION_VALUE || '1000', // $1000
            maxSlippage: process.env.MAX_SLIPPAGE || '1', // 1%
            allowedNetworks: ['ethereum', 'polygon', 'arbitrum', 'optimism'],
            allowedProtocols: ['aave', 'compound', 'uniswap', 'curve']
        };
    }

    private validateDecision(decision: RebalanceDecision): boolean {
        // Check confidence threshold
        if (decision.confidence < 0.7) {
            this.logger.warn(`Decision confidence too low: ${decision.confidence}`);
            return false;
        }

        // Check action type
        const validActions = ['rebalance', 'hold', 'bridge', 'lend', 'swap'];
        if (!validActions.includes(decision.action)) {
            this.logger.warn(`Invalid action type: ${decision.action}`);
            return false;
        }

        // Check amount is reasonable
        if (decision.amount && parseFloat(decision.amount) < 100) {
            this.logger.warn(`Transaction amount too small: ${decision.amount}`);
            return false;
        }

        return true;
    }

    private async executeDecision(
        decision: RebalanceDecision,
        marketContext: any
    ): Promise<ExecutionResult> {
        const decisionId = this.generateDecisionId();
        const timestamp = Date.now();

        try {
            this.logger.info(`Executing decision ${decisionId}:`, decision);

            if (decision.action === 'hold') {
                return {
                    decisionId,
                    success: true,
                    timestamp,
                };
            }

            const network = this.getNetworkFromChain(decision.fromChain || 'ethereum');
            const executorAddress = this.config.executorAddress || process.env.EXECUTOR_ADDRESS;

            if (!executorAddress) {
                throw new Error('Executor address not configured');
            }

            // Execute the decision on-chain
            const txResult = await this.blockchainClient.executeAIDecision(
                executorAddress,
                network,
                {
                    action: decision.action,
                    fromChain: decision.fromChain || 'ethereum',
                    toChain: decision.toChain || 'ethereum',
                    token: decision.token,
                    amount: decision.amount || '0',
                    reason: decision.reason,
                    targetProtocol: decision.targetProtocol || '',
                    executionData: '0x' // Empty data for now
                }
            );

            return {
                decisionId,
                success: txResult.success,
                transactionHash: txResult.hash,
                gasUsed: Number(txResult.gasUsed),
                timestamp
            };
        } catch (error) {
            this.logger.error(`Error executing decision ${decisionId}:`, error);
            return {
                decisionId,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp
            };
        }
    }

    private recordDecision(
        decision: RebalanceDecision,
        marketContext: any,
        executionResult: ExecutionResult
    ): void {
        const record: DecisionRecord = {
            id: executionResult.decisionId,
            decision,
            executionResult,
            timestamp: executionResult.timestamp,
            marketContext
        };

        this.decisionHistory.push(record);

        // Keep only last 1000 decisions in memory
        if (this.decisionHistory.length > 1000) {
            this.decisionHistory = this.decisionHistory.slice(-1000);
        }

        this.logger.info(`Recorded decision ${record.id}`);
    }

    private generateDecisionId(): string {
        return `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getNetworkFromChain(chain: string): string {
        const chainMap: Record<string, string> = {
            'ethereum': 'ethereum',
            'polygon': 'polygon',
            'arbitrum': 'arbitrum',
            'optimism': 'optimism',
            'bsc': 'bsc'
        };
        
        return chainMap[chain.toLowerCase()] || 'ethereum';
    }

    async getDecisionHistory(limit: number = 50): Promise<DecisionRecord[]> {
        return this.decisionHistory.slice(-limit).reverse();
    }

    async getDecisionById(id: string): Promise<DecisionRecord | undefined> {
        return this.decisionHistory.find(record => record.id === id);
    }

    async explainDecision(id: string): Promise<string> {
        const record = await this.getDecisionById(id);
        if (!record) {
            throw new Error(`Decision ${id} not found`);
        }

        return await this.aiAgent.explainDecision(id, {
            decision: record.decision,
            marketContext: record.marketContext,
            executionResult: record.executionResult
        });
    }

    getStats(): any {
        const totalDecisions = this.decisionHistory.length;
        const successfulDecisions = this.decisionHistory.filter(d => d.executionResult?.success).length;
        const successRate = totalDecisions > 0 ? (successfulDecisions / totalDecisions) * 100 : 0;

        const actionCounts = this.decisionHistory.reduce((counts, record) => {
            const action = record.decision.action;
            counts[action] = (counts[action] || 0) + 1;
            return counts;
        }, {} as Record<string, number>);

        return {
            totalDecisions,
            successfulDecisions,
            successRate: Math.round(successRate * 100) / 100,
            actionCounts,
            isExecuting: this.isExecuting
        };
    }
}

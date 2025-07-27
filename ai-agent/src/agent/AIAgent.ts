import OpenAI from 'openai';
import { NoditMCPClient } from '../mcp/NoditMCPClient';
import { Logger } from '../utils/Logger';

export interface AIAgentConfig {
    openaiApiKey: string;
    model: string;
    temperature: number;
    mcpClient: NoditMCPClient;
}

export interface ChatContext {
    userId?: string;
    sessionId?: string;
    previousMessages?: Array<{role: string; content: string}>;
}

export interface RebalanceDecision {
    action: string;
    fromChain: string;
    toChain: string;
    token: string;
    amount: string;
    reason: string;
    confidence: number;
    targetProtocol?: string;
    expectedAPY?: number;
    riskLevel?: 'low' | 'medium' | 'high';
}

export class AIAgent {
    private openai: OpenAI;
    private mcpClient: NoditMCPClient;
    private logger: Logger;
    private config: AIAgentConfig;

    constructor(config: AIAgentConfig) {
        this.config = config;
        this.openai = new OpenAI({ apiKey: config.openaiApiKey });
        this.mcpClient = config.mcpClient;
        this.logger = new Logger('AIAgent');
    }

    async chat(message: string, context?: ChatContext): Promise<string> {
        try {
            const systemPrompt = this.getSystemPrompt();
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                { role: 'system', content: systemPrompt },
                ...(context?.previousMessages || []).map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content
                })),
                { role: 'user', content: message }
            ];

            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages,
                temperature: this.config.temperature,
                max_tokens: 2000
            });

            return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
        } catch (error) {
            this.logger.error('Error in chat:', error);
            throw error;
        }
    }

    async analyzeMarketConditions(): Promise<any> {
        try {
            this.logger.info('Analyzing current market conditions');

            // Get token balances for major assets
            const assets = ['USDC', 'WETH', 'WMATIC', 'USDT'];
            const chains = ['ethereum', 'polygon', 'arbitrum'];
            
            const marketData: any = {};

            for (const chain of chains) {
                marketData[chain] = {};
                for (const asset of assets) {
                    try {
                        const tokenData = await this.mcpClient.getTokenData(asset, chain);
                        const lendingRates = await this.mcpClient.getLendingRates('aave', asset, chain);
                        
                        marketData[chain][asset] = {
                            price: tokenData.price,
                            liquidity: tokenData.liquidity,
                            supplyAPY: lendingRates.supplyAPY,
                            borrowAPY: lendingRates.borrowAPY,
                            volume24h: tokenData.volume24h
                        };
                    } catch (error) {
                        this.logger.warn(`Failed to get data for ${asset} on ${chain}:`, error);
                    }
                }
            }

            return marketData;
        } catch (error) {
            this.logger.error('Error analyzing market conditions:', error);
            throw error;
        }
    }

    async generateRebalanceDecision(
        currentPortfolio: any,
        marketData: any,
        constraints?: any
    ): Promise<RebalanceDecision | null> {
        try {
            const prompt = this.buildRebalancePrompt(currentPortfolio, marketData, constraints);
            
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    { role: 'system', content: this.getSystemPrompt() },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1500,
                functions: [{
                    name: 'generate_rebalance_decision',
                    description: 'Generate a rebalancing decision based on market analysis',
                    parameters: {
                        type: 'object',
                        properties: {
                            action: { type: 'string', enum: ['rebalance', 'hold', 'bridge', 'lend', 'swap'] },
                            fromChain: { type: 'string' },
                            toChain: { type: 'string' },
                            token: { type: 'string' },
                            amount: { type: 'string' },
                            reason: { type: 'string' },
                            confidence: { type: 'number', minimum: 0, maximum: 1 },
                            targetProtocol: { type: 'string' },
                            expectedAPY: { type: 'number' },
                            riskLevel: { type: 'string', enum: ['low', 'medium', 'high'] }
                        },
                        required: ['action', 'reason', 'confidence']
                    }
                }],
                function_call: { name: 'generate_rebalance_decision' }
            });

            const functionCall = completion.choices[0]?.message?.function_call;
            if (functionCall && functionCall.arguments) {
                const decision = JSON.parse(functionCall.arguments) as RebalanceDecision;
                
                // Validate decision
                if (this.validateRebalanceDecision(decision)) {
                    return decision;
                }
            }

            return null;
        } catch (error) {
            this.logger.error('Error generating rebalance decision:', error);
            throw error;
        }
    }

    private getSystemPrompt(): string {
        return `You are ChainMind, an autonomous AI-powered DeFi strategist. Your role is to:

1. Analyze multi-chain DeFi market conditions using real-time data
2. Identify optimal yield opportunities across different protocols and chains
3. Generate strategic rebalancing decisions to maximize returns while managing risk
4. Explain your reasoning in clear, natural language

Key principles:
- Always prioritize capital preservation over aggressive yield hunting
- Consider gas costs and slippage in your decisions
- Diversify across chains and protocols to reduce risk
- Monitor for arbitrage opportunities between chains
- Adapt strategies based on market volatility and trends

Available tools via Nodit MCP:
- Token balances and transfers across multiple chains
- DEX liquidity and pricing data
- Lending protocol rates (Aave, Compound, etc.)
- Cross-chain bridge monitoring
- Real-time market data and trends

When making decisions, provide clear reasoning and quantify expected outcomes.`;
    }

    private buildRebalancePrompt(
        currentPortfolio: any,
        marketData: any,
        constraints?: any
    ): string {
        return `Analyze the current portfolio and market conditions to determine if any rebalancing action should be taken.

Current Portfolio:
${JSON.stringify(currentPortfolio, null, 2)}

Market Data:
${JSON.stringify(marketData, null, 2)}

Constraints:
${JSON.stringify(constraints || {}, null, 2)}

Based on this data, should I:
1. Rebalance assets between strategies or chains?
2. Bridge tokens to a different chain for better yields?
3. Enter/exit lending positions based on rate changes?
4. Swap tokens to take advantage of arbitrage opportunities?
5. Hold current positions?

Consider:
- Current APY differences across chains/protocols
- Gas costs and transaction fees
- Market volatility and trends
- Risk/reward ratios
- Diversification benefits

Provide a specific recommendation with reasoning.`;
    }

    private validateRebalanceDecision(decision: RebalanceDecision): boolean {
        // Basic validation
        if (!decision.action || !decision.reason || typeof decision.confidence !== 'number') {
            return false;
        }

        if (decision.confidence < 0 || decision.confidence > 1) {
            return false;
        }

        // Action-specific validation
        if (decision.action === 'rebalance' || decision.action === 'bridge') {
            if (!decision.fromChain || !decision.toChain || !decision.token || !decision.amount) {
                return false;
            }
        }

        return true;
    }

    async explainDecision(decisionId: string, additionalContext?: any): Promise<string> {
        try {
            const prompt = `Explain the reasoning behind rebalancing decision ${decisionId} in natural language.
            
Additional context: ${JSON.stringify(additionalContext || {}, null, 2)}

Provide a clear, concise explanation that a non-technical user could understand, including:
- What action was taken and why
- Expected benefits and outcomes
- Risk considerations
- Market conditions that influenced the decision`;

            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    { role: 'system', content: this.getSystemPrompt() },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 1000
            });

            return completion.choices[0]?.message?.content || 'Unable to explain decision';
        } catch (error) {
            this.logger.error('Error explaining decision:', error);
            throw error;
        }
    }
}

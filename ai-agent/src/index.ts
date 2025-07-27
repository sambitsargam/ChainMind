import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AIAgent } from './agent/AIAgent';
import { NoditMCPClient } from './mcp/NoditMCPClient';
import { BlockchainClient } from './blockchain/BlockchainClient';
import { DecisionEngine } from './engine/DecisionEngine';
import { Logger } from './utils/Logger';
import { StrategyMonitor } from './monitoring/StrategyMonitor';
import cron from 'node-cron';

dotenv.config();

class ChainMindServer {
    private app: express.Application;
    private aiAgent: AIAgent;
    private mcpClient: NoditMCPClient;
    private blockchainClient: BlockchainClient;
    private decisionEngine: DecisionEngine;
    private strategyMonitor: StrategyMonitor;
    private logger: Logger;

    constructor() {
        this.app = express();
        this.logger = new Logger('ChainMindServer');
        this.setupMiddleware();
        this.initializeComponents();
        this.setupRoutes();
        this.setupCronJobs();
    }

    private setupMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private async initializeComponents(): Promise<void> {
        try {
            // Initialize MCP client for Nodit APIs
            this.mcpClient = new NoditMCPClient({
                apiKey: process.env.NODIT_API_KEY!,
                baseUrl: process.env.NODIT_BASE_URL || 'https://api.nodit.io'
            });

            // Initialize blockchain client
            this.blockchainClient = new BlockchainClient({
                networks: {
                    ethereum: process.env.ETHEREUM_RPC_URL!,
                    polygon: process.env.POLYGON_RPC_URL!,
                    arbitrum: process.env.ARBITRUM_RPC_URL!,
                    optimism: process.env.OPTIMISM_RPC_URL!
                },
                privateKey: process.env.EXECUTOR_PRIVATE_KEY!
            });

            // Initialize AI agent
            this.aiAgent = new AIAgent({
                openaiApiKey: process.env.OPENAI_API_KEY!,
                model: 'gpt-4',
                temperature: 0.3,
                mcpClient: this.mcpClient
            });

            // Initialize decision engine
            this.decisionEngine = new DecisionEngine({
                aiAgent: this.aiAgent,
                blockchainClient: this.blockchainClient,
                mcpClient: this.mcpClient
            });

            // Initialize strategy monitor
            this.strategyMonitor = new StrategyMonitor({
                decisionEngine: this.decisionEngine,
                mcpClient: this.mcpClient,
                logger: this.logger
            });

            this.logger.info('All components initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize components:', error);
            throw error;
        }
    }

    private setupRoutes(): void {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // Get current strategy status
        this.app.get('/api/strategy/status', async (req, res) => {
            try {
                const status = await this.strategyMonitor.getStrategyStatus();
                res.json(status);
            } catch (error) {
                this.logger.error('Error getting strategy status:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Get AI decisions history
        this.app.get('/api/decisions', async (req, res) => {
            try {
                const decisions = await this.decisionEngine.getDecisionHistory();
                res.json(decisions);
            } catch (error) {
                this.logger.error('Error getting decisions:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Manual trigger for strategy evaluation
        this.app.post('/api/strategy/evaluate', async (req, res) => {
            try {
                const result = await this.strategyMonitor.evaluateAndExecute();
                res.json(result);
            } catch (error) {
                this.logger.error('Error evaluating strategy:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Chat interface for querying AI
        this.app.post('/api/chat', async (req, res) => {
            try {
                const { message, context } = req.body;
                const response = await this.aiAgent.chat(message, context);
                res.json({ response });
            } catch (error) {
                this.logger.error('Error in chat:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Emergency stop
        this.app.post('/api/emergency/stop', async (req, res) => {
            try {
                await this.strategyMonitor.emergencyStop();
                res.json({ success: true, message: 'Emergency stop activated' });
            } catch (error) {
                this.logger.error('Error in emergency stop:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }

    private setupCronJobs(): void {
        // Run strategy evaluation every 5 minutes
        cron.schedule('*/5 * * * *', async () => {
            try {
                this.logger.info('Running scheduled strategy evaluation');
                await this.strategyMonitor.evaluateAndExecute();
            } catch (error) {
                this.logger.error('Error in scheduled strategy evaluation:', error);
            }
        });

        // Update market data every minute
        cron.schedule('* * * * *', async () => {
            try {
                await this.strategyMonitor.updateMarketData();
            } catch (error) {
                this.logger.error('Error updating market data:', error);
            }
        });

        // Generate daily strategy report
        cron.schedule('0 0 * * *', async () => {
            try {
                await this.strategyMonitor.generateDailyReport();
            } catch (error) {
                this.logger.error('Error generating daily report:', error);
            }
        });
    }

    public async start(): Promise<void> {
        const port = process.env.PORT || 3001;
        
        this.app.listen(port, () => {
            this.logger.info(`ChainMind AI Agent started on port ${port}`);
        });

        // Start the strategy monitor
        await this.strategyMonitor.start();
    }
}

// Start the server
async function main() {
    try {
        const server = new ChainMindServer();
        await server.start();
    } catch (error) {
        console.error('Failed to start ChainMind server:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export { ChainMindServer };

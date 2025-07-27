# 🧠 ChainMind — Autonomous AI-Powered DeFi Strategist

> Fully autonomous, on-chain DeFi strategist using AI agents powered by Nodit's Model Context Protocol (MCP) to monitor token markets, identify yield opportunities, and autonomously rebalance assets across multiple chains.

![ChainMind Architecture](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue)

## 🧩 Overview

ChainMind is a fully autonomous, on-chain DeFi strategist that uses AI agents to:
- 📊 Monitor token markets across multiple chains in real-time
- 🔍 Identify optimal yield opportunities using Nodit's Web3 APIs
- 🤖 Make autonomous rebalancing decisions via LLM agents
- ⚡ Execute transactions on-chain through smart contracts
- 💬 Provide explainable AI through natural language interface

### Core Technology Stack

- **📡 Nodit Web3 APIs** - Token, wallet, and chain data
- **🧠 Nodit MCP** - AI agent and LLM-to-API integration  
- **🔁 Smart Contracts** - On-chain rebalancing execution
- **🚨 Webhooks/Streams** - Real-time DeFi event monitoring
- **💬 Explainable AI** - Natural language strategy explanations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- [Foundry](https://getfoundry.sh/) (for smart contract deployment)

### 1. Clone and Setup

```bash
git clone https://github.com/sambitsargam/ChainMind.git
cd ChainMind
npm run setup
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

Required environment variables:
```bash
NODIT_API_KEY=your-nodit-api-key
OPENAI_API_KEY=your-openai-api-key
ETHEREUM_RPC_URL=your-ethereum-rpc
POLYGON_RPC_URL=your-polygon-rpc
EXECUTOR_PRIVATE_KEY=your-executor-wallet-private-key
```

### 3. Deploy Smart Contracts

```bash
# Deploy to testnet first
npm run deploy -- --network sepolia

# Deploy to mainnet (after testing)
npm run deploy -- --network mainnet
```

### 4. Start the Application

```bash
# Start both AI agent and frontend
npm start

# Or start individually
npm run start:ai      # AI agent on port 3001
npm run start:frontend # Frontend on port 3000
```

Visit `http://localhost:3000` to access the ChainMind dashboard.

## 📦 Project Structure

```
/chainmind
├── contracts/              # Solidity smart contracts
│   ├── Vault.sol           # Main vault for holding tokens
│   ├── Executor.sol        # AI decision execution contract
│   └── interfaces/         # Contract interfaces
├── ai-agent/               # Node.js/TypeScript AI agent
│   ├── src/
│   │   ├── agent/          # AI agent core logic
│   │   ├── mcp/            # Nodit MCP client
│   │   ├── blockchain/     # Blockchain interaction
│   │   ├── engine/         # Decision engine
│   │   └── monitoring/     # Strategy monitoring
│   └── mcp-config.json     # MCP configuration
├── webhooks/               # Real-time event handlers
│   └── onWhaleMove.ts      # Whale movement detection
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   └── contexts/       # React contexts
│   └── public/             # Static assets
├── scripts/                # Deployment and utility scripts
└── .env.example           # Environment configuration template
```

## 🔧 Core Components

### 1. Smart Contracts

#### Vault.sol
Main contract that holds tokens and manages strategies:
- Token deposit/withdrawal functionality
- Strategy management and allocation
- AI-driven rebalancing execution
- Multi-chain asset support

#### Executor.sol
Executes AI decisions on-chain:
- Interfaces with DEXs, bridges, and lending protocols
- Validates and executes AI decisions
- Gas optimization and slippage protection
- Cross-chain transaction coordination

### 2. AI Agent

The AI agent uses Nodit's MCP to:
- Analyze market conditions across chains
- Generate rebalancing decisions using GPT-4
- Monitor portfolio health and risk metrics
- Execute decisions through smart contracts

Key features:
- **Real-time Analysis**: Continuous market monitoring
- **Risk Management**: Built-in risk checks and limits
- **Explainable AI**: Natural language decision explanations
- **Multi-chain Support**: Ethereum, Polygon, Arbitrum, Optimism

### 3. Frontend Dashboard

React-based dashboard providing:
- Real-time portfolio overview
- AI decision history and explanations
- Strategy performance analytics
- Manual controls and emergency stops

## 🔗 API Integration

### Nodit MCP Integration

ChainMind leverages Nodit's Model Context Protocol for:

```typescript
// Example: Get token balance via MCP
const balance = await mcpClient.getTokenBalance(
  walletAddress,
  tokenAddress,
  'ethereum'
);

// Example: Analyze whale movements
const whaleTransfers = await mcpClient.getTokenTransfersByAccount(
  whaleAddress,
  'ethereum',
  100
);
```

### Supported Nodit APIs

- **Token Data**: Prices, volumes, liquidity
- **Wallet Analysis**: Balances, transfers, activity
- **DeFi Protocols**: Lending rates, pool data
- **Cross-chain Data**: Bridge monitoring, gas prices
- **Real-time Streams**: Whale movements, large transfers

## 🧠 AI Decision Making

### Decision Flow

1. **Market Analysis**: Gather real-time data via Nodit APIs
2. **Risk Assessment**: Evaluate current market conditions
3. **Strategy Generation**: Use GPT-4 to analyze opportunities
4. **Validation**: Check decision against risk parameters
5. **Execution**: Submit transaction via smart contracts
6. **Monitoring**: Track execution and update strategy

### Example AI Decision

```json
{
  "action": "rebalance",
  "fromChain": "Ethereum",
  "toChain": "Polygon", 
  "token": "USDC",
  "amount": "10000",
  "reason": "Aave Polygon USDC yield (8.2%) significantly higher than Ethereum (3.1%). Gas costs justify minimum $10k transfer.",
  "confidence": 0.87,
  "expectedAPY": 8.2,
  "riskLevel": "low"
}
```

## 📊 Monitoring & Analytics

### Real-time Monitoring

- Portfolio performance tracking
- Risk metric calculations (Sharpe ratio, VaR, drawdown)
- Gas cost optimization
- Slippage and MEV protection

### Whale Movement Detection

Automatically monitors and reacts to:
- Large token transfers (>$1M)
- Exchange inflows/outflows
- Institutional wallet activity
- Market maker movements

## 🔐 Security Features

### Smart Contract Security
- OpenZeppelin battle-tested contracts
- Multi-signature wallet support
- Emergency stop mechanisms
- Slippage and MEV protection

### AI Safety
- Confidence threshold requirements
- Risk limit enforcement
- Human override capabilities
- Decision audit trails

### Operational Security
- Private key management
- API key rotation
- Rate limiting
- Error handling and recovery

## 🧪 Testing & Development

### Running Tests

```bash
# AI agent tests
npm run test:ai

# Smart contract tests
forge test

# Frontend tests
npm run test:frontend
```

### Development Mode

```bash
# Start in development mode with hot reloading
npm run dev
```

### Local Testing

1. Start local blockchain: `anvil`
2. Deploy contracts: `npm run deploy -- --network localhost`
3. Start services: `npm run dev`

## 📚 Documentation

### API Reference
- [Nodit Web3 APIs](https://developer.nodit.io/docs/web3-api)
- [Nodit MCP](https://developer.nodit.io/docs/nodit-mcp)
- [Streams & Webhooks](https://developer.nodit.io/docs/webhooks)

### Smart Contract Documentation
- [Contract Interfaces](/contracts/interfaces/)
- [Deployment Guide](/scripts/README.md)
- [Security Considerations](/docs/SECURITY.md)

## 🔧 Configuration

### AI Agent Configuration

```json
{
  "aiConfig": {
    "model": "gpt-4",
    "temperature": 0.3,
    "maxTokens": 2000,
    "systemPrompt": "You are ChainMind, an autonomous DeFi strategist..."
  }
}
```

### Strategy Parameters

```bash
MIN_EVALUATION_INTERVAL=300000  # 5 minutes
MAX_GAS_PRICE=100              # 100 gwei max
MIN_TRANSACTION_VALUE=1000     # $1000 minimum
MAX_SLIPPAGE=1                 # 1% max slippage
```

## 🚨 Emergency Procedures

### Emergency Stop
```bash
# Via API
curl -X POST http://localhost:3001/api/emergency/stop

# Via Dashboard
Visit dashboard → Emergency Stop button
```

### Manual Override
All AI decisions can be overridden through the dashboard or direct smart contract interaction.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Development Guidelines
- Write comprehensive tests
- Follow TypeScript/Solidity best practices
- Document all new features
- Ensure security reviews for smart contracts

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nodit](https://nodit.io) for Web3 APIs and MCP framework
- [OpenZeppelin](https://openzeppelin.com) for smart contract security
- [Foundry](https://getfoundry.sh) for smart contract development
- [OpenAI](https://openai.com) for GPT-4 integration

## 📞 Support

- 📧 Email: support@chainmind.ai
- 💬 Discord: [ChainMind Community](https://discord.gg/chainmind)
- 🐦 Twitter: [@ChainMindAI](https://twitter.com/ChainMindAI)
- 📚 Docs: [docs.chainmind.ai](https://docs.chainmind.ai)

---

**⚠️ Disclaimer**: ChainMind is experimental software. Use at your own risk. Always test thoroughly on testnets before mainnet deployment. Not financial advice.

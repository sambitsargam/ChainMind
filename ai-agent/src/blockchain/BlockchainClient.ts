import { ethers } from 'ethers';
import { Logger } from '../utils/Logger';

export interface BlockchainConfig {
    networks: Record<string, string>;
    privateKey: string;
}

export interface TransactionResult {
    hash: string;
    gasUsed: number;
    gasPrice: string;
    success: boolean;
    blockNumber?: number;
}

export class BlockchainClient {
    private providers: Record<string, ethers.JsonRpcProvider>;
    private signers: Record<string, ethers.Wallet>;
    private logger: Logger;
    private config: BlockchainConfig;

    // Contract ABIs
    private vaultABI = [
        "function executeRebalance(address token, address fromStrategy, address toStrategy, uint256 amount, string memory reason, bytes32 aiDecisionHash) external returns (bytes32)",
        "function tokenBalances(address token) external view returns (uint256)",
        "function getActiveStrategies() external view returns (address[] memory)",
        "function getSupportedTokens() external view returns (address[] memory)"
    ];

    private executorABI = [
        "function executeAIDecision(string memory action, string memory fromChain, string memory toChain, address token, uint256 amount, string memory reason, address targetProtocol, bytes memory executionData) external returns (bytes32)",
        "function authorizeAIAgent(address agent, bool authorized) external",
        "function getAIDecision(bytes32 decisionId) external view returns (tuple(string action, string fromChain, string toChain, address token, uint256 amount, string reason, uint256 timestamp, address targetProtocol, bytes executionData))"
    ];

    constructor(config: BlockchainConfig) {
        this.config = config;
        this.logger = new Logger('BlockchainClient');
        this.providers = {};
        this.signers = {};

        this.initializeProviders();
    }

    private initializeProviders(): void {
        for (const [network, rpcUrl] of Object.entries(this.config.networks)) {
            try {
                this.providers[network] = new ethers.JsonRpcProvider(rpcUrl);
                this.signers[network] = new ethers.Wallet(this.config.privateKey, this.providers[network]);
                this.logger.info(`Initialized provider for ${network}`);
            } catch (error) {
                this.logger.error(`Failed to initialize provider for ${network}:`, error);
            }
        }
    }

    async getProvider(network: string): Promise<ethers.JsonRpcProvider> {
        const provider = this.providers[network];
        if (!provider) {
            throw new Error(`Provider not configured for network: ${network}`);
        }
        return provider;
    }

    async getSigner(network: string): Promise<ethers.Wallet> {
        const signer = this.signers[network];
        if (!signer) {
            throw new Error(`Signer not configured for network: ${network}`);
        }
        return signer;
    }

    async getVaultContract(vaultAddress: string, network: string): Promise<ethers.Contract> {
        const signer = await this.getSigner(network);
        return new ethers.Contract(vaultAddress, this.vaultABI, signer);
    }

    async getExecutorContract(executorAddress: string, network: string): Promise<ethers.Contract> {
        const signer = await this.getSigner(network);
        return new ethers.Contract(executorAddress, this.executorABI, signer);
    }

    async executeRebalance(
        vaultAddress: string,
        network: string,
        params: {
            token: string;
            fromStrategy: string;
            toStrategy: string;
            amount: string;
            reason: string;
            aiDecisionHash: string;
        }
    ): Promise<TransactionResult> {
        try {
            this.logger.info(`Executing rebalance on ${network}`, params);

            const vault = await this.getVaultContract(vaultAddress, network);
            
            const tx = await vault.executeRebalance(
                params.token,
                params.fromStrategy,
                params.toStrategy,
                ethers.parseUnits(params.amount, 18), // Assuming 18 decimals
                params.reason,
                params.aiDecisionHash
            );

            const receipt = await tx.wait();

            return {
                hash: receipt.hash,
                gasUsed: receipt.gasUsed.toString(),
                gasPrice: tx.gasPrice.toString(),
                success: receipt.status === 1,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            this.logger.error('Error executing rebalance:', error);
            throw error;
        }
    }

    async executeAIDecision(
        executorAddress: string,
        network: string,
        params: {
            action: string;
            fromChain: string;
            toChain: string;
            token: string;
            amount: string;
            reason: string;
            targetProtocol: string;
            executionData: string;
        }
    ): Promise<TransactionResult> {
        try {
            this.logger.info(`Executing AI decision on ${network}`, params);

            const executor = await this.getExecutorContract(executorAddress, network);
            
            const tx = await executor.executeAIDecision(
                params.action,
                params.fromChain,
                params.toChain,
                params.token,
                ethers.parseUnits(params.amount, 18),
                params.reason,
                params.targetProtocol,
                params.executionData
            );

            const receipt = await tx.wait();

            return {
                hash: receipt.hash,
                gasUsed: receipt.gasUsed.toString(),
                gasPrice: tx.gasPrice.toString(),
                success: receipt.status === 1,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            this.logger.error('Error executing AI decision:', error);
            throw error;
        }
    }

    async getTokenBalance(
        tokenAddress: string,
        walletAddress: string,
        network: string
    ): Promise<string> {
        try {
            const provider = await this.getProvider(network);
            
            if (tokenAddress === ethers.ZeroAddress) {
                // Native token balance
                const balance = await provider.getBalance(walletAddress);
                return ethers.formatEther(balance);
            } else {
                // ERC20 token balance
                const tokenABI = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)"
                ];
                
                const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
                const [balance, decimals] = await Promise.all([
                    tokenContract.balanceOf(walletAddress),
                    tokenContract.decimals()
                ]);
                
                return ethers.formatUnits(balance, decimals);
            }
        } catch (error) {
            this.logger.error(`Error getting token balance for ${tokenAddress}:`, error);
            throw error;
        }
    }

    async getGasPrice(network: string): Promise<string> {
        try {
            const provider = await this.getProvider(network);
            const gasPrice = await provider.getGasPrice();
            return ethers.formatUnits(gasPrice, 'gwei');
        } catch (error) {
            this.logger.error(`Error getting gas price for ${network}:`, error);
            throw error;
        }
    }

    async estimateGas(
        contractAddress: string,
        network: string,
        method: string,
        params: any[]
    ): Promise<string> {
        try {
            const signer = await this.getSigner(network);
            const contract = new ethers.Contract(contractAddress, this.executorABI, signer);
            
            const gasEstimate = await contract[method].estimateGas(...params);
            return gasEstimate.toString();
        } catch (error) {
            this.logger.error(`Error estimating gas for ${method}:`, error);
            throw error;
        }
    }

    async waitForTransaction(
        hash: string,
        network: string,
        confirmations: number = 1
    ): Promise<ethers.TransactionReceipt | null> {
        try {
            const provider = await this.getProvider(network);
            return await provider.waitForTransaction(hash, confirmations);
        } catch (error) {
            this.logger.error(`Error waiting for transaction ${hash}:`, error);
            throw error;
        }
    }

    async getVaultInfo(vaultAddress: string, network: string): Promise<any> {
        try {
            const vault = await this.getVaultContract(vaultAddress, network);
            
            const [activeStrategies, supportedTokens] = await Promise.all([
                vault.getActiveStrategies(),
                vault.getSupportedTokens()
            ]);

            return {
                activeStrategies,
                supportedTokens,
                address: vaultAddress,
                network
            };
        } catch (error) {
            this.logger.error(`Error getting vault info for ${vaultAddress}:`, error);
            throw error;
        }
    }

    async getNetworkInfo(network: string): Promise<any> {
        try {
            const provider = await this.getProvider(network);
            const [blockNumber, gasPrice] = await Promise.all([
                provider.getBlockNumber(),
                provider.getGasPrice()
            ]);

            return {
                network,
                blockNumber,
                gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
                chainId: (await provider.getNetwork()).chainId.toString()
            };
        } catch (error) {
            this.logger.error(`Error getting network info for ${network}:`, error);
            throw error;
        }
    }
}

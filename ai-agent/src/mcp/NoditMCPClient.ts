import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/Logger';

export interface NoditMCPConfig {
    apiKey: string;
    baseUrl: string;
}

export interface TokenData {
    price: number;
    liquidity: number;
    volume24h: number;
    marketCap?: number;
    priceChange24h?: number;
}

export interface LendingRates {
    supplyAPY: number;
    borrowAPY: number;
    utilization: number;
    totalSupply: number;
    totalBorrow: number;
}

export interface TokenBalance {
    address: string;
    balance: string;
    decimals: number;
    symbol: string;
    name: string;
}

export interface TokenTransfer {
    hash: string;
    from: string;
    to: string;
    value: string;
    token: string;
    timestamp: number;
    blockNumber: number;
}

export class NoditMCPClient {
    private api: AxiosInstance;
    private logger: Logger;
    private config: NoditMCPConfig;

    constructor(config: NoditMCPConfig) {
        this.config = config;
        this.logger = new Logger('NoditMCPClient');
        
        this.api = axios.create({
            baseURL: config.baseUrl,
            timeout: 30000,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.api.interceptors.request.use(
            (config) => {
                this.logger.debug(`Making request to ${config.url}`);
                return config;
            },
            (error) => {
                this.logger.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                this.logger.debug(`Response from ${response.config.url}: ${response.status}`);
                return response;
            },
            (error) => {
                this.logger.error(`Response error from ${error.config?.url}:`, error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    async getTokenBalance(address: string, tokenAddress: string, chain: string): Promise<TokenBalance> {
        try {
            const response = await this.api.get(`/v1/tokens/balance`, {
                params: {
                    address,
                    token: tokenAddress,
                    chain
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting token balance for ${address}:`, error);
            throw error;
        }
    }

    async getTokenTransfersByAccount(
        address: string, 
        chain: string, 
        limit: number = 100
    ): Promise<TokenTransfer[]> {
        try {
            const response = await this.api.get(`/v1/tokens/transfers`, {
                params: {
                    address,
                    chain,
                    limit
                }
            });
            return response.data.transfers || [];
        } catch (error) {
            this.logger.error(`Error getting token transfers for ${address}:`, error);
            throw error;
        }
    }

    async getTokenData(tokenAddress: string, chain: string): Promise<TokenData> {
        try {
            const response = await this.api.get(`/v1/tokens/data`, {
                params: {
                    token: tokenAddress,
                    chain
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting token data for ${tokenAddress}:`, error);
            throw error;
        }
    }

    async getLendingRates(protocol: string, asset: string, chain: string): Promise<LendingRates> {
        try {
            const response = await this.api.get(`/v1/defi/lending/rates`, {
                params: {
                    protocol,
                    asset,
                    chain
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting lending rates for ${asset}:`, error);
            throw error;
        }
    }

    async getPoolLiquidity(poolAddress: string, chain: string): Promise<any> {
        try {
            const response = await this.api.get(`/v1/defi/pools/liquidity`, {
                params: {
                    pool: poolAddress,
                    chain
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting pool liquidity for ${poolAddress}:`, error);
            throw error;
        }
    }

    async getTopPools(chain: string, limit: number = 20): Promise<any[]> {
        try {
            const response = await this.api.get(`/v1/defi/pools/top`, {
                params: {
                    chain,
                    limit
                }
            });
            return response.data.pools || [];
        } catch (error) {
            this.logger.error(`Error getting top pools for ${chain}:`, error);
            throw error;
        }
    }

    async getGasPrice(chain: string): Promise<number> {
        try {
            const response = await this.api.get(`/v1/gas/price`, {
                params: { chain }
            });
            return response.data.gasPrice;
        } catch (error) {
            this.logger.error(`Error getting gas price for ${chain}:`, error);
            throw error;
        }
    }

    async getChainStats(chain: string): Promise<any> {
        try {
            const response = await this.api.get(`/v1/chains/stats`, {
                params: { chain }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting chain stats for ${chain}:`, error);
            throw error;
        }
    }

    async getWalletActivity(address: string, chain: string): Promise<any> {
        try {
            const response = await this.api.get(`/v1/wallets/activity`, {
                params: {
                    address,
                    chain
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error getting wallet activity for ${address}:`, error);
            throw error;
        }
    }

    async subscribeToWhaleTransfers(
        callback: (transfer: TokenTransfer) => void,
        minValue: number = 1000000 // $1M+ transfers
    ): Promise<void> {
        try {
            // This would implement webhook subscription
            // For now, simulate with polling
            this.logger.info(`Subscribing to whale transfers with min value: $${minValue}`);
            
            // Implementation would use Nodit's webhook/stream API
            // setInterval(async () => {
            //     const transfers = await this.getRecentLargeTransfers(minValue);
            //     transfers.forEach(callback);
            // }, 60000); // Check every minute
            
        } catch (error) {
            this.logger.error('Error subscribing to whale transfers:', error);
            throw error;
        }
    }

    private async getRecentLargeTransfers(minValue: number): Promise<TokenTransfer[]> {
        try {
            const response = await this.api.get(`/v1/tokens/transfers/large`, {
                params: {
                    minValue,
                    timeframe: '1h'
                }
            });
            return response.data.transfers || [];
        } catch (error) {
            this.logger.error('Error getting recent large transfers:', error);
            return [];
        }
    }
}

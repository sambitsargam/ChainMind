// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Vault
 * @dev Main vault contract that holds tokens and allows AI-driven rebalancing
 */
contract Vault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct Strategy {
        address target;
        uint256 allocation;
        bool active;
        string description;
    }

    struct RebalanceAction {
        address token;
        address fromStrategy;
        address toStrategy;
        uint256 amount;
        string reason;
        uint256 timestamp;
        bytes32 aiDecisionHash;
    }

    // State variables
    mapping(address => uint256) public tokenBalances;
    mapping(address => Strategy) public strategies;
    mapping(bytes32 => RebalanceAction) public rebalanceHistory;
    
    address[] public supportedTokens;
    address[] public activeStrategies;
    address public executor;
    
    uint256 public totalRebalances;
    uint256 public constant MAX_STRATEGIES = 10;
    
    // Events
    event TokenDeposited(address indexed token, uint256 amount, address indexed depositor);
    event TokenWithdrawn(address indexed token, uint256 amount, address indexed recipient);
    event StrategyAdded(address indexed strategy, uint256 allocation, string description);
    event StrategyRemoved(address indexed strategy);
    event Rebalanced(
        bytes32 indexed actionId,
        address indexed token,
        address fromStrategy,
        address toStrategy,
        uint256 amount,
        string reason
    );
    event ExecutorUpdated(address indexed oldExecutor, address indexed newExecutor);

    constructor() {
        // Initialize with owner as the deployer
    }

    modifier onlyExecutor() {
        require(msg.sender == executor, "Only executor can perform this action");
        _;
    }

    /**
     * @dev Set the executor contract address
     */
    function setExecutor(address _executor) external onlyOwner {
        address oldExecutor = executor;
        executor = _executor;
        emit ExecutorUpdated(oldExecutor, _executor);
    }

    /**
     * @dev Deposit tokens into the vault
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(isSupportedToken(token), "Token not supported");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
        
        emit TokenDeposited(token, amount, msg.sender);
    }

    /**
     * @dev Withdraw tokens from the vault (only owner)
     */
    function withdraw(address token, uint256 amount, address recipient) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenBalances[token] >= amount, "Insufficient balance");
        require(recipient != address(0), "Invalid recipient");
        
        tokenBalances[token] -= amount;
        IERC20(token).safeTransfer(recipient, amount);
        
        emit TokenWithdrawn(token, amount, recipient);
    }

    /**
     * @dev Add a new strategy
     */
    function addStrategy(
        address strategy,
        uint256 allocation,
        string memory description
    ) external onlyOwner {
        require(strategy != address(0), "Invalid strategy address");
        require(allocation <= 10000, "Allocation must be <= 100%"); // 10000 = 100%
        require(activeStrategies.length < MAX_STRATEGIES, "Max strategies reached");
        require(!strategies[strategy].active, "Strategy already exists");
        
        strategies[strategy] = Strategy({
            target: strategy,
            allocation: allocation,
            active: true,
            description: description
        });
        
        activeStrategies.push(strategy);
        emit StrategyAdded(strategy, allocation, description);
    }

    /**
     * @dev Remove a strategy
     */
    function removeStrategy(address strategy) external onlyOwner {
        require(strategies[strategy].active, "Strategy not active");
        
        strategies[strategy].active = false;
        
        // Remove from active strategies array
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            if (activeStrategies[i] == strategy) {
                activeStrategies[i] = activeStrategies[activeStrategies.length - 1];
                activeStrategies.pop();
                break;
            }
        }
        
        emit StrategyRemoved(strategy);
    }

    /**
     * @dev Execute rebalancing action (called by AI Executor)
     */
    function executeRebalance(
        address token,
        address fromStrategy,
        address toStrategy,
        uint256 amount,
        string memory reason,
        bytes32 aiDecisionHash
    ) external onlyExecutor nonReentrant returns (bytes32) {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be greater than 0");
        require(tokenBalances[token] >= amount, "Insufficient token balance");
        require(strategies[toStrategy].active, "Target strategy not active");
        
        bytes32 actionId = keccak256(
            abi.encodePacked(
                block.timestamp,
                token,
                fromStrategy,
                toStrategy,
                amount,
                totalRebalances
            )
        );
        
        // Record the rebalance action
        rebalanceHistory[actionId] = RebalanceAction({
            token: token,
            fromStrategy: fromStrategy,
            toStrategy: toStrategy,
            amount: amount,
            reason: reason,
            timestamp: block.timestamp,
            aiDecisionHash: aiDecisionHash
        });
        
        totalRebalances++;
        
        emit Rebalanced(actionId, token, fromStrategy, toStrategy, amount, reason);
        
        return actionId;
    }

    /**
     * @dev Add a supported token
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!isSupportedToken(token), "Token already supported");
        
        supportedTokens.push(token);
    }

    /**
     * @dev Check if a token is supported
     */
    function isSupportedToken(address token) public view returns (bool) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get all active strategies
     */
    function getActiveStrategies() external view returns (address[] memory) {
        return activeStrategies;
    }

    /**
     * @dev Get all supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @dev Get strategy details
     */
    function getStrategy(address strategy) external view returns (Strategy memory) {
        return strategies[strategy];
    }

    /**
     * @dev Get rebalance action details
     */
    function getRebalanceAction(bytes32 actionId) external view returns (RebalanceAction memory) {
        return rebalanceHistory[actionId];
    }

    /**
     * @dev Emergency function to pause all operations
     */
    function emergencyPause() external onlyOwner {
        // Implementation would pause all rebalancing operations
        // This is a safety mechanism for the autonomous system
    }
}

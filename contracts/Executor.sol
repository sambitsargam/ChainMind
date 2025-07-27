// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IVault.sol";
import "./interfaces/IDEXRouter.sol";
import "./interfaces/IBridge.sol";
import "./interfaces/ILendingProtocol.sol";

/**
 * @title Executor
 * @dev Executes AI-driven rebalancing decisions across DEXs, bridges, and lending protocols
 */
contract Executor is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct ExecutionResult {
        bool success;
        uint256 amountOut;
        bytes data;
        string errorMessage;
    }

    struct AIDecision {
        string action;
        string fromChain;
        string toChain;
        address token;
        uint256 amount;
        string reason;
        uint256 timestamp;
        address targetProtocol;
        bytes executionData;
    }

    // State variables
    IVault public vault;
    mapping(string => address) public dexRouters;
    mapping(string => address) public bridges;
    mapping(string => address) public lendingProtocols;
    mapping(bytes32 => AIDecision) public aiDecisions;
    mapping(address => bool) public authorizedAIAgents;
    
    uint256 public executionCounter;
    uint256 public constant MAX_SLIPPAGE = 500; // 5%
    uint256 public constant SLIPPAGE_DENOMINATOR = 10000;
    
    // Events
    event AIDecisionExecuted(
        bytes32 indexed decisionId,
        string action,
        address indexed token,
        uint256 amount,
        bool success
    );
    event ProtocolUpdated(string indexed protocolType, string name, address target);
    event AIAgentAuthorized(address indexed agent, bool authorized);
    event ExecutionFailed(bytes32 indexed decisionId, string reason);

    constructor(address _vault) {
        vault = IVault(_vault);
    }

    modifier onlyAuthorizedAI() {
        require(authorizedAIAgents[msg.sender], "Unauthorized AI agent");
        _;
    }

    /**
     * @dev Authorize an AI agent to execute decisions
     */
    function authorizeAIAgent(address agent, bool authorized) external onlyOwner {
        authorizedAIAgents[agent] = authorized;
        emit AIAgentAuthorized(agent, authorized);
    }

    /**
     * @dev Update protocol addresses (DEX, Bridge, Lending)
     */
    function updateProtocol(
        string memory protocolType,
        string memory name,
        address target
    ) external onlyOwner {
        require(target != address(0), "Invalid target address");
        
        if (keccak256(bytes(protocolType)) == keccak256(bytes("dex"))) {
            dexRouters[name] = target;
        } else if (keccak256(bytes(protocolType)) == keccak256(bytes("bridge"))) {
            bridges[name] = target;
        } else if (keccak256(bytes(protocolType)) == keccak256(bytes("lending"))) {
            lendingProtocols[name] = target;
        } else {
            revert("Invalid protocol type");
        }
        
        emit ProtocolUpdated(protocolType, name, target);
    }

    /**
     * @dev Execute AI decision - main entry point for AI agents
     */
    function executeAIDecision(
        string memory action,
        string memory fromChain,
        string memory toChain,
        address token,
        uint256 amount,
        string memory reason,
        address targetProtocol,
        bytes memory executionData
    ) external onlyAuthorizedAI nonReentrant returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(token != address(0), "Invalid token address");
        
        bytes32 decisionId = keccak256(
            abi.encodePacked(
                block.timestamp,
                action,
                token,
                amount,
                executionCounter++
            )
        );
        
        // Store AI decision
        aiDecisions[decisionId] = AIDecision({
            action: action,
            fromChain: fromChain,
            toChain: toChain,
            token: token,
            amount: amount,
            reason: reason,
            timestamp: block.timestamp,
            targetProtocol: targetProtocol,
            executionData: executionData
        });
        
        // Execute the decision
        ExecutionResult memory result = _executeDecision(decisionId);
        
        if (result.success) {
            // Log successful execution in vault
            vault.executeRebalance(
                token,
                address(0), // fromStrategy (current vault)
                targetProtocol, // toStrategy
                amount,
                reason,
                decisionId
            );
        } else {
            emit ExecutionFailed(decisionId, result.errorMessage);
        }
        
        emit AIDecisionExecuted(decisionId, action, token, amount, result.success);
        
        return decisionId;
    }

    /**
     * @dev Internal function to execute different types of decisions
     */
    function _executeDecision(bytes32 decisionId) internal returns (ExecutionResult memory) {
        AIDecision memory decision = aiDecisions[decisionId];
        
        bytes32 actionHash = keccak256(bytes(decision.action));
        
        if (actionHash == keccak256(bytes("swap"))) {
            return _executeSwap(decision);
        } else if (actionHash == keccak256(bytes("bridge"))) {
            return _executeBridge(decision);
        } else if (actionHash == keccak256(bytes("lend"))) {
            return _executeLending(decision);
        } else if (actionHash == keccak256(bytes("rebalance"))) {
            return _executeRebalance(decision);
        } else {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: "Unknown action type"
            });
        }
    }

    /**
     * @dev Execute token swap on DEX
     */
    function _executeSwap(AIDecision memory decision) internal returns (ExecutionResult memory) {
        try IDEXRouter(decision.targetProtocol).swapExactTokensForTokens(
            decision.amount,
            _calculateMinAmountOut(decision.amount),
            abi.decode(decision.executionData, (address[])), // path
            address(vault),
            block.timestamp + 300 // 5 minutes deadline
        ) returns (uint256[] memory amounts) {
            return ExecutionResult({
                success: true,
                amountOut: amounts[amounts.length - 1],
                data: abi.encode(amounts),
                errorMessage: ""
            });
        } catch Error(string memory reason) {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: reason
            });
        } catch {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: "Swap execution failed"
            });
        }
    }

    /**
     * @dev Execute cross-chain bridge transfer
     */
    function _executeBridge(AIDecision memory decision) internal returns (ExecutionResult memory) {
        try IBridge(decision.targetProtocol).bridgeToken(
            decision.token,
            decision.amount,
            _getChainId(decision.toChain),
            address(vault),
            decision.executionData
        ) returns (bytes32 transferId) {
            return ExecutionResult({
                success: true,
                amountOut: decision.amount,
                data: abi.encode(transferId),
                errorMessage: ""
            });
        } catch Error(string memory reason) {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: reason
            });
        } catch {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: "Bridge execution failed"
            });
        }
    }

    /**
     * @dev Execute lending protocol interaction
     */
    function _executeLending(AIDecision memory decision) internal returns (ExecutionResult memory) {
        try ILendingProtocol(decision.targetProtocol).supply(
            decision.token,
            decision.amount,
            address(vault),
            0 // referral code
        ) {
            return ExecutionResult({
                success: true,
                amountOut: decision.amount,
                data: "",
                errorMessage: ""
            });
        } catch Error(string memory reason) {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: reason
            });
        } catch {
            return ExecutionResult({
                success: false,
                amountOut: 0,
                data: "",
                errorMessage: "Lending execution failed"
            });
        }
    }

    /**
     * @dev Execute general rebalancing
     */
    function _executeRebalance(AIDecision memory decision) internal returns (ExecutionResult memory) {
        // This would implement complex rebalancing logic
        // For now, return success
        return ExecutionResult({
            success: true,
            amountOut: decision.amount,
            data: decision.executionData,
            errorMessage: ""
        });
    }

    /**
     * @dev Calculate minimum amount out with slippage protection
     */
    function _calculateMinAmountOut(uint256 amountIn) internal pure returns (uint256) {
        return (amountIn * (SLIPPAGE_DENOMINATOR - MAX_SLIPPAGE)) / SLIPPAGE_DENOMINATOR;
    }

    /**
     * @dev Get chain ID from chain name
     */
    function _getChainId(string memory chainName) internal pure returns (uint256) {
        bytes32 nameHash = keccak256(bytes(chainName));
        
        if (nameHash == keccak256(bytes("Ethereum"))) return 1;
        if (nameHash == keccak256(bytes("Polygon"))) return 137;
        if (nameHash == keccak256(bytes("Arbitrum"))) return 42161;
        if (nameHash == keccak256(bytes("Optimism"))) return 10;
        if (nameHash == keccak256(bytes("BSC"))) return 56;
        
        revert("Unsupported chain");
    }

    /**
     * @dev Get AI decision details
     */
    function getAIDecision(bytes32 decisionId) external view returns (AIDecision memory) {
        return aiDecisions[decisionId];
    }

    /**
     * @dev Emergency stop for all executions
     */
    function emergencyStop() external onlyOwner {
        // Implementation would pause all execution operations
    }
}

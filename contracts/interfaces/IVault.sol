// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVault {
    function executeRebalance(
        address token,
        address fromStrategy,
        address toStrategy,
        uint256 amount,
        string memory reason,
        bytes32 aiDecisionHash
    ) external returns (bytes32);
    
    function tokenBalances(address token) external view returns (uint256);
    function deposit(address token, uint256 amount) external;
    function withdraw(address token, uint256 amount, address recipient) external;
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILendingProtocol {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;
    
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
    
    function getSupplyRate(address asset) external view returns (uint256);
}

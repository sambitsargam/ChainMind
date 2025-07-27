// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBridge {
    function bridgeToken(
        address token,
        uint256 amount,
        uint256 destinationChainId,
        address recipient,
        bytes calldata data
    ) external returns (bytes32 transferId);
}

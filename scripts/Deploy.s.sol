// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/Vault.sol";
import "../contracts/Executor.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Vault
        Vault vault = new Vault();
        console.log("Vault deployed to:", address(vault));

        // Deploy Executor
        Executor executor = new Executor(address(vault));
        console.log("Executor deployed to:", address(executor));

        // Set executor in vault
        vault.setExecutor(address(executor));
        console.log("Executor set in vault");

        // Add some supported tokens (example addresses)
        address USDC = 0xA0b86a33E6441b8D36c7E54E0eED0b3c6EFb3Fcf; // Mainnet USDC
        address WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // Mainnet WETH
        
        vault.addSupportedToken(USDC);
        vault.addSupportedToken(WETH);
        console.log("Added supported tokens");

        // Add a sample strategy (placeholder address)
        vault.addStrategy(
            0x1234567890123456789012345678901234567890,
            5000, // 50% allocation
            "Aave USDC Strategy"
        );
        console.log("Added sample strategy");

        vm.stopBroadcast();
    }
}

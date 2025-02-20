// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/YourContract.sol";
import "../contracts/RLUSDFundPool.sol"; 

/**
 * @notice Deploy script for YourContract contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployYourContract.s.sol  # local anvil chain
 * yarn deploy --file DeployYourContract.s.sol --network optimism # live network (requires keystore)
 */
contract DeployYourContract is ScaffoldETHDeploy {
    /**
     * @dev Deployer setup based on `ETH_KEYSTORE_ACCOUNT` in `.env`:
     *      - "scaffold-eth-default": Uses Anvil's account #9 (0xa0Ee7A142d267C1f36714E4a8F75612F20a79720), no password prompt
     *      - "scaffold-eth-custom": requires password used while creating keystore
     *
     * Note: Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and fund it
     *      - Export contract addresses & ABIs to `nextjs` packages
     */
    function run() external ScaffoldEthDeployerRunner {
        new RLUSDFundPool{value: 0.0005 ether}(0xDd24F84d36BF92C65F92307595335bdFab5Bbd21, 0xe101FB315a64cDa9944E570a7bFfaFE60b994b1D);
    }
}

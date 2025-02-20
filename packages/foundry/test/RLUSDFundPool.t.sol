// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/RLUSDFundPool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

// 模拟RLUSD代币
contract MockRLUSD is ERC20 {
    constructor() ERC20("RLUSD", "RLUSD") {
        _mint(msg.sender, 1000000 * 10**18); // 铸造100万个代币
    }
}

// 模拟Pyth预言机
contract MockPyth {
    function getPrice(bytes32 priceId) external pure returns (PythStructs.Price memory) {
        revert("Not implemented");
    }

    function getEmaPrice(bytes32 priceId) external pure returns (PythStructs.Price memory) {
        revert("Not implemented");
    }

    function getPriceNoOlderThan(bytes32 priceId, uint256) external returns (PythStructs.Price memory) {
        if (priceId == 0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5) {
            // RLUSD/USD price: 1.00000
            return PythStructs.Price({
                price: 99982800,
                conf: 76,
                expo: -8,
                publishTime: uint64(block.timestamp)
            });
        } else {
            // Target currency price: 7.77739
            return PythStructs.Price({
                price: 777739,
                conf: 76,
                expo: -5,
                publishTime: uint64(block.timestamp)
            });
        }
    }

    function getUpdateFee(bytes[] calldata) external pure returns (uint256) {
        return 0;
    }

    function updatePriceFeeds(bytes[] calldata) external payable {
        // 什么都不做
    }

    function updatePriceFeedsIfNecessary(
        bytes[] calldata,
        bytes32[] calldata,
        uint64[] calldata
    ) external payable {
        revert("Not implemented");
    }
}

contract RLUSDFundPoolTest is Test {
    RLUSDFundPool public pool;
    MockRLUSD public rlusd;
    MockPyth public pyth;
    address public user = address(1);

    function setUp() public {
        // 部署合约
        pyth = new MockPyth();
        rlusd = new MockRLUSD();
        pool = new RLUSDFundPool(address(pyth), address(rlusd));

        // 给测试用户转一些RLUSD
        rlusd.transfer(user, 1000 * 10**18); // 转1000 RLUSD给用户

        // 模拟用户
        vm.startPrank(user);
        // 授权池子合约使用RLUSD
        rlusd.approve(address(pool), type(uint256).max);
        vm.stopPrank();
    }

    function testSubmitFunding() public {
        // 准备测试数据
        bytes32 targetCurrencyId = bytes32(uint256(1));
        uint256 targetAmount = 3150; // 3.15 * 1000
        bytes[] memory priceUpdate = new bytes[](0);

        // 记录初始余额
        uint256 initialBalance = rlusd.balanceOf(user);
        uint256 initialPoolBalance = rlusd.balanceOf(address(pool));

        // 模拟用户调用
        vm.startPrank(user);
        pool.submitFunding(targetCurrencyId, targetAmount, priceUpdate);
        vm.stopPrank();

        // 验证结果
        // 计算预期值：
        // (3.15 / 7.77739) * 0.99 ≈ 0.401 RLUSD
        uint256 expectedRlusd = 400979538122665390; // 0.400979538122665390 RLUSD
        uint256 tolerance = 0.001 * 10**18; // 允许0.001 RLUSD的误差

        uint256 actualPoolBalance = rlusd.balanceOf(address(pool));
        uint256 actualTransferred = actualPoolBalance - initialPoolBalance;

        console.log("Expected RLUSD:", expectedRlusd);
        console.log("Actual transferred:", actualTransferred);

        // 验证转账金额在预期范围内
        assertApproxEqAbs(
            actualTransferred,
            expectedRlusd,
            tolerance,
            "Transferred RLUSD amount should be approximately 0.401 RLUSD"
        );

        // 验证用户余额减少了相应金额
        assertEq(
            rlusd.balanceOf(user),
            initialBalance - actualTransferred,
            "User balance should be reduced by the transferred amount"
        );
    }

    // 添加一个辅助函数来打印价格计算的中间值
    function testPriceCalculation() public view {
        uint256 targetAmount = 3150; // 3.15 * 1000
        uint256 baseAmount = targetAmount * 1e15; // 转换为wei单位
        console.log("Base amount:", baseAmount);
        
        uint256 targetPrice = 777739;
        uint256 rlusdPrice = 100000;
        
        uint256 numerator = baseAmount * rlusdPrice;
        console.log("Numerator:", numerator);
        console.log("Final result:", numerator / targetPrice);
    }
}

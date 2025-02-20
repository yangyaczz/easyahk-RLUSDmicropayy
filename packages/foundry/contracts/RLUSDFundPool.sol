// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RLUSDFundPool is Ownable {
    IPyth public pyth;
    IERC20 public rlusd;
    
    event FundingReceived(
        address indexed sender,
        bytes32 indexed currencyId,
        uint256 rlusdAmount,
        uint256 targetAmount
    );

    bytes32 public constant RLUSD_USD_PRICE_ID = 0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5;
    uint256 private constant TARGET_AMOUNT_DECIMALS = 1000;

    constructor(address pythContract, address rlusdAddress) payable Ownable(msg.sender) {
        pyth = IPyth(pythContract);
        rlusd = IERC20(rlusdAddress);
    }

    function submitFunding(
        bytes32 targetCurrencyPriceId,  // 例如 FX.USD/HKD 的 Price ID
        uint256 targetCurrencyAmount,    // 目标货币金额 * 1000
        bytes[] calldata priceUpdate
    ) external {
        // 更新价格
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{value: fee}(priceUpdate);

        // 获取 RLUSD/USD 价格
        PythStructs.Price memory rlusdPrice = pyth.getPriceNoOlderThan(RLUSD_USD_PRICE_ID, 300);
        
        // 获取目标货币对USD的价格
        PythStructs.Price memory targetCurrencyPrice = pyth.getPriceNoOlderThan(targetCurrencyPriceId, 300);
        
        if (rlusdPrice.price < 0 || targetCurrencyPrice.price < 0) {
            revert("Negative price not supported");
        }

        // 计算所需的RLUSD数量
        uint256 requiredRlusd = _calculateRequiredRlusd(
            targetCurrencyAmount,
            uint256(uint64(rlusdPrice.price)),
            rlusdPrice.expo,
            uint256(uint64(targetCurrencyPrice.price)),
            targetCurrencyPrice.expo
        );
        
        require(rlusd.transferFrom(msg.sender, address(this), requiredRlusd), "Transfer failed");
        
        emit FundingReceived(msg.sender, targetCurrencyPriceId, requiredRlusd, targetCurrencyAmount);
    }

    function _calculateRequiredRlusd(
        uint256 targetAmount,        // 用户输入金额 * 1000
        uint256 rlusdPrice,         // RLUSD/USD 价格 (99982800)
        int32 rlusdExpo,           // RLUSD/USD 指数 (-8)
        uint256 targetPrice,        // 目标货币/USD 价格 (777739)
        int32 targetExpo           // 目标货币/USD 指数 (-5)
    ) internal pure returns (uint256) {
        // 将 targetAmount 转换为基础单位（除以1000）
        uint256 baseAmount = targetAmount * 1e15;  // 1e18 / 1000

        // 由于两个价格的指数不同，需要将它们调整到相同的精度
        // 我们选择更高的精度（-8）作为基准
        uint256 adjustedTargetPrice = targetPrice;
        if (targetExpo > rlusdExpo) {
            // 如果目标货币精度较低（-5 > -8），需要增加精度
            uint32 diff = uint32(targetExpo - rlusdExpo); // 3
            adjustedTargetPrice = adjustedTargetPrice * (10 ** diff); // 777739 * 1000
        }

        // 计算: (baseAmount * rlusdPrice) / (targetPrice * 10^(targetExpo - rlusdExpo))
        uint256 result = (baseAmount * rlusdPrice) / adjustedTargetPrice;
        
        // 添加1%的容错
        return (result * 99) / 100;
    }

    function withdrawAllRLUSD() external onlyOwner {
        uint256 balance = rlusd.balanceOf(address(this));
        require(balance > 0, "No RLUSD to withdraw");
        require(rlusd.transfer(owner(), balance), "Transfer failed");
    }

    // 用于接收更新Pyth价格所需的ETH
    receive() external payable {}
}
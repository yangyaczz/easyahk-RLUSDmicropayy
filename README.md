# QR RLUSD MICROPAY

🌐 A decentralized payment solution enabling QR code-based cross-border transactions using RLUSD stablecoin with real-time FX rates from Pyth Oracle 💱

🔍 This project streamlines cross-border micropayments through QR code scanning, powered by smart contracts on Ethereum. Users can scan QR codes containing HKD amounts, which are automatically converted to RLUSD using real-time exchange rates from Pyth Oracle. The system ensures secure and efficient transactions by leveraging blockchain technology and stable digital currencies.

Key Features:
- 📱 Simple QR code scanning interface
- 💰 RLUSD stablecoin integration
- 🔄 Real-time FX rates via Pyth Oracle
- ⚡ Fast and low-cost transactions
- 🔐 Secure smart contract implementation

## Problem Statement & Solution

Traditional cross-border payments face several challenges:
- High transaction fees and currency conversion costs
- Long processing times due to intermediary banks
- Limited transparency in exchange rates
- Complex compliance requirements
- Lack of 24/7 availability

Our solution addresses these pain points through:
- 💫 **Decentralized Architecture**: Built on Ethereum, eliminating intermediary banks
- 💱 **Real-time FX**: Integration with Pyth Oracle for accurate, manipulation-resistant exchange rates
- 🏦 **Stablecoin Usage**: RLUSD provides stability and reduces volatility risks
- 🔄 **Instant Settlement**: Near-immediate transaction finality
- 🌐 **Global Accessibility**: 24/7 operation with consistent service

## Technical Implementation

The system is built using modern Web3 technologies:

### Smart Contracts (Foundry)
- RLUSDFundPool contract manages payment processing and currency conversion
- Integration with Pyth Oracle for real-time price feeds
- Comprehensive test coverage ensuring reliability
- Gas-optimized for cost-effective transactions

### Frontend (Next.js)
- Responsive QR code scanner implementation
- Real-time price updates and conversion display
- Wallet integration via RainbowKit
- User-friendly transaction flow

### Oracle Integration
- Pyth Network provides reliable price feeds for:
  - RLUSD/USD exchange rates
  - HKD/USD exchange rates
- Price update verification ensures data accuracy
- Fallback mechanisms for oracle redundancy

### Security Features
- Multi-layered security approach
- Rate limiting and transaction caps
- Oracle price validation
- Emergency pause functionality
- Comprehensive audit coverage


## Technical Deep Dive 🔬

### Core SDKs & Technologies

#### Pyth Network Integration 🔮
- Direct integration with Pyth Network's price feeds
- Real-time RLUSD/USD and HKD/USD price updates
- Price validation and manipulation resistance
- Implementation using `@pythnetwork/pyth-sdk-solidity`

#### Smart Contract Development 🔗
- Built with Foundry framework for robust testing and deployment
- OpenZeppelin contracts for secure token handling and access control
- Gas-optimized price calculations and currency conversions
- Comprehensive test coverage with Forge

#### Frontend Technologies 📱
- Next.js 13 with App Router for modern React architecture
- RainbowKit for seamless wallet integration
- Wagmi hooks for blockchain interactions
- Real-time QR code scanning using `@yudiel/react-qr-scanner`

### Unique Technical Features

#### Price Feed Implementation 💱
- Dual price feed system for accurate cross-currency calculations
- Price update verification through Pyth's updatePriceFeeds mechanism
- Fallback mechanisms for oracle redundancy

#### Smart Contract Architecture 🏗
- Modular contract design with clear separation of concerns
- Price calculation logic with precision handling
- Safety checks and circuit breakers

#### User Experience Optimizations ⚡
- Step-by-step transaction flow with real-time updates
- Automatic price calculations and currency conversions
- Responsive QR code scanning interface

### Development Tools 🛠
- Foundry for smart contract development and testing
- Hardhat for deployment and verification
- TypeScript for type-safe development
- Prettier and ESLint for code quality
- Vitest for frontend testing

### Security Considerations 🔒
- Multi-layered security approach with OpenZeppelin contracts
- Price feed validation and timeout checks
- Rate limiting and transaction caps
- Emergency pause functionality
- Comprehensive audit coverage

This implementation leverages Pyth Network's unique features:
- High-frequency price updates
- Cross-chain price consistency
- Manipulation resistance
- Multiple price feed redundancy



## Development Guide 🛠

### Testing & Deployment Commands

#### Local Testing

Run specific test file for RLUSDFundPool contract
forge test --match-path test/RLUSDFundPool.t.sol -vv
```bash
forge test --match-path test/RLUSDFundPool.t.sol -vv
```


#### Deployment



Deploy to Sepolia testnet with verbose output
```
yarn deploy --file DeployYourContract.s.sol --network sepolia -vvvv
```
Verify contract on Sepolia
```
yarn verify --network sepolia
```

bash
Approve RLUSD spending for the FundPool contract
Parameters:
- RLUSD token: 0xe101FB315a64cDa9944E570a7bFfaFE60b994b1D
- FundPool contract: 0xA296a2453502eE77F5FdD13E77869e505D3cAdaD
cast send 0xe101FB315a64cDa9944E570a7bFfaFE60b994b1D "approve(address,uint256)" \
0xA296a2453502eE77F5FdD13E77869e505D3cAdaD $(cast max-uint) \
--rpc-url https://sepolia.gateway.tenderly.co \
--private-key xxxxx

### Pyth Oracle Integration

#### Price Feed Endpoints
Get latest price updates for RLUSD/USD and HKD/USD
Price Feed IDs:
- RLUSD/USD: 0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5
- HKD/USD: 0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c
Browser URL
https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5&ids%5B%5D=0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c
CURL command
curl -X GET "https://hermes.pyth.network/v2/updates/price/latest?ids[]=0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5&ids[]=0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c"



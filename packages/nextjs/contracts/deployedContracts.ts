/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    RLUSDFundPool: {
      address: "0xa296a2453502ee77f5fdd13e77869e505d3cadad",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "pythContract",
              type: "address",
              internalType: "address",
            },
            {
              name: "rlusdAddress",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "receive",
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "RLUSD_USD_PRICE_ID",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "pyth",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "contract IPyth",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "renounceOwnership",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "rlusd",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "contract IERC20",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "submitFunding",
          inputs: [
            {
              name: "targetCurrencyPriceId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "targetCurrencyAmount",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "priceUpdate",
              type: "bytes[]",
              internalType: "bytes[]",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "transferOwnership",
          inputs: [
            {
              name: "newOwner",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "withdrawAllRLUSD",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "FundingReceived",
          inputs: [
            {
              name: "sender",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "currencyId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "rlusdAmount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "targetAmount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OwnershipTransferred",
          inputs: [
            {
              name: "previousOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "OwnableInvalidOwner",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "OwnableUnauthorizedAccount",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1739998301.json",
      deploymentScript: "DeployYourContract.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;

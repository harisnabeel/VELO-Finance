require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("dotenv").config();
require("@typechain/hardhat");
require("hardhat-abi-exporter");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("@jarvisnetwork/core-sdk");
// require( "./tasks/deploy");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      chainId: 80001,
      url: process.env.POLYGON_TESTNET_URL,
      accounts: [
        `${process.env.PRIVATE_KEY0}`,
        `${process.env.PRIVATE_KEY1}`,
        `${process.env.PRIVATE_KEY2}`,
        `${process.env.PRIVATE_KEY3}`,
        `${process.env.PRIVATE_KEY4}`,
        `${process.env.PRIVATE_KEY5}`,
        `${process.env.PRIVATE_KEY6}`,
      ],
      gasPrice: 20000000000, // 20 GWEI
      gas: "auto",
    },

    optimismTestnet: {
      chainId: 420,
      url: process.env.OPTIMISM_TESTNET_URL,
      accounts: [
        `${process.env.PRIVATE_KEY0}`,
        `${process.env.PRIVATE_KEY1}`,
        `${process.env.PRIVATE_KEY2}`,
        `${process.env.PRIVATE_KEY3}`,
        `${process.env.PRIVATE_KEY4}`,
        `${process.env.PRIVATE_KEY5}`,
      ],
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    strict: true,
    only: [],
    except: [],
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    // flat: true,
    only: [],
    spacing: 2,
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_API_KEY,
      polygonMumbai: process.env.POLYGON_API_KEY,
    },
  },
};

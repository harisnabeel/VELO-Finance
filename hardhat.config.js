require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("dotenv").config();
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
  etherscan: {
    apiKey: {
 
      polygon: process.env.POLYGON_API_KEY,
      polygonMumbai: process.env.POLYGON_API_KEY,
      
    },
  }
};

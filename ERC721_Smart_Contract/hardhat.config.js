require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config()

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "cancun"
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`].filter(Boolean),
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN
  }
};
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    amoy: {
      url: ALCHEMY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002, // ID du rseau Polygon Amoy Testnet
    }
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  }
};

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
const accounts = privateKey ? [privateKey] : [];

module.exports = {
  solidity: "0.8.24",

  networks: {
    hardhat: {
      chainId: 76081
    },
    sysfi: {
      url: "https://rpc-endpoint.sysfi.network",
      chainId: 76081,
      accounts
    }
  }
};

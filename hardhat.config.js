require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",

  networks: {
    sysfi: {
      url: "https://rpc-endpoint.sysfi.network",
      chainId: 76081
    }
  }
};

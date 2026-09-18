const hre = require("hardhat");

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== 76081) {
    throw new Error("Wrong network. Expected SYSFI testnet 76081, got " + chainId);
  }

  const signers = await hre.ethers.getSigners();

  if (!signers.length) {
    throw new Error(
      "No deployer wallet configured. Check DEPLOYER_PRIVATE_KEY in .env. Never commit or share the private key."
    );
  }

  const deployer = signers[0];

  console.log("Deploying SandyMine from: " + deployer.address);

  const Factory = await hre.ethers.getContractFactory("SandyMine");
  const contract = await Factory.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const balance = await contract.balanceOf(deployer.address);

  console.log("SandyMine deployed to: " + address);
  console.log("Symbol: " + await contract.symbol());
  console.log("Decimals: " + await contract.decimals());
  console.log(
    "Total Supply: " +
      hre.ethers.formatUnits(await contract.TOTAL_SUPPLY(), 18) +
      " SMN"
  );
  console.log(
    "Deployer Balance: " +
      hre.ethers.formatUnits(balance, 18) +
      " SMN"
  );
  console.log(
    "Explorer: https://explorer.sysfi.network/address/" + address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

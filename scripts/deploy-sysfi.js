const hre = require("hardhat");

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== 76081) {
    throw new Error(`Wrong network. Expected SYSFI testnet 76081, got ${chainId}`);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  const Factory = await hre.ethers.getContractFactory("SandyChainHub");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`SandyChainHub deployed to: ${address}`);
  console.log(`Explorer: https://explorer.sysfi.network/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

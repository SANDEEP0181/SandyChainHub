const hre = require("hardhat");

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== 76081) {
    throw new Error(`Wrong network. Expected SYSFI testnet 76081, got ${chainId}`);
  }

  const signers = await hre.ethers.getSigners();
  if (!signers.length) {
    throw new Error(
      "No deployer wallet configured. Create a local .env with DEPLOYER_PRIVATE_KEY. Never commit or share the private key."
    );
  }

  const deployer = signers[0];
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

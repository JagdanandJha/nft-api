const { ethers, upgrades } = require("hardhat");

async function main() {

  const proxyAddress = "PROXY_ADDRESS";

  const NFTV2 = await ethers.getContractFactory("UpgradableNFTV2");

  const upgraded = await upgrades.upgradeProxy(proxyAddress, NFTV2);

  await upgraded.waitForDeployment();

  console.log("Contract upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
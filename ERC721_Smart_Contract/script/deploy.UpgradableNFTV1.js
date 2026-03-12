const { ethers, upgrades } = require("hardhat");

async function main() {

  const NFT = await ethers.getContractFactory("UpgradableNFTV1");

  const nft = await upgrades.deployProxy(
    NFT,
    ["Game Art", "GA"],  
    { initializer: "initialize" }
  );

  await nft.waitForDeployment();

  console.log("Proxy deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
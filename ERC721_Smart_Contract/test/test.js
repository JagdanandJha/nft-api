const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("UpgradableNFT", function () {

  let nft;
  let owner;
  let user1;
  let user2;

  const mintPrice = ethers.parseEther("1");

  beforeEach(async function () {

    [owner, user1, user2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("UpgradableNFTV1");

    nft = await upgrades.deployProxy(
      NFT,
      ["NFT_Game", "GNFT"],
      { initializer: "initialize" }
    );

    await nft.waitForDeployment();
  });

  /*
  -----------------------------
  INITIALIZATION TEST
  -----------------------------
  */

  it("Should initialize correctly", async function () {

    expect(await nft.mintPrice()).to.equal(mintPrice);
    expect(await nft.maxSupply()).to.equal(5);
    expect(await nft.totalMinted()).to.equal(0);

  });

  /*
  -----------------------------
  MINT TEST
  -----------------------------
  */

  it("Should mint NFT successfully", async function () {

    await nft.connect(user1).mint(
      "ipfs://test1.json",
      { value: mintPrice }
    );

    expect(await nft.totalMinted()).to.equal(1);
    expect(await nft.ownerOf(1)).to.equal(user1.address);

  });

  it("Should fail if insufficient payment", async function () {

    await expect(
      nft.connect(user1).mint("ipfs://test.json", {
        value: ethers.parseEther("0.5")
      })
    ).to.be.revertedWith("Insufficient payment");

  });

  it("Should store token URI correctly", async function () {

    await nft.connect(user1).mint(
      "ipfs://meta.json",
      { value: mintPrice }
    );

    expect(await nft.tokenURI(1)).to.equal("ipfs://meta.json");

  });

  /*
  -----------------------------
  MAX SUPPLY TEST
  -----------------------------
  */

  it("Should stop minting after max supply", async function () {

    for (let i = 0; i < 5; i++) {

      await nft.connect(user1).mint(
        "ipfs://meta.json",
        { value: mintPrice }
      );

    }

    await expect(
      nft.connect(user1).mint(
        "ipfs://meta.json",
        { value: mintPrice }
      )
    ).to.be.revertedWith("Max supply reached");

  });

  /*
  -----------------------------
  INCREASE MAX SUPPLY
  -----------------------------
  */

  it("Owner should increase max supply", async function () {

    await nft.increaseMaxSupply(10);

    expect(await nft.maxSupply()).to.equal(10);

  });

  it("Non-owner cannot increase supply", async function () {

    await expect(
      nft.connect(user1).increaseMaxSupply(10)
    ).to.be.reverted;

  });

  /*
  -----------------------------
  UPDATE MINT PRICE
  -----------------------------
  */

  it("Owner should update mint price", async function () {

    const newPrice = ethers.parseEther("2");

    await nft.setMintPrice(newPrice);

    expect(await nft.mintPrice()).to.equal(newPrice);

  });

  it("Non-owner cannot update mint price", async function () {

    await expect(
      nft.connect(user1).setMintPrice(2)
    ).to.be.reverted;

  });

  /*
  -----------------------------
  WITHDRAW TEST
  -----------------------------
  */

  it("Owner should withdraw contract balance", async function () {

    await nft.connect(user1).mint(
      "ipfs://meta.json",
      { value: mintPrice }
    );

    const contractBalance =
      await ethers.provider.getBalance(nft.target);

    expect(contractBalance).to.equal(mintPrice);

    await nft.withdraw();

    const newBalance =
      await ethers.provider.getBalance(nft.target);

    expect(newBalance).to.equal(0);

  });

  it("Non-owner cannot withdraw", async function () {

    await expect(
      nft.connect(user1).withdraw()
    ).to.be.reverted;

  });

  /*
  -----------------------------
  OWNABLE2STEP TEST
  -----------------------------
  */

  it("Ownership transfer should require acceptOwnership", async function () {

    await nft.transferOwnership(user1.address);

    expect(await nft.pendingOwner()).to.equal(user1.address);

    await nft.connect(user1).acceptOwnership();

    expect(await nft.owner()).to.equal(user1.address);

  });

  /*
  -----------------------------
  UPGRADE TEST
  -----------------------------
  */

  it("Should upgrade contract successfully", async function () {

    const NFTv2 = await ethers.getContractFactory("UpgradableNFTV1");

    const upgraded = await upgrades.upgradeProxy(
      nft.target,
      NFTv2
    );

    expect(upgraded.target).to.equal(nft.target);

  });

});
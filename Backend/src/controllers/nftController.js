const nftService = require("../services/nftService");
const { ethers } = require("ethers");

exports.mint = async (req, res, next) => {
  try {
    const { uri, wallet } = req.body;

    const txHash = await nftService.mintNFT(uri, wallet);

    res.json({
      success: true,
      txHash
    });
  } catch (err) {
    next(err);
  }
};

exports.setMintPrice = async (req, res, next) => {
  try {
    const { price } = req.body;

    const txHash = await nftService.setMintPrice(price);

    res.json({
      success: true,
      txHash
    });
  } catch (err) {
    next(err);
  }
};

exports.increaseMaxSupply = async (req, res, next) => {
  try {
    const { newSupply } = req.body;

    const txHash = await nftService.increaseMaxSupply(newSupply);

    res.json({
      success: true,
      txHash
    });
  } catch (err) {
    next(err);
  }
};

exports.totalMinted = async (req, res, next) => {
  try {
    const total = await nftService.totalMinted();

    res.json({ total });
  } catch (err) {
    next(err);
  }
};

exports.mintPrice = async (req, res, next) => {
  try {
    const price = await nftService.mintPrice();
    const priceInMatic = ethers.formatEther(price);

    res.json({ price: `${priceInMatic} MATIC` });
  } catch (err) {
    next(err);
  }
};

exports.withdraw = async (req, res, next) => {
  try {

    const result = await nftService.withdrawFunds();

    res.json({
      success: true,
      ...result
    });

  } catch (err) {
    next(err);
  }
};
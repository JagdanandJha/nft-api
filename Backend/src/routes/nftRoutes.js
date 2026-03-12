const express = require("express");
const router = express.Router();
const controller = require("../controllers/nftController");

router.post("/mint", controller.mint);
router.post("/set-mint-price", controller.setMintPrice);
router.post("/increase-max-supply", controller.increaseMaxSupply);
router.get("/total-minted", controller.totalMinted);
router.get("/mint-price", controller.mintPrice);
router.post("/withdraw", controller.withdraw);

module.exports = router;
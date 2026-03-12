const contract = require("../config/provider");

async function mintNFT(uri, address) {
    const price = await mintPrice();

    const tx = await contract.mint(uri, address, {
        value: price
    });

    const receipt = await tx.wait();

    let tokenId = null;

    for (const log of receipt.logs) {
        try {
            const parsed = contract.interface.parseLog(log);

            if (parsed.name === "Minted") {
                tokenId = parsed.args.tokenId.toString();
            }

        } catch (err) {
            continue;
        }
    }

    return {
        txHash: tx.hash,
        tokenId
    };
}

async function setMintPrice(price) {
    const tx = await contract.setMintPrice(price);

    await tx.wait();

    return tx.hash;
}

async function increaseMaxSupply(newSupply) {
    const tx = await contract.increaseMaxSupply(newSupply);

    await tx.wait();

    return tx.hash;
}

async function totalMinted() {
    const total = await contract.totalMinted();
    return total.toString();
}

async function mintPrice() {
    return await contract.mintPrice();
}

async function withdrawFunds() {

  const tx = await contract.withdraw();

  const receipt = await tx.wait();

  return {
    txHash: tx.hash
  };
}

module.exports = {
    mintNFT,
    setMintPrice,
    increaseMaxSupply,
    totalMinted,
    mintPrice,
    withdrawFunds
};
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const abi = require("./contractABI.json");

const app = express();
app.use(cors());
app.use(express.json());

const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; 

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(
 CONTRACT_ADDRESS,
  abi,
  wallet
);

app.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
});

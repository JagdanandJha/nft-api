# NFT Minting API

A REST API backend for minting and managing NFTs on the Ethereum Sepolia testnet (or Polygon/MATIC network), built with Node.js and Ethers.js.

---

## 📁 Project Structure

```
project/
├── controllers/
│   └── nftController.js     # Route handler logic
├── services/
│   └── nftService.js        # Smart contract interactions
├── routes/
│   └── nftRoutes.js         # Express route definitions
├── .env                     # Environment variables
└── server.js                # Entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
CONTRACT_ADDRESS=0x481DC41C99e9571946EE07d9ec40CABC672E92cB
PRIVATE_KEY=0x<your_private_key>
RPC_URL=https://sepolia.infura.io/v3/<your_infura_project_id>
PORT=5000
```

| Variable           | Description                                      |
|--------------------|--------------------------------------------------|
| `CONTRACT_ADDRESS` | Deployed NFT smart contract address              |
| `PRIVATE_KEY`      | Wallet private key used to sign transactions     |
| `RPC_URL`          | Infura (or other) RPC endpoint for Sepolia       |
| `PORT`             | Port the Express server runs on (default: 5000)  |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- An Infura account (or another RPC provider)
- A funded wallet on the Sepolia testnet

### Installation

```bash
git clone https://github.com/JagdanandJha/nft-api.git
cd nft-api
npm install
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## 📡 API Endpoints

### `POST /mint`

Mints a new NFT to a specified wallet.

**Request Body:**
```json
{
  "uri": "ipfs://your-metadata-uri",
  "wallet": "0xRecipientWalletAddress"
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x..."
}
```

---

### `GET /mint-price`

Returns the current minting price.

**Response:**
```json
{
  "price": "0.01 MATIC"
}
```

---

### `GET /total-minted`

Returns the total number of NFTs minted so far.

**Response:**
```json
{
  "total": 42
}
```

---

### `POST /set-mint-price`

Updates the mint price (owner only).

**Request Body:**
```json
{
  "price": "10000000000000000"
}
```
> Price is in wei (e.g., `10000000000000000` = 0.01 ETH/MATIC)

**Response:**
```json
{
  "success": true,
  "txHash": "0x..."
}
```

---

### `POST /increase-max-supply`

Increases the maximum NFT supply (owner only).

**Request Body:**
```json
{
  "newSupply": 1000
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x..."
}
```

---

### `POST /withdraw`

Withdraws contract funds to the owner wallet (owner only).

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "amount": "..."
}
```

---

## 🛠️ Dependencies

| Package    | Purpose                                      |
|------------|----------------------------------------------|
| `express`  | HTTP server and routing                      |
| `ethers`   | Ethereum/EVM blockchain interactions         |
| `dotenv`   | Environment variable management              |

---

```bash
echo ".env" >> .gitignore
```

---

## 📄 License

MIT
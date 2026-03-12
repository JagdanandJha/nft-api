const express = require("express");
const cors = require("cors");
const nftRoutes = require("./routes/nftRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/nft", nftRoutes);

app.use(errorHandler);

module.exports = app;
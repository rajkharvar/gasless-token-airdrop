import {
  DefenderRelaySigner,
  DefenderRelayProvider,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const TOKEN_DROP_ADDRESS = process.env.TOKEN_DROP_ADDRESS;

import TokenDrop from "../../abi/TokenDrop.json";

export default async function handler(req, res) {
  console.time("req");
  const { signature, address } = req.query;
  const credentials = {
    apiKey: API_KEY,
    apiSecret: API_SECRET,
  };

  const provider = new DefenderRelayProvider(credentials);
  const relaySigner = new DefenderRelaySigner(credentials, provider, {
    speed: "fastest",
  });

  const tokenDrop = new ethers.Contract(
    TOKEN_DROP_ADDRESS,
    TokenDrop.abi,
    relaySigner
  );
  const tx = await tokenDrop.airdrop(address, signature);
  console.timeEnd("req");
  res.status(200).json({ ...tx });
}

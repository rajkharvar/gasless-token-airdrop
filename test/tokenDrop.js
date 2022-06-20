const { expect } = require("chai");
const { ethers } = require("hardhat");

const RELAYER_ADDRESS = "0x194c30ff10852274bf0dedb982932df2104eb0e8";
const message =
  "Sign the message to claim the 10 GLTKN token without spending gas fees.";

describe("Tokendrop", function () {
  it("should deploy the contract and shouold be correct", async function () {
    const TokenDrop = await ethers.getContractFactory("TokenDrop");
    const tokenDrop = await TokenDrop.deploy(RELAYER_ADDRESS);
    await tokenDrop.deployed();

    const [admin, signer1] = await ethers.getSigners();
    let messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
    let signature = await admin.signMessage(ethers.utils.arrayify(messageHash));

    await tokenDrop.airdrop(admin.address, signature);
  });
});

const hre = require("hardhat");

const RELAYER_ADDRESS = "0x194c30ff10852274bf0dedb982932df2104eb0e8";

async function main() {
  const TokenDrop = await hre.ethers.getContractFactory("TokenDrop");
  const tokenDrop = await TokenDrop.deploy(RELAYER_ADDRESS);

  await tokenDrop.deployed();

  console.log("Tokendrop contract deployed at: ", tokenDrop.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

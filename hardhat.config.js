require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const MUMBAI_PROVIDER_URL = process.env.MUMBAI_PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: MUMBAI_PROVIDER_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

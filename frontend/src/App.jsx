import { Button, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import {
  DefenderRelaySigner,
  DefenderRelayProvider,
} from "defender-relay-client/lib/ethers";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;
const TOKEN_DROP_ADDRESS = import.meta.env.VITE_TOKEN_DROP_ADDRESS;

import TokenDrop from "./abi/TokenDrop.json";

function App() {
  const { data } = useAccount();
  const { data: signer } = useSigner();

  const MESSAGE =
    "Sign the message to claim the 10 GLTKN token without spending gas fees.";

  const signMessage = async () => {
    try {
      const messageHash = ethers.utils.solidityKeccak256(["string"], [MESSAGE]);
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );
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
      const tx = await tokenDrop.airdrop(data.address, signature);
      await tx.wait();

      console.log("tx");
      console.log(tx);
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  };

  return (
    <VStack mt={2}>
      <Flex alignItems="flex-end" justifyContent="flex-end">
        <ConnectButton />
      </Flex>
      <Heading>Gasless Token aidrop</Heading>
      <Text>
        Sign the message to receive 10 GLTKN without paying for gas fees
      </Text>
      <Button disabled={!data} colorScheme="blue" onClick={() => signMessage()}>
        Sign Message
      </Button>
    </VStack>
  );
}

export default App;

import { Heading, VStack, Flex, Button, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { useState } from "react";

const MESSAGE =
  "Sign the message to claim the 10 GLTKN token without spending gas fees.";

export default function Home() {
  const { data } = useAccount();
  const { data: signer } = useSigner();
  const [isWindow, setIsWindow] = useState(typeof window !== "undefined");

  const signMessage = async () => {
    try {
      const messageHash = ethers.utils.solidityKeccak256(["string"], [MESSAGE]);
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );

      const res = await fetch(
        `/api/verify?address=${data.address}&signature=${signature}`
      );
      console.log("res");
      console.log(res);
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

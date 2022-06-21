import {
  Heading,
  VStack,
  Flex,
  Button,
  Text,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContract, useSigner } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import TokenDrop from "../abi/TokenDrop.json";

const TOKEN_DROP_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_DROP_ADDRESS;

const MESSAGE =
  "Sign the message to claim the 10 GLTKN token without spending gas fees.";

export default function Home() {
  const { data } = useAccount();
  const { data: signer } = useSigner();
  const toast = useToast();

  const [balance, setBalance] = useState(0);

  const fetchTokenBalance = async () => {
    try {
      const tokenDrop = new ethers.Contract(
        TOKEN_DROP_ADDRESS,
        TokenDrop.abi,
        signer
      );
      const balance = await tokenDrop.balanceOf(data.address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log("error occured while fetching token balance");
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.address && typeof window !== "undefined") {
      fetchTokenBalance();
    }
  }, [data]);

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
      if (error.code === 4001) {
        toast({
          status: "error",
          title: "Request failed",
          description: error.message,
        });
      }
      console.log(error);
    }
  };
  return (
    <VStack mt={2}>
      <Flex alignSelf="flex-end" p={4}>
        <ConnectButton />
      </Flex>
      <Heading>Gasless Token aidrop</Heading>
      <Badge colorScheme="teal" fontSize="lg">
        {balance} GLTKN
      </Badge>
      <Text>
        Sign the message to receive 10 GLTKN without paying for gas fees
      </Text>
      <Button disabled={!data} colorScheme="blue" onClick={() => signMessage()}>
        Sign Message
      </Button>
    </VStack>
  );
}

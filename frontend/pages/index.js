import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";

import TokenDrop from "../abi/TokenDrop.json";

const TOKEN_DROP_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_DROP_ADDRESS;

const MESSAGE =
  "Sign the message to claim the 10 GLTKN token without spending gas fees.";

export default function Home() {
  const { data } = useAccount();
  const { data: signer } = useSigner();
  const toast = useToast();
  const { activeChain } = useNetwork();

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokenBalance = async () => {
    console.log("fetching balance");
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
      setIsLoading(true);
      const messageHash = ethers.utils.solidityKeccak256(["string"], [MESSAGE]);
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );

      const res = await axios.get(
        `/api/verify?address=${data.address}&signature=${signature}`
      );

      toast({
        status: "info",
        title: "Transaction submitted",
        description: (
          <>
            <Link
              href={`${activeChain.blockExplorers.default.url}/tx/${res.data.hash}`}
              isExternal
            >
              Check transaction on explorer <ExternalLinkIcon mx="2px" />
            </Link>
          </>
        ),
      });

      setTimeout(() => {
        fetchTokenBalance();
      }, 20000);
      console.log("res");
      console.log(res.data);
    } catch (error) {
      if (error.code === 4001) {
        toast({
          status: "error",
          title: "Request failed",
          description: error.message,
        });
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <VStack mt={2}>
      <HStack alignSelf="flex-end" p={4}>
        <Badge colorScheme="teal" fontSize="lg" mr={4} borderRadius="lg">
          {balance} GLTKN
        </Badge>
        <ConnectButton />
      </HStack>
      <Heading>Gasless Token aidrop</Heading>
      <Text>
        Sign the message to receive 10 GLTKN without paying for gas fees
      </Text>
      <Button
        disabled={!data || isLoading}
        colorScheme="blue"
        onClick={() => signMessage()}
        isLoading={isLoading}
      >
        Sign Message
      </Button>
    </VStack>
  );
}

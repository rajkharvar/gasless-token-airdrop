# Gasless Token Airdrop

Airdrop tokens to the end user without charging for gas fees.

## Working

1. User signs the message signature request on frontend.
2. A request is made by frontend to API which sends address logged in metamask and signature.
3. API server makes request to [Relay](https://docs.openzeppelin.com/defender/relay)
4. Relay makes call to contract which internally validate the signature and airdrops 10 GSTKN to the address.

TokenDrop contract address (Mumbai): 0x0cc4A47D26c67e720446B5d5F82E1A501471967e

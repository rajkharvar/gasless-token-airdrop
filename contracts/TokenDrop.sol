//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract TokenDrop is ERC20 {
    using ECDSA for bytes32;
    address public admin;
    address public relayerAddress;

    string constant message =
        "Sign the message to claim the 10 GLTKN token without spending gas fees.";
    bytes32 public signedMessage;

    constructor(address _relayAddress) ERC20("Gasless Token", "GLTKN") {
        _mint(_relayAddress, 1000000 * 10**18);
        _mint(msg.sender, 1000000 * 10**18);
        admin = msg.sender;
        relayerAddress = _relayAddress;

        signedMessage = keccak256(abi.encodePacked(message));
    }

    function airdrop(address sender, bytes memory signature) public {
        require(
            msg.sender == admin || msg.sender == relayerAddress,
            "not relayer or admin"
        );

        address signer = signedMessage.recover(signature);
        require(signer == sender, "signature mismatch with sender");

        _approve(msg.sender, address(this), 10 * 10**18);
        _transfer(msg.sender, sender, 10 * 10**18);
    }
}

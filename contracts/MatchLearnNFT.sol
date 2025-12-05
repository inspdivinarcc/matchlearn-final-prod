// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MatchLearnNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    constructor() ERC721("MatchLearnNFT", "MLN") {}

    function mintTo(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}

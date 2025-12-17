// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**

* @title DropslandCreators

* @dev Permanent membership and access badges for DJ communities.

*/

contract DropslandCreators is ERC1155, Ownable {
    string public name = "Dropsland Creators";

    string public symbol = "CREATOR";

    constructor()
        ERC1155("https://api.dropsland.com/creators/{id}.json")
        Ownable(msg.sender)
    {}

    // Mint membership badges to a fan

    function mintMembership(
        address fan,
        uint256 tierId,
        uint256 amount
    ) public onlyOwner {
        _mint(fan, tierId, amount, "");
    }
}

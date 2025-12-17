// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

/**

* @title DropslandEvents

* @dev The primitive layer for Event Access and Perks.

* Validates ownership on-chain. Redemption is handled off-chain.

*/

contract DropslandEvents is ERC1155, Ownable, ERC1155Burnable {
    // Name and Symbol for explorers (not standard in 1155, but useful)

    string public name = "Dropsland Events";

    string public symbol = "DROP";

    constructor()
        ERC1155("https://api.dropsland.com/metadata/{id}.json")
        Ownable(msg.sender)
    {}

    /**

* @notice Mints new assets (Tickets, Perks, Proofs of Attendance).

* @dev Only the owner (Dropsland Backend) can mint.

* @param account The address of the attendee/user.

* @param id The unique ID of the event asset (e.g., 1001 = Event A Ticket).

* @param amount The quantity (e.g., 1 for ticket, 2 for drink tokens).

* @param data Optional data to pass to the receiver.

*/

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    /**

* @notice Mints a batch of different assets to a user at once.

* @dev Useful for bundles (e.g., Ticket + 2 Drinks + 1 Merch).

*/

    function mintBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(account, ids, amounts, data);
    }

    /**

* @notice Updates the metadata base URI if the backend changes.

*/

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}

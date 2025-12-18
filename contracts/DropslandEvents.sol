// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract DropslandEvents is ERC1155, Ownable, ERC1155Burnable {
    string public name = "Dropsland Events";
    string public symbol = "DROP";

    uint256 private _nextId = 0;

    // Mappings
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public creators;

    // Events
    event ItemCreated(
        uint256 indexed id,
        address indexed creator,
        uint256 supply,
        string uri
    );

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @notice Creates a single item.
     */
    function createItem(
        uint256 amount,
        string memory tokenUri,
        bytes memory data
    ) public {
        uint256 newItemId = _nextId++;
        _setupItem(newItemId, msg.sender, tokenUri);
        _mint(msg.sender, newItemId, amount, data);
        emit ItemCreated(newItemId, msg.sender, amount, tokenUri);
    }

    /**
     * @notice Creates multiple different items in ONE transaction.
     * @param amounts Array of supplies (e.g. [100, 50])
     * @param tokenUris Array of IPFS CIDs (e.g. ["ipfs://A", "ipfs://B"])
     * @param data Optional data passed to wallet
     */
    function createBatchItems(
        uint256[] memory amounts,
        string[] memory tokenUris,
        bytes memory data
    ) public {
        require(amounts.length == tokenUris.length, "Lengths mismatch");

        uint256 count = amounts.length;
        uint256[] memory ids = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 newItemId = _nextId++;
            ids[i] = newItemId;

            // Set up metadata and ownership mappings
            _setupItem(newItemId, msg.sender, tokenUris[i]);

            // Emit individual creation events for Indexers (The Graph)
            emit ItemCreated(newItemId, msg.sender, amounts[i], tokenUris[i]);
        }

        // Single Gas-Efficient Mint Transfer
        _mintBatch(msg.sender, ids, amounts, data);
    }

    // Helper to keep code clean
    function _setupItem(
        uint256 id,
        address creator,
        string memory tokenUri
    ) internal {
        creators[id] = creator;
        _tokenURIs[id] = tokenUri;
    }

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        string memory tokenUri = _tokenURIs[tokenId];
        return bytes(tokenUri).length > 0 ? tokenUri : super.uri(tokenId);
    }
}

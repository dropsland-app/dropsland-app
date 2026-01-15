// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; // Security for payments

contract DropslandCreators is ERC1155, Ownable, ReentrancyGuard {
    // --- State Variables ---

    string public name = "Dropsland Creators";
    string public symbol = "CREATOR";

    // Counter for Token IDs (starts at 1)
    uint256 public nextTokenId = 1;

    // Platform fee (e.g., 5% = 500 basis points). Set to 0 for now.
    uint256 public platformFeeBps = 0;

    struct Tier {
        address payable creator; // The DJ who receives the funds
        uint256 price; // Price in wei (ETH)
        uint256 maxSupply; // Cap on members (e.g., 100)
        uint256 totalMinted; // Track usage
        bool isActive; // Allow DJ to pause sales
        string metadataCid; // IPFS Content ID (for indexing)
    }

    // Mapping from Token ID => Tier Details
    mapping(uint256 => Tier) public tiers;

    // --- Events ---

    event TierCreated(
        uint256 indexed tierId,
        address indexed creator,
        uint256 price,
        uint256 maxSupply,
        string metadataCid
    );

    event MembershipMinted(
        uint256 indexed tierId,
        address indexed fan,
        address indexed creator
    );

    // --- Constructor ---

    constructor()
        ERC1155("https://api.dropsland.com/creators/{id}.json")
        Ownable(msg.sender)
    {}

    // --- Core Logic ---

    /**
     * @dev Allows a DJ to create a new membership tier.
     * @param _price Price in Wei (e.g. 0.01 ETH)
     * @param _maxSupply Max number of badges available
     * @param _cid IPFS CID for the metadata json
     */
    function createTier(
        uint256 _price,
        uint256 _maxSupply,
        string memory _cid
    ) external returns (uint256) {
        require(_maxSupply > 0, "Supply must be > 0");

        uint256 currentId = nextTokenId;
        nextTokenId++;

        tiers[currentId] = Tier({
            creator: payable(msg.sender),
            price: _price,
            maxSupply: _maxSupply,
            totalMinted: 0,
            isActive: true,
            metadataCid: _cid
        });

        emit TierCreated(currentId, msg.sender, _price, _maxSupply, _cid);

        return currentId;
    }

    /**
     * @dev Buy a membership badge.
     * @param _tierId The ID of the membership to buy
     * @param _amount How many to buy (usually 1)
     */
    function mintMembership(
        uint256 _tierId,
        uint256 _amount
    ) external payable nonReentrant {
        Tier storage tier = tiers[_tierId];

        // 1. Checks
        require(tier.isActive, "Tier is not active");
        require(tier.totalMinted + _amount <= tier.maxSupply, "Sold out");
        require(msg.value >= tier.price * _amount, "Insufficient ETH sent");

        // 2. Effects
        tier.totalMinted += _amount;
        _mint(msg.sender, _tierId, _amount, "");

        // 3. Interactions (Payout)
        // Simple payout: Forward full amount to DJ.
        // (In production, you might calculate and keep a platform fee here)
        (bool success, ) = tier.creator.call{value: msg.value}("");
        require(success, "Transfer to creator failed");

        emit MembershipMinted(_tierId, msg.sender, tier.creator);
    }

    // --- Admin / Creator Tools ---

    /**
     * @dev Allow DJ to pause/unpause their tier.
     */
    function toggleTierStatus(uint256 _tierId) external {
        require(tiers[_tierId].creator == msg.sender, "Not your tier");
        tiers[_tierId].isActive = !tiers[_tierId].isActive;
    }

    /**
     * @dev Allow admin to update base URI if API endpoint changes.
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}

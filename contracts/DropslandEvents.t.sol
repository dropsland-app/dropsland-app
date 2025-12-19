// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DropslandEvents} from "./DropslandEvents.sol";

contract DropslandEventsTest is Test {
    DropslandEvents events;
    address artist = address(0x1);
    address fan = address(0x2);

    function setUp() public {
        // Deploy the contract
        events = new DropslandEvents();
    }

    function test_NameAndSymbol() public view {
        assertEq(events.name(), "Dropsland Events");
        assertEq(events.symbol(), "DROP");
    }

    function test_CreateItem() public {
        vm.startPrank(artist);

        uint256 supply = 100;
        string memory tokenUri = "ipfs://QmTestSingle";

        // 1. Artist creates an item
        // Note: ID is auto-incremented, starting at 0
        events.createItem(supply, tokenUri, "");

        uint256 expectedId = 0;

        // Verify balance
        assertEq(events.balanceOf(artist, expectedId), supply);

        // Verify URI
        assertEq(events.uri(expectedId), tokenUri);

        // Verify Creator mapping
        assertEq(events.creators(expectedId), artist);

        vm.stopPrank();
    }

    function test_IncrementingIds() public {
        vm.startPrank(artist);

        events.createItem(10, "uri_0", ""); // ID 0
        events.createItem(10, "uri_1", ""); // ID 1

        // Verify IDs incremented correctly
        assertEq(events.uri(0), "uri_0");
        assertEq(events.uri(1), "uri_1");

        vm.stopPrank();
    }

    function test_CreateBatchItems() public {
        vm.startPrank(artist);

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 50;
        amounts[1] = 200;

        string[] memory uris = new string[](2);
        uris[0] = "ipfs://Batch1";
        uris[1] = "ipfs://Batch2";

        // 1. Create multiple items in one transaction
        events.createBatchItems(amounts, uris, "");

        // IDs should be 0 and 1
        assertEq(events.balanceOf(artist, 0), 50);
        assertEq(events.balanceOf(artist, 1), 200);

        // Verify URIs
        assertEq(events.uri(0), "ipfs://Batch1");
        assertEq(events.uri(1), "ipfs://Batch2");

        // Verify Creators
        assertEq(events.creators(0), artist);
        assertEq(events.creators(1), artist);

        vm.stopPrank();
    }

    function test_RedemptionBurn() public {
        // 1. Setup: Artist creates item and sends 1 to fan
        vm.startPrank(artist);
        events.createItem(10, "ipfs://ticket", "");
        uint256 tokenId = 0;
        events.safeTransferFrom(artist, fan, tokenId, 1, "");
        vm.stopPrank();

        // Check fan received it
        assertEq(events.balanceOf(fan, tokenId), 1);

        // 2. Action: Fan burns the token (Redeems it at event)
        vm.startPrank(fan);
        events.burn(fan, tokenId, 1);
        vm.stopPrank();

        // 3. Verify: Balance is 0
        assertEq(events.balanceOf(fan, tokenId), 0);
    }

    function test_RevertWhen_BurnSomeoneElsesToken() public {
        // 1. Setup: Artist creates item
        vm.startPrank(artist);
        events.createItem(10, "ipfs://ticket", "");
        uint256 tokenId = 0;
        vm.stopPrank();

        // 2. Action: Fan tries to burn Artist's token without approval
        // We expect this to revert (ERC1155 security check)
        vm.prank(fan);
        vm.expectRevert();
        events.burn(artist, tokenId, 1);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DropslandEvents} from "./DropslandEvents.sol";

contract DropslandEventsTest is Test {
    DropslandEvents events;
    address fan = address(0x123);

    function setUp() public {
        events = new DropslandEvents();
    }

    function test_MintTicket() public {
        // Mint Ticket ID 1001 to Fan
        events.mint(fan, 1001, 1, "");

        assertEq(events.balanceOf(fan, 1001), 1);
    }

    function test_RedemptionBurn() public {
        // 1. Mint ticket to Fan
        events.mint(fan, 2001, 1, "");

        // 2. Impersonate the Fan (VM Prank) to call burn
        vm.prank(fan);
        events.burn(fan, 2001, 1);

        // 3. Verify balance is 0 (Redeemed)
        assertEq(events.balanceOf(fan, 2001), 0);
    }

    function testFuzz_MintAmount(uint256 amount) public {
        // Fuzzing: Foundry will try random 'amount' values
        // We cap it to avoid overflow/gas limits
        amount = bound(amount, 1, 10000);

        events.mint(fan, 3001, amount, "");
        assertEq(events.balanceOf(fan, 3001), amount);
    }
}

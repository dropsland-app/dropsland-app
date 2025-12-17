// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DropslandCreators} from "./DropslandCreators.sol";

contract DropslandCreatorsTest is Test {
    DropslandCreators creators;
    address fan = address(0x123);

    function setUp() public {
        creators = new DropslandCreators();
    }

    function test_CreatorsName() public view {
        assertEq(creators.name(), "Dropsland Creators");
    }

    function test_MintMembership() public {
        // Mint Token ID 1 to Fan
        creators.mintMembership(fan, 1, 1);

        // Verify balance
        assertEq(creators.balanceOf(fan, 1), 1);
    }
}

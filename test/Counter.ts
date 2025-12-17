import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import hre from "hardhat";

describe("Dropsland Contracts", async function () {
  const { viem } = await hre.network.connect();

  async function deployDropslandFixture() {
    const [owner, fan] = await viem.getWalletClients();
    const creators = await viem.deployContract("DropslandCreators");
    const events = await viem.deployContract("DropslandEvents");
    const publicClient = await viem.getPublicClient();

    return { creators, events, owner, fan, publicClient };
  }

  describe("DropslandCreators", function () {
    it("Should have the correct name", async function () {
      const { creators } = await loadFixture(deployDropslandFixture);
      assert.strictEqual(await creators.read.name(), "Dropsland Creators");
    });

    it("Should allow owner to mint membership", async function () {
      const { creators, fan } = await loadFixture(deployDropslandFixture);
      await creators.write.mintMembership([fan.account.address, 1n, 1n]);

      const balance = await creators.read.balanceOf([fan.account.address, 1n]);
      assert.strictEqual(balance, 1n);
    });
  });

  describe("DropslandEvents", function () {
    it("Should allow burning (Redemption)", async function () {
      const { events, fan } = await loadFixture(deployDropslandFixture);

      // Mint
      await events.write.mint([fan.account.address, 2001n, 1n, "0x"]);

      // Connect as fan to burn
      const eventsAsFan = await hre.viem.getContractAt(
        "DropslandEvents",
        events.address,
        { client: { wallet: fan } },
      );
      await eventsAsFan.write.burn([fan.account.address, 2001n, 1n]);

      const balance = await events.read.balanceOf([fan.account.address, 2001n]);
      assert.strictEqual(balance, 0n);
    });
  });
});

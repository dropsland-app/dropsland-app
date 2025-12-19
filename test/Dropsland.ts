import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("Dropsland Contracts", async function () {
  const { viem } = await network.connect();

  it("DropslandCreators Should have the correct name", async function () {
    const creators = await viem.deployContract("DropslandCreators");
    assert.equal(await creators.read.name(), "Dropsland Creators");
  });

  it("DropslandCreators Should allow owner to mint membership", async function () {
    const creators = await viem.deployContract("DropslandCreators");
    const [owner, fan] = await viem.getWalletClients();

    await creators.write.mintMembership([fan.account.address, 1n, 1n]);

    const balance = await creators.read.balanceOf([fan.account.address, 1n]);
    assert.equal(balance, 1n);
  });

  it("DropslandEvents Should allow burning (Redemption)", async function () {
    const events = await viem.deployContract("DropslandEvents");
    const [owner, fan] = await viem.getWalletClients();

    // 1. Create ticket (Mints to Owner, ID will be 0)
    // Signature: createItem(amount, uri, data)
    await events.write.createItem([1n, "ipfs://ticket", "0x"]);
    const tokenId = 0n;

    // 2. Transfer from Owner to Fan
    await events.write.safeTransferFrom([
      owner.account.address,
      fan.account.address,
      tokenId,
      1n,
      "0x",
    ]);

    // 3. Connect as fan to burn (redeem)
    const eventsAsFan = await viem.getContractAt(
      "DropslandEvents",
      events.address,
      { client: { wallet: fan } },
    );

    await eventsAsFan.write.burn([fan.account.address, tokenId, 1n]);

    const balance = await events.read.balanceOf([fan.account.address, tokenId]);
    assert.equal(balance, 0n);
  });
});

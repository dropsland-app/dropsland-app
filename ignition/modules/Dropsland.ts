import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DropslandModule = buildModule("DropslandModule", (m) => {
  // Deploy the Creators (Membership) contract
  const creators = m.contract("DropslandCreators");

  // Deploy the Events (Tickets/Perks) contract
  const events = m.contract("DropslandEvents");

  return { creators, events };
});

export default DropslandModule;

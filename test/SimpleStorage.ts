import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("Simple Storage Unit Tests", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySimpleStorageFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );

    const simpleStorage = await SimpleStorageFactory.deploy();

    // const Lock = await ethers.getContractFactory("Lock");
    // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { simpleStorage, owner, otherAccount };
  }

  describe("Deployment", async function () {
    it("should set message to Chainlink Workshop", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
      const expectedMessage = "Chainlink Workshop";
      const actualMessage = await simpleStorage.getMessage();
      assert(expectedMessage === actualMessage, "Message Mismatch");
    });
  });

  describe("#setMessage", async function () {
    describe("failure", async function () {
      it("should revert if caller is not owner", async function () {
        const { simpleStorage, otherAccount } = await loadFixture(
          deploySimpleStorageFixture
        );
        const newMessage = "Hardhat Workshop";
        await expect(
          simpleStorage.connect(otherAccount).setMessage(newMessage)
        ).to.be.revertedWith("Caller is not the owner");
      });

      it("should revert if empty string is provided", async function () {
        const { simpleStorage, owner } = await loadFixture(
          deploySimpleStorageFixture
        );
        const newMessage = "";
        await expect(
          simpleStorage.connect(owner).setMessage(newMessage)
        ).to.be.revertedWith("Empty strings not allowed");
      });
    });

    describe("success", async function () {
      it("should change the message variable", async function () {
        const { simpleStorage, owner } = await loadFixture(
          deploySimpleStorageFixture
        );
        const newMessage = "Hardhat Workshop";
        await simpleStorage.connect(owner).setMessage(newMessage);
        const actualMessage = await simpleStorage.getMessage();
        assert(newMessage === actualMessage, "Message Mismatch");
      });

      it("should emit message changed event", async function () {
        const { simpleStorage, owner } = await loadFixture(
          deploySimpleStorageFixture
        );
        const newMessage = "Hardhat Workshop";

        await expect(simpleStorage.connect(owner).setMessage(newMessage))
          .to.emit(simpleStorage, "MessageChanged")
          .withArgs(newMessage);
      });
    });
  });
});

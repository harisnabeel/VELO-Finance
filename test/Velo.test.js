const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let velo, gaugeFactory, artProxy, escrow;
let admin, alice, bob, carol;
describe("VELO", function () {
  before("Setting up accounts and stuff", async function () {
    // getting signers
    [admin, alice, bob, carol] = await ethers.getSigners();
  });
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {
    let [Velo, GaugeFactory, VeArtProxy, VotingEscrow] = await Promise.all([
      ethers.getContractFactory("Velo"),
      ethers.getContractFactory("GaugeFactory"),
      ethers.getContractFactory("VeArtProxy"),
      ethers.getContractFactory("VotingEscrow"),
    ]);

    // deploying VELO
    velo = await Velo.deploy();
    await velo.deployed();
    console.log("Velo deployed to: ", velo.address);

    // deploying GaugeFactory
    gaugeFactory = await GaugeFactory.deploy(); // creates gauges (distributes rewards to Liq pools)
    await gaugeFactory.deployed();
    console.log("GaugeFactory deployed to: ", gaugeFactory.address);

    // deploying art Proxy
    artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    console.log("VeArtProxy deployed to: ", artProxy.address);

    // deploying Voting Escro
    escrow = await VotingEscrow.deploy(velo.address, artProxy.address);
    await escrow.deployed();
    console.log("VotingEscrow deployed to: ", escrow.address);
    console.log("Args: ", velo.address, artProxy.address, "\n");
  }

  describe("Deployment", function () {
    it("Should deploy the contracts", async function () {
      await deployContracts();
    });

    xit("User should get some VELo and create a lock", async function () {
      expect(await velo.balanceOf(alice.address)).to.be.equal(0);
      expect(await velo.balanceOf(admin.address)).to.not.equal(0);
      const valueToTransfer = ethers.utils.parseUnits("500", 18);

      // admin giving some VELO to alice
      await velo.transfer(alice.address, valueToTransfer );
      // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

      await velo.connect(alice).approve( escrow.address,valueToTransfer);
      // now alice is creating a lock
      await escrow.connect(alice).create_lock(valueToTransfer, 629774);
      console.log(await escrow.locked(1));
    });
  });
});

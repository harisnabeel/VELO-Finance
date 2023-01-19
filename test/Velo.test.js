const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

let Velo, GaugeFactory, VeArtProxy, VotingEscrow;
describe("VELO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {
    [Velo, GaugeFactory, VeArtProxy, VotingEscrow] = await Promise.all([
      ethers.getContractFactory("Velo"),
      ethers.getContractFactory("GaugeFactory"),
      ethers.getContractFactory("VeArtProxy"),
      ethers.getContractFactory("VotingEscrow"),
    ]);

    // deploying VELO
    const velo = await Velo.deploy();
    await velo.deployed();
    console.log("Velo deployed to: ", velo.address);

    // deploying GaugeFactory
    const gaugeFactory = await GaugeFactory.deploy(); // creates gauges (distributes rewards to Liq pools)
    await gaugeFactory.deployed();
    console.log("GaugeFactory deployed to: ", gaugeFactory.address);

    // deploying art Proxy
    const artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    console.log("VeArtProxy deployed to: ", artProxy.address);

    // deploying Voting Escro
    const escrow = await VotingEscrow.deploy(velo.address, artProxy.address);
    await escrow.deployed();
    console.log("VotingEscrow deployed to: ", escrow.address);
    console.log("Args: ", velo.address, artProxy.address, "\n");
  }

  describe("Deployment", function () {
    it("Should deploy the contracts", async function () {
      await deployContracts();
    })
  });
});

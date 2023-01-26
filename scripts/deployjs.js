const {
  mine,
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { verifyContract } = require("./../scripts/utils/verfierHelper");

let velo,
  gaugeFactory,
  artProxy,
  escrow,
  bribeFactory,
  voter,
  pairFactory,
  distributor,
  minter,
  usdc,
  xeq,
  WETH,
  xequsdPair;
let admin, alice, bob, carol, teamMultisig, asim1, asim2;
const WEEK = 604800;
const valueToTransfer = ethers.utils.parseUnits("3000", 18);

async function deployContracts() {
  [admin, alice, bob, carol, teamMultisig, asim1, asim2] =
    await ethers.getSigners();
  // Load
  const [
    Velo,
    GaugeFactory,
    BribeFactory,
    PairFactory,
    VeArtProxy,
    VotingEscrow,
    RewardsDistributor,
    Voter,
    Minter,
  ] = await Promise.all([
    ethers.getContractFactory("Velo"),
    ethers.getContractFactory("GaugeFactory"),
    ethers.getContractFactory("BribeFactory"),
    ethers.getContractFactory("PairFactory"),
    ethers.getContractFactory("VeArtProxy"),
    ethers.getContractFactory("VotingEscrow"),
    ethers.getContractFactory("RewardsDistributor"),
    ethers.getContractFactory("Voter"),
    ethers.getContractFactory("Minter"),
  ]);

  // deploying VELO
  velo = await Velo.deploy();
  await velo.deployed();
  console.log("Velo deployed to: ", velo.address);

  // deploying GaugeFactory
  gaugeFactory = await GaugeFactory.deploy(); // creates gauges (distributes rewards to Liq pools)
  await gaugeFactory.deployed();
  console.log("GaugeFactory deployed to: ", gaugeFactory.address);

  //deploying bribeFactory
  bribeFactory = await BribeFactory.deploy();
  console.log("BribeFactory deployed to: ", bribeFactory.address);

  // deploying Pair Factory
  pairFactory = await PairFactory.deploy();
  console.log("pairFactory deployed to: ", pairFactory.address);

  // deploying WETH
  WETH = await (
    await (
      await ethers.getContractFactory("Mockerc20")
    ).deploy("Wrapped ETH", "WETH")
  ).deployed();
  console.log(WETH.address, "WETH is deployed at: ");

  // deploying router
  router = await (
    await (
      await ethers.getContractFactory("Router")
    ).deploy(pairFactory.address, WETH.address)
  ).deployed();
  console.log(router.address, "Router is deployed at: ");

  // deploying art Proxy
  artProxy = await VeArtProxy.deploy();
  await artProxy.deployed();
  console.log("VeArtProxy deployed to: ", artProxy.address);

  // deploying Voting Escro
  escrow = await VotingEscrow.deploy(velo.address, artProxy.address);
  await escrow.deployed();
  console.log("VotingEscrow deployed to: ", escrow.address);
  // console.log("Args: ", velo.address, artProxy.address, "\n");

  // now deploying reward distribution
  distributor = await RewardsDistributor.deploy(escrow.address);
  console.log("RewardsDistributor deployed to: ", distributor.address);

  // deploying voter
  voter = await Voter.deploy(
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address
  );
  console.log("Voter deployed to: ", voter.address);

  // deploying the minter
  minter = await Minter.deploy(
    voter.address,
    escrow.address,
    distributor.address
  );
  console.log("Miter deployed to: ", minter.address);

  // deploying USDC
  usdc = await (
    await (
      await ethers.getContractFactory("Mockerc20")
    ).deploy("USDC Stable", "USDC")
  ).deployed();

  console.log(usdc.address, "USDC is deployed at: ");

  xeq = await (
    await (
      await ethers.getContractFactory("Mockerc20")
    ).deploy("0xEquity", "XEQ")
  ).deployed();

  console.log(xeq.address, "XEQ is deployed at: ");

  // CONFIGS-------------------------------------------------------

  await minter.setTeam(carol.address);
  await velo.setMinter(minter.address);

  await pairFactory.setPauser(teamMultisig.address);

  await escrow.setVoter(voter.address);
  console.log("Voter set");

  await escrow.setTeam(carol.address);
  console.log("Team set for escrow");

  await voter.setGovernor(carol.address);
  console.log("Governor set");

  await voter.setEmergencyCouncil(carol.address);
  console.log("Emergency Council set");

  await distributor.setDepositor(minter.address);
  console.log("Depositor set");

  await voter.initialize(
    [xeq.address, usdc.address, WETH.address],
    minter.address
  );
  console.log("Whitelist set");

  await minter.initialize(
    [asim1.address, asim2.address],
    [ethers.utils.parseUnits("10000", 18), ethers.utils.parseUnits("5000", 18)],
    ethers.utils.parseUnits("15000", 18)
  );
  console.log("veVELO distributed");

  await verifyContract(velo.address, []);
  await verifyContract(gaugeFactory.address, []);
  await verifyContract(bribeFactory.address, []);
  await verifyContract(pairFactory.address, []);
  await verifyContract(WETH.address, ["Wrapped ETH", "WETH"]);
  await verifyContract(router.address, [pairFactory.address, WETH.address]);
  await verifyContract(artProxy.address, []);
  await verifyContract(escrow.address, [velo.address, artProxy.address]);
  await verifyContract(distributor.address, [escrow.address]);
  await verifyContract(voter.address, [
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address,
  ]);
  await verifyContract(minter.address, [
    voter.address,
    escrow.address,
    distributor.address,
  ]);
  await verifyContract(usdc.address, ["USDC Stable", "USDC"]);
  await verifyContract(xeq.address, ["0xEquity", "XEQ"]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

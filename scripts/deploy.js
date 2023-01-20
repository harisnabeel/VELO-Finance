// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { verifyContract } = require("./utils/verfierHelper");
const network = hre.hardhatArguments.network;
let admin, alice, bob, carol;

async function main() {
  [admin, alice, bob, carol] = await ethers.getSigners();

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
  const velo = await Velo.deploy();
  await velo.deployed();
  console.log("Velo deployed to: ", velo.address);

  // deploying GaugeFactory
  const gaugeFactory = await GaugeFactory.deploy(); // creates gauges (distributes rewards to Liq pools)
  await gaugeFactory.deployed();
  console.log("GaugeFactory deployed to: ", gaugeFactory.address);

  // deploying bribeFactory
  const bribeFactory = await BribeFactory.deploy();
  await bribeFactory.deployed();
  console.log("BribeFactory deployed to: ", bribeFactory.address);

  // deploying pairFactory
  const pairFactory = await PairFactory.deploy();
  await pairFactory.deployed();
  console.log("PairFactory deployed to: ", pairFactory.address);

  // deploying art Proxy
  const artProxy = await VeArtProxy.deploy();
  await artProxy.deployed();
  console.log("VeArtProxy deployed to: ", artProxy.address);

  // deploying Voting Escro
  const escrow = await VotingEscrow.deploy(velo.address, artProxy.address);
  await escrow.deployed();
  console.log("VotingEscrow deployed to: ", escrow.address);
  console.log("Args: ", velo.address, artProxy.address, "\n");

  // now deploying reward distribution

  const distributor = await RewardsDistributor.deploy(escrow.address);
  await distributor.deployed();
  console.log("RewardsDistributor deployed to: ", distributor.address);
  console.log("Args: ", escrow.address, "\n");

  // deploying voter
  const voter = await Voter.deploy(
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address
  );
  await voter.deployed();
  console.log("Voter deployed to: ", voter.address);
  console.log(
    "Args: ",
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address,
    "\n"
  );

  // deploying minter
  const minter = await Minter.deploy(
    voter.address,
    escrow.address,
    distributor.address
  );
  await minter.deployed();
  console.log("Minter deployed to: ", minter.address);
  console.log(
    "Args: ",
    voter.address,
    escrow.address,
    distributor.address,
    "\n"
  );

  await escrow.checkpoint();
  console.log("Done once ---------------------");
  await escrow.checkpoint();
  console.log("Done twice ---------------------");

  const valueToTransfer = ethers.utils.parseUnits("500", 18);

  // admin giving some VELO to alice
  await velo.transfer(alice.address, valueToTransfer );
  // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

  await velo.connect(alice).approve( escrow.address,valueToTransfer);
  // now alice is creating a lock
  await escrow.connect(alice).create_lock(valueToTransfer, 629774);

  await escrow.checkpoint();
  console.log("Done third ---------------------");


  await velo.transfer(bob.address, valueToTransfer );
  // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

  await velo.connect(bob).approve( escrow.address,valueToTransfer);
  // now alice is creating a lock
  await escrow.connect(bob).create_lock(valueToTransfer, 629774);

  // await escrow.checkpoint();
  // console.log("Done thrice ---------------------");
  // console.log(network, "this is network");
//   if (network != "undefined" || network != "hardhat")
//     // verifying contracts
//     console.log("Verifying contracs------");
//   await verifyContract(velo.address, []);
//   await verifyContract(gaugeFactory.address, []);
//   await verifyContract(artProxy.address, []);
//   await verifyContract(escrow.address, [velo.address, artProxy.address]);
//   await verifyContract(distributor.address, [escrow.address]);
//   console.log("Contracs verified----");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

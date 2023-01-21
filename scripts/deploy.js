// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const path = require('path');
const fs = require('fs');
const {
  verifyContract
} = require("./utils/verfierHelper");
const network = hre.hardhatArguments.network;
let admin, alice, bob, carol;
const delay = ms => new Promise(res => setTimeout(res, ms));
var tdr = require("truffle-deploy-registry");


async function readJsonFromFile(filePath){
  return JSON.parse(fs.readFileSync(filePath, {encoding:'utf-8'}));
}

async function addToTvr(
  address,
  args,
  network,
  networkId,
) {
  // Adds in constructor args for contracts in the k, v store
  // e.g. Produces a networks/1_args.json
  // with the structure
  // { "address": "args" }
  if (true) {
    const tvrPath = path.join(
      process.cwd(),
      'networks',
      `${networkId}_args.json`,
    );
    

    let tvrData = {};

    // If file exists, just read it
    if (fs.existsSync(tvrPath)) {
      tvrData = (await readJsonFromFile(tvrPath));
    }

    // Remove { 'from': ... } thats present in the deployment args
    // As well as empty objects
    // And destructure the single tuple (with rawValue keys)
    const argsFixed = args
      .filter(
        (x) =>
          !x.from && (typeof x === 'object' ? Object.keys(x).length > 0 : true),
      )
      .map((x) => {
        // Tuple
        if (x.rawValue) return [x.rawValue];
        return x;
      });

    // Save to file
    fs.writeFileSync(
      tvrPath,
      JSON.stringify({ ...tvrData, [address]: argsFixed }, null, 4),
    );
  }
}

async function getExistingContract(contractName) {
  const Contract = await ethers.getContractFactory(contractName);
  const entry = await tdr.findLastByContractName(hre.network.config.chainId, contractName);
  if (entry) {
    return new ethers.Contract(entry.address, Contract.interface)
  }
}
async function _deploy(contractName, ...args) {
  const Contract = await ethers.getContractFactory(contractName);
  const existingContract = await getExistingContract(contractName)
  if (existingContract) {
    console.log("Deployment Already Exist. Skipping deployment >", contractName)
    return existingContract;
  }
  
  
  let contract
  if (args.length >0 && args[0] === null) {
    console.log("New Deployment without Args >", contractName)
    contract = await Contract.deploy();
  } else {
    console.log("New Deployment wtith Args >", contractName,args)
    contract = await Contract.deploy(...args);
    await addToTvr(contract.address,args,network,contract.deployTransaction.chainId)
  }

  await contract.deployed();
  console.log("Verifiying Contract >", contractName)
  console.log("Contract params>", args)
  if (args.length >0 && args[0] === null) {
    await verifyContract(contract.address);
  } else {
    await verifyContract(contract.address, ...args);
  }


  await tdr.append(contract.deployTransaction.chainId, {
    contractName: contractName,
    address: contract.address,
    transactionHash: contract.deployTransaction.hash,
    args,
  });
  return contract;
}
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
  const velo = await _deploy("Velo", null);
  console.log("Velo deployed to: ", velo.address);

  // deploying GaugeFactory
  const gaugeFactory = await _deploy("GaugeFactory", null); // creates gauges (distributes rewards to Liq pools)
  console.log("GaugeFactory deployed to: ", gaugeFactory.address);

  // deploying bribeFactory
  const bribeFactory = await _deploy("BribeFactory", null);
  console.log("BribeFactory deployed to: ", bribeFactory.address);

  // deploying pairFactory
  const pairFactory = await _deploy("PairFactory", null);
  console.log("PairFactory deployed to: ", pairFactory.address);

  // deploying art Proxy
  const artProxy = await _deploy("VeArtProxy", null);
  console.log("VeArtProxy deployed to: ", artProxy.address);

  // deploying Voting Escro
  const escrow = await _deploy("VotingEscrow", velo.address, artProxy.address);
  console.log("VotingEscrow deployed to: ", escrow.address);
  console.log("Args: ", velo.address, artProxy.address, "\n");

  // now deploying reward distribution

  const distributor = await _deploy("RewardsDistributor", escrow.address);
  console.log("RewardsDistributor deployed to: ", distributor.address);
  console.log("Args: ", escrow.address, "\n");

  // deploying voter
  const voter = await _deploy("Voter", escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address
  );

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
  const minter = await _deploy("Minter",
    voter.address,
    escrow.address,
    distributor.address
  );

  console.log("Minter deployed to: ", minter.address);
  console.log(
    "Args: ",
    voter.address,
    escrow.address,
    distributor.address,
    "\n"
  );



  // const valueToTransfer = ethers.utils.parseUnits("500", 18);
  // const valueToTransfer2 = ethers.utils.parseUnits("5000", 18);
  // // admin giving some VELO to alice
  // await velo.transfer(alice.address, valueToTransfer );
  // // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

  // await velo.connect(alice).approve( escrow.address,valueToTransfer);

  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");

  // // now alice is creating a lock
  // await escrow.connect(alice).create_lock(valueToTransfer, 629774);

  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");

  // await velo.transfer(bob.address, valueToTransfer2 );
  // // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

  // await velo.connect(bob).approve( escrow.address,valueToTransfer2);

  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // // now alice is creating a lock
  // await escrow.connect(bob).create_lock(valueToTransfer2, 629774);

  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // await delay(5000)
  // console.log( await escrow.connect(alice).balanceOfNFT(1),">> balance");
  // console.log( await escrow.connect(alice).balanceOfNFT(2),">> balance");
  // await escrow.checkpoint();
  // console.log("Done thrice ---------------------");
  console.log(network, "this is network");
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
const {
  mine,
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { execSync } = require("child_process");
const { escapeLeadingUnderscores } = require("typescript");

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
const valueToTransfer = ethers.utils.parseUnits("3000", 18);

describe("VELO", function () {
  before("Setting up accounts and stuff", async function () {
    // getting signers
    [admin, alice, bob, carol, teamMultisig, asim1, asim2] =
      await ethers.getSigners();
  });
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {
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
    // console.log("Velo deployed to: ", velo.address);

    // deploying GaugeFactory
    gaugeFactory = await GaugeFactory.deploy(); // creates gauges (distributes rewards to Liq pools)
    await gaugeFactory.deployed();
    // console.log("GaugeFactory deployed to: ", gaugeFactory.address);

    //deploying bribeFactory
    bribeFactory = await BribeFactory.deploy();
    // console.log("BribeFactory deployed to: ", bribeFactory.address);

    // deploying Pair Factory
    pairFactory = await PairFactory.deploy();
    // console.log("pairFactory deployed to: ", pairFactory.address);

    // deploying WETH
    WETH = await (
      await (
        await ethers.getContractFactory("Mockerc20")
      ).deploy("Wrapped ETH", "WETH")
    ).deployed();

    // deploying router
    router = await (
      await (
        await ethers.getContractFactory("Router")
      ).deploy(pairFactory.address, WETH.address)
    ).deployed();

    // deploying art Proxy
    artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    // console.log("VeArtProxy deployed to: ", artProxy.address);

    // deploying Voting Escro
    escrow = await VotingEscrow.deploy(velo.address, artProxy.address);
    await escrow.deployed();
    // console.log("VotingEscrow deployed to: ", escrow.address);
    // console.log("Args: ", velo.address, artProxy.address, "\n");

    // now deploying reward distribution
    distributor = await RewardsDistributor.deploy(escrow.address);
    // console.log("RewardsDistributor deployed to: ", distributor.address);

    // deploying voter
    voter = await Voter.deploy(
      escrow.address,
      pairFactory.address,
      gaugeFactory.address,
      bribeFactory.address
    );
    // console.log("Voter deployed to: ", voter.address);

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
    xeq = await (
      await (
        await ethers.getContractFactory("Mockerc20")
      ).deploy("0xEquity", "XEQ")
    ).deployed();

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
      [
        ethers.utils.parseUnits("10000", 18),
        ethers.utils.parseUnits("5000", 18),
      ],
      ethers.utils.parseUnits("15000", 18)
    );
    console.log("veVELO distributed");
  }

  describe("Deployment", function () {
    it("Should deploy the contracts", async function () {
      await deployContracts();
    });

    xit("User should get some VELo and create a lock ", async function () {
      expect(await velo.balanceOf(alice.address)).to.be.equal(0);
      expect(await velo.balanceOf(admin.address)).to.not.equal(0);
      const valueToTransfer = ethers.utils.parseUnits("500", 18);

      // admin giving some VELO to alice
      await velo.transfer(alice.address, valueToTransfer);
      // expect(await velo.balanceOf(alice.address)).to.be.equal(valueToTransfer);

      await velo.connect(alice).approve(escrow.address, valueToTransfer);
      // now alice is creating a lock
      await escrow.connect(alice).create_lock(valueToTransfer, 629774);
      console.log(await escrow.locked(1));
    });

    describe("1st test", function () {
      it("Distribute Velo to users and approve to Escrow", async function () {
        expect(await velo.balanceOf(alice.address)).to.be.equal(0);
        expect(await velo.balanceOf(bob.address)).to.be.equal(0);
        expect(await velo.balanceOf(carol.address)).to.be.equal(0);

        // admin giving some VELO to alice
        await velo.transfer(alice.address, valueToTransfer);
        // admin giving some VELO to bob
        await velo.transfer(bob.address, valueToTransfer);
        // admin giving some VELO to carol
        await velo.transfer(carol.address, valueToTransfer);

        expect(await velo.balanceOf(alice.address)).to.be.equal(
          valueToTransfer
        );
        expect(await velo.balanceOf(bob.address)).to.be.equal(valueToTransfer);
        expect(await velo.balanceOf(carol.address)).to.be.equal(
          valueToTransfer
        );

        // approving token to escrow
        await velo.connect(alice).approve(escrow.address, valueToTransfer);
        await velo.connect(bob).approve(escrow.address, valueToTransfer);
        await velo.connect(carol).approve(escrow.address, valueToTransfer);
      });

      xit("User 1 should be able to create lock for 7 days", async function () {
        // console.log("Supply before 1st lock ", await escrow.supply());
        // console.log(await time.i(await time.latest() + 1)); // increasing block time to stable
        await escrow.connect(alice).create_lock(valueToTransfer, 604800);
        console.log("Balance of NFT after lock ", await escrow.balanceOfNFT(1));
        const lockEnd = (await escrow.locked(1)).end;
        // console.log("Locked-----------------------", locked - 604800);

        await time.increaseTo(lockEnd - 86400);
        console.log(
          "Balance of NFT after increasing time to (latest week - 1 day) ",
          await escrow.balanceOfNFT(1)
        );

        console.log("Supply after 1st lock ", await escrow.supply());
      });

      xit("User 2 should be able to create lock for 14 days", async function () {
        // console.log("Supply before 2nd lock ", await escrow.supply());
        await escrow.connect(bob).create_lock(valueToTransfer, 1209600);
        console.log("Balance of NFT after lock ", await escrow.balanceOfNFT(2));
        const lockEnd = (await escrow.locked(2)).end;
        await time.increaseTo(lockEnd - 86400);
        console.log(
          "Balance of NFT after increasing time to (2 weeks - 1 day) ",
          await escrow.balanceOfNFT(2)
        );

        console.log("Supply after 2nd lock ", await escrow.supply());
      });

      xit("User 3 should be able to create lock for 21 days", async function () {
        // console.log("Supply before 3rd lock ", await escrow.supply());
        await escrow.connect(carol).create_lock(valueToTransfer, 1814400);
        console.log("Balance of NFT after lock ", await escrow.balanceOfNFT(3));
        const lockEnd = (await escrow.locked(3)).end;
        await time.increaseTo(lockEnd - 86400);
        console.log(
          "Balance of NFT after increasing time to (3 weeks - 1 day) ",
          await escrow.balanceOfNFT(3)
        );

        console.log("Supply after 3rd lock ", await escrow.supply());

        // consulsion is that voting power is being calculated on behalf of time
      });
    });

    describe("2nd test", function () {
      it("Distribute Velo to alice and approve to Escrow", async function () {
        // deploying new contracts
        await deployContracts();
        expect(await velo.balanceOf(alice.address)).to.be.equal(0);

        let valueToTransfer = ethers.utils.parseUnits("10000", 18);
        // admin giving some VELO to alice
        await velo.transfer(alice.address, valueToTransfer);

        expect(await velo.balanceOf(alice.address)).to.be.equal(
          valueToTransfer
        );

        // approving token to escrow
        await velo.connect(alice).approve(escrow.address, valueToTransfer);
      });

      it("Create 100 % lock for a month", async function () {
        let valueToTransfer = ethers.utils.parseUnits("10000", 18);

        await escrow.connect(alice).create_lock(valueToTransfer, 2592000); // creating lock for a month
        const lockedEnd = (await escrow.locked(1)).end;
        console.log(
          await escrow.balanceOfNFT(1),
          "Balance of NFT before increase time"
        );
        await time.increaseTo(lockedEnd);
        console.log(
          await escrow.balanceOfNFT(1),
          "Balance of NFT after increase time"
        );
      });

      xit("Create 100 % lock for a month", async function () {
        let valueToTransfer = ethers.utils.parseUnits("10000", 18);

        await escrow.connect(alice).create_lock(valueToTransfer, 2592000); // creating lock for a month
        const lockedEnd = (await escrow.locked(1)).end;
        console.log(
          await escrow.balanceOfNFT(1),
          "Balance of NFT before increase time"
        );
        await time.increaseTo(lockedEnd);
        console.log(
          await escrow.balanceOfNFT(1),
          "Balance of NFT after increase time"
        );
      });
    });

    describe.only("Pair test", function () {
      it("Create a piar ", async function () {
        // deploying new contracts
        await deployContracts();

        // craeting pair
        await pairFactory.createPair(xeq.address, usdc.address, false);

        console.log(await pairFactory.allPairs(0), "Pair address");
        let pair = await pairFactory.allPairs(0);
        pair = await ethers.getContractAt("Pair", pair);

        console.log(await pair.name(), "Pair name");
      });

      it("Add liquidity", async function () {
        let pair = await pairFactory.allPairs(0);
        pair = await ethers.getContractAt("Pair", pair);
        const amountToTransfer = ethers.utils.parseUnits("10000", 18);

        // approving token to router
        await usdc.approve(router.address, amountToTransfer);
        await xeq.approve(router.address, amountToTransfer);
        let deadline = await time.latest();
        deadline = deadline + 86400;
        // addinng liquiduty
        await router.addLiquidity(
          xeq.address,
          usdc.address,
          false,
          ethers.utils.parseUnits("10000", 18),
          ethers.utils.parseUnits("1000", 18),
          0,
          0,
          admin.address,
          deadline
        );

        console.log(await pair.totalSupply(), "Pair supply");
        console.log(await pair.balanceOf(admin.address), "Pair balance ");
      });

      it("Swapping", async function () {
        let pair = await pairFactory.allPairs(0);
        pair = await ethers.getContractAt("Pair", pair);
        const amountToSwap = ethers.utils.parseUnits("100", 18);

        // approving token to router
        await usdc.approve(router.address, amountToSwap);
        await xeq.approve(router.address, amountToSwap);
        let deadline = await time.latest();
        deadline = deadline + 86400;

        console.log(await xeq.balanceOf(admin.address), "XEQ balance before");
        console.log(await usdc.balanceOf(admin.address), "USDC balance before");

        let expectedAmoutOut = await router.getAmountsOut(amountToSwap, [
          [xeq.address, usdc.address, false],
        ]);
        console.log(expectedAmoutOut);
        // swapping
        await router.swapExactTokensForTokens(
          amountToSwap,
          expectedAmoutOut[1],
          [[xeq.address, usdc.address, false]],
          admin.address,
          deadline
        );

        console.log(await xeq.balanceOf(admin.address), "XEQ balance after");
        console.log(await usdc.balanceOf(admin.address), "USDC balance after");
      });

      it("Creating guage", async function () {
        let pair = await pairFactory.allPairs(0);
        // pair = await ethers.getContractAt("Pair", pair);
        await voter.createGauge(pair);
      });
    });
  });
});

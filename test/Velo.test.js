const {
  mine,
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { verifyContract } = require("./../scripts/utils/verfierHelper");
const { FixBigNumber, jjTRY } = require("@jarvisnetwork/core-sdk");

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
  jTRY,
  xequsdPair,
  pairUSDC,
  pairJTRY;
let admin, alice, bob, carol, teamMultisig, asim1, asim2;
const WEEK = 604800;
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
      ethers.getContractFactory("MintableBurnableSyntheticTokenPermit"),
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
    velo = await Velo.deploy("0xEquity", "XEQ", 18);
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
    console.log("Minter deployed to: ", minter.address);

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

    jTRY = await (
      await (
        await ethers.getContractFactory("Mockerc20")
      ).deploy("JTRY", "JTRY")
    ).deployed();

    console.log(jTRY.address, "jTRY is deployed at: ");

    // await verifyContract(velo.address, []);
    // await verifyContract(gaugeFactory.address, []);
    // await verifyContract(bribeFactory.address, []);
    // await verifyContract(pairFactory.address, []);
    // await verifyContract(WETH.address, ["Wrapped ETH", "WETH"]);
    // await verifyContract(router.address, [pairFactory.address, WETH.address]);
    // await verifyContract(artProxy.address, []);
    // await verifyContract(escrow.address, [velo.address, artProxy.address]);
    // await verifyContract(distributor.address, [escrow.address]);
    // await verifyContract(voter.address, [
    //   escrow.address,
    //   pairFactory.address,
    //   gaugeFactory.address,
    //   bribeFactory.address,
    // ]);
    // await verifyContract(minter.address, [
    //   voter.address,
    //   escrow.address,
    //   distributor.address,
    // ]);
    // await verifyContract(usdc.address, ["USDC Stable", "USDC"]);
    // await verifyContract(xeq.address, ["0xEquity", "XEQ"]);

    // CONFIGS-------------------------------------------------------

    await minter.setTeam(carol.address);

    await velo.addMinter(minter.address);

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
      [xeq.address, usdc.address, WETH.address, velo.address, jTRY.address],
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

  async function printSingleVeloBalance(address, name) {
    console.log(
      name,
      FixBigNumber.fromWei((await velo.balanceOf(address)).toString()).toFixed(
        4
      ),
      " balance of address VELO"
    );
  }

  async function printLockBalanceofNFT(id, name) {
    console.log(name, await escrow.locked(id), " locked balanacesss");
  }

  async function printSingleUSDCBalance(address, name) {
    console.log(
      name,
      FixBigNumber.fromWei((await usdc.balanceOf(address)).toString()).toFixed(
        4
      ),
      "balance of address USDC"
    );
  }
  const transactionDelay = 30;
  const getExpiration = () => {
    const timeout = transactionDelay
      ? parseFloat(transactionDelay) * 60
      : 4 * 3600;
    return ((Date.now() / 1000) | 0) + timeout;
  };

  async function printSingleNFTBalance(nftId) {
    console.log(
      FixBigNumber.fromWei(
        (await escrow.balanceOfNFT(nftId)).toString()
      ).toFixed(4),
      "Balance of NFT ID ",
      nftId
    );
  }
  async function printUserVeloBalances() {
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(admin.address)).toString()
      ).toFixed(4),
      "User 1 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(alice.address)).toString()
      ).toFixed(4),
      "User 2 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(bob.address)).toString()
      ).toFixed(4),
      "User 3 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(carol.address)).toString()
      ).toFixed(4),
      "User 4 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(teamMultisig.address)).toString()
      ).toFixed(4),
      "User 5 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(asim1.address)).toString()
      ).toFixed(4),
      "User 6 balance of"
    );
    console.log(
      FixBigNumber.fromWei(
        (await velo.balanceOf(asim2.address)).toString()
      ).toFixed(4),
      "User 7 balance of"
    );
    console.log(
      FixBigNumber.fromWei((await velo.totalSupply()).toString()).toFixed(4),
      "VELO TOTAL supply"
    );

    console.log(
      "END OF VELO BALANCES---------------------------------------------"
    );
  }

  async function printUserNFTBalances() {
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(1)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 1"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(2)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 2"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(3)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 3"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(4)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 4"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(5)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 5"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(6)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 6"
    );
    console.log(
      FixBigNumber.fromWei((await escrow.balanceOfNFT(7)).toString()).toFixed(
        4
      ),
      "Balance of NFT USER 7"
    );

    console.log(
      "END OF NFT BALANCES PRINT -----------------------------------------------------"
    );
  }

  async function distributeVelo() {
    const valueToTransfer = ethers.utils.parseUnits("100000", 18);
    await velo.transfer(alice.address, valueToTransfer);
    await velo.transfer(bob.address, valueToTransfer);
    await velo.transfer(carol.address, valueToTransfer);
    await velo.transfer(teamMultisig.address, valueToTransfer);
    await velo.transfer(asim1.address, valueToTransfer);
    await velo.transfer(asim2.address, valueToTransfer);

    console.log(
      "END OF VELO DISTRIBUTION -----------------------------------------------------"
    );
  }

  async function distributeUsdc() {
    const valueToTransfer = ethers.utils.parseUnits("100000", 18);
    await usdc.transfer(alice.address, valueToTransfer);
    await usdc.transfer(bob.address, valueToTransfer);
    await usdc.transfer(carol.address, valueToTransfer);
    await usdc.transfer(teamMultisig.address, valueToTransfer);
    await usdc.transfer(asim1.address, valueToTransfer);
    await usdc.transfer(asim2.address, valueToTransfer);

    console.log(
      "END OF USDC DISTRIBUTION -----------------------------------------------------"
    );
  }

  async function distributeJTRY() {
    const valueToTransfer = ethers.utils.parseUnits("100000", 18);
    await jTRY.transfer(alice.address, valueToTransfer);
    await jTRY.transfer(bob.address, valueToTransfer);
    await jTRY.transfer(carol.address, valueToTransfer);
    await jTRY.transfer(teamMultisig.address, valueToTransfer);
    await jTRY.transfer(asim1.address, valueToTransfer);
    await jTRY.transfer(asim2.address, valueToTransfer);

    console.log(
      "END OF JTRY DISTRIBUTION -----------------------------------------------------"
    );
  }

  async function createLockForUser(amount, duration, signer) {
    await velo.connect(signer).approve(escrow.address, amount);
    await escrow.connect(signer).create_lock(amount, duration);
    console.log("Lock created------------------------------------------");
  }

  async function addLiquidityForUser(signer, deadline) {
    await velo
      .connect(signer)
      .approve(
        router.address,
        ethers.utils.parseUnits("1000000000000000000", 18)
      );
    await usdc
      .connect(signer)
      .approve(
        router.address,
        ethers.utils.parseUnits("10000000000000000000", 18)
      );
    // addinng liquiduty
    await router
      .connect(signer)
      .addLiquidity(
        velo.address,
        usdc.address,
        false,
        ethers.utils.parseUnits("10000", 18),
        ethers.utils.parseUnits("1000", 18),
        0,
        0,
        signer.address,
        deadline
      );

    console.log("Liquiduty Added-------------------------------------------");
  }

  async function addLiquidityForUserJTRYPair(signer, deadline) {
    await jTRY
      .connect(signer)
      .approve(
        router.address,
        ethers.utils.parseUnits("1000000000000000000", 18)
      );
    await usdc
      .connect(signer)
      .approve(
        router.address,
        ethers.utils.parseUnits("10000000000000000000", 18)
      );
    // addinng liquiduty
    await router
      .connect(signer)
      .addLiquidity(
        jTRY.address,
        usdc.address,
        false,
        ethers.utils.parseUnits("10000", 18),
        ethers.utils.parseUnits("1000", 18),
        0,
        0,
        signer.address,
        deadline
      );

    console.log(
      "Liquiduty Added JTRYy-------------------------------------------"
    );
  }

  async function swapForUser(from, to, amount, signer) {
    await velo.connect(signer).approve(router.address, amount);
    await usdc.connect(signer).approve(router.address, amount);

    let expectedAmoutOut = await router.getAmountsOut(amount, [
      [from, to, false],
    ]);
    // console.log(expectedAmoutOut);
    // swapping
    await router
      .connect(signer)
      .swapExactTokensForTokens(
        amount,
        expectedAmoutOut[1],
        [[from, to, false]],
        signer.address,
        getExpiration()
      );
  }

  describe("Deployment", function () {
    xit("Should deploy the contracts", async function () {
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
      xit("Pre-req", async function () {
        await deployContracts();
        await printUserVeloBalances();
        await printUserNFTBalances();
        await distributeVelo();
        await distributeUsdc();
        await distributeJTRY();
        await printUserVeloBalances();
      });

      it.only("Empty", async function () {
        
      })

      xit("Create a pair ", async function () {
        // deploying new contracts
        // await deployContracts();

        // craeting pair
        await pairFactory.createPair(velo.address, usdc.address, false);

        console.log(await pairFactory.allPairs(0), "Pair address");
        let pair = await pairFactory.allPairs(0);
        pairUSDC = await ethers.getContractAt("Pair", pair);

        console.log(await pairUSDC.name(), "Pair name");
      });

      xit("Create a 2nd piar ", async function () {
        // deploying new contracts
        // await deployContracts();

        // craeting pair
        await pairFactory.createPair(jTRY.address, usdc.address, false);

        console.log(await pairFactory.allPairs(1), "Pair address");
        let pair = await pairFactory.allPairs(1);
        pairJTRY = await ethers.getContractAt("Pair", pair);
        console.log(
          pairJTRY.address,
          "Pair in deploy&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
        );

        console.log(await pairJTRY.name(), "Pair name");
      });

      xit("Creating guage", async function () {
        let pair = await pairFactory.allPairs(0);
        // pair = await ethers.getContractAt("Pair", pair);
        let tx = await voter.createGauge(pair);
        // tx = await tx.wait();
        // console.log(tx.log);
      });

      xit("Creating 2nd guage", async function () {
        let pair = await pairFactory.allPairs(1);
        // pair = await ethers.getContractAt("Pair", pair);
        let tx = await voter.createGauge(pair);
        // tx = await tx.wait();
        // console.log(tx.log);
      });

      xit("Create lock user 1", async function () {
        let pair = await pairFactory.allPairs(0);
        let valueForLock = ethers.utils.parseUnits("1000", 18);
        let duration = WEEK * 52;
        await createLockForUser(valueForLock, duration, admin);
        await createLockForUser(valueForLock, duration, alice);
        await createLockForUser(valueForLock, duration, bob);
        await createLockForUser(valueForLock, duration, carol);
        await printUserNFTBalances();
        await printUserVeloBalances();
        const amountToTransfer = ethers.utils.parseUnits("1000", 18);
        const minAMount = ethers.utils.parseUnits("100", 18);
        let quoteLiq = await router.quoteAddLiquidity(
          velo.address,
          usdc.address,
          false,
          amountToTransfer,
          minAMount
        );
        // console.log(quoteLiq);
        const deadline = (await time.latest()) + 86400;

        // add liq
        await addLiquidityForUser(admin, deadline);
        await addLiquidityForUserJTRYPair(alice, deadline);

        // deposit LP to guaage
        const guageAddressUSDC = await voter.gauges(pairUSDC.address);
        const guageAddressjTRY = await voter.gauges(pairJTRY.address);

        pairUSDC = await ethers.getContractAt("Pair", pair);

        // await addLiquidityForUser(alice, deadline);

        await pairUSDC
          .connect(admin)
          .approve(
            guageAddressUSDC,
            ethers.utils.parseUnits("10000000000", 18)
          );

        await pairJTRY
          .connect(alice)
          .approve(
            guageAddressjTRY,
            ethers.utils.parseUnits("10000000000", 18)
          );

        let guage = await ethers.getContractAt("Gauge", guageAddressUSDC);
        let guageJtry = await ethers.getContractAt("Gauge", guageAddressjTRY);
        await guage.connect(admin).depositAll(1);
        await guageJtry.connect(alice).depositAll(2);

        console.log(
          "Deposited to guage------------------------------------------"
        );

        await printSingleVeloBalance(admin.address, "admin");
        await printSingleNFTBalance(1);

        await printSingleVeloBalance(alice.address, "alice");

        await voter.connect(admin).vote(1, [pairUSDC.address], [9900]);
        await voter.connect(alice).vote(2, [pairUSDC.address], [9900]);
        await voter.connect(bob).vote(3, [pairJTRY.address], [9900]);
        await voter.connect(carol).vote(4, [pairJTRY.address], [9900]);

        // await swapForUser(
        //   velo.address,
        //   usdc.address,
        //   FixBigNumber.toWei(100).toFormat(),
        //   alice
        // );
        // await swapForUser(
        //   velo.address,
        //   usdc.address,
        //   FixBigNumber.toWei(200).toFormat(),
        //   alice
        // );
        // await swapForUser(
        //   velo.address,
        //   usdc.address,
        //   FixBigNumber.toWei(300).toFormat(),
        //   alice
        // );
        // await swapForUser(
        //   usdc.address,
        //   velo.address,
        //   FixBigNumber.toWei(300).toFormat(),
        //   alice
        // );
        // await swapForUser(
        //   usdc.address,
        //   velo.address,
        //   FixBigNumber.toWei(300).toFormat(),
        //   alice
        // );

        const feesPairAdd = await pairUSDC.fees();
        await printSingleVeloBalance(alice.address, "alice");
        await printSingleUSDCBalance(alice.address, "alice");

        await printSingleVeloBalance(bob.address, "bob");
        await printSingleUSDCBalance(bob.address, "bob");

        console.log(await velo.balanceOf(feesPairAdd), "Velo fees");
        console.log(await usdc.balanceOf(feesPairAdd), "usdc fees");

        await printSingleVeloBalance(
          admin.address,
          "admin before prank------------------"
        );

        // changing team to alice
        await minter.setTeam(asim1.address);

        await minter.connect(asim1).acceptTeam();
        // PRANK
        await time.increase(WEEK);
        // await printSingleVeloBalance(admin.address, "admin before dist");
        // await printSingleVeloBalance(alice.address, "alice before dist");
        // await printSingleVeloBalance(bob.address, "bob before dist");
        await printLockBalanceofNFT(1, "admin locked balance");
        await printLockBalanceofNFT(2, "alice locked balance");
        await printLockBalanceofNFT(3, "bob locked balance");

        // console.log(await velo.balanceOf(voter.address), "Voter before");
        console.log(await velo.balanceOf(guage.address), "Guage before");
        // await voter.distribute1(guageAddressUSDC);
        // await time.increase(WEEK);

        console.log(await velo.balanceOf(guageAddressUSDC), "Guage 1 before");
        console.log(await velo.balanceOf(guageAddressjTRY), "Guage 2 before");
        await voter.distribute2([guageAddressUSDC, guageAddressjTRY]);
        console.log(await velo.balanceOf(guageAddressUSDC), "Guage 1 after");
        console.log(await velo.balanceOf(guageAddressjTRY), "Guage 2 after");

        // await time.increase(WEEK-86400);

        await distributor.connect(admin).claim(1);
        await distributor.connect(alice).claim(2);
        await distributor.connect(bob).claim(3);

        await printLockBalanceofNFT(1, "admin locked balance after");
        await printLockBalanceofNFT(2, "alice locked balance after");
        await printLockBalanceofNFT(3, "bob locked balance after");
        // await guage.getReward(admin.address, [velo.address]);
        // await guage.connect(alice).getReward(alice.address, [velo.address]);
        // await guage.connect(bob).getReward(bob.address, [velo.address]);

        console.log(await velo.balanceOf(guage.address), "Guage after");
        // console.log(await velo.balanceOf(voter.address), "Voter after");

        // await voter.distribute1(guageAddress);
        // console.log(await velo.balanceOf(voter.address), "Voter after 3nd disttt");

        // await guage.getReward(admin.address, [velo.address]);
        // await guage.connect(alice).getReward(alice.address, [velo.address]);
        // await guage.connect(bob).getReward(bob.address, [velo.address]);
        // // await voter.connect(alice).claimRewards([guageAddress],[[velo.address]]);
        // await printSingleVeloBalance(admin.address, "admin after dist");
        // await printSingleVeloBalance(alice.address, "alice after dist");
        // await printSingleVeloBalance(bob.address, "bob after dist");

        // // await printSingleUSDCBalance(alice.address, "alice usdc");

        // // await printSingleVeloBalance(bob.address);
        // // await printSingleUSDCBalance(bob.address);

        // await time.increase(WEEK);

        // await voter.distribute1(guageAddress);
        // // await voter.connect(alice).claimRewards([guageAddress],[[velo.address]]);
        // await printSingleVeloBalance(alice.address, "alice after dist 2");
        // // await printSingleUSDCBalance(alice.address, "alice usdc");
        // await printSingleVeloBalance(admin.address, "admin after dist 2");

        // await time.increase(WEEK);

        // await voter.distribute1(guageAddress);
        // // await voter.connect(alice).claimRewards([guageAddress],[[velo.address]]);
        // await printSingleVeloBalance(alice.address, "alice after dist 3");
        // // await printSingleUSDCBalance(alice.address, "alice usdc");
        // await printSingleVeloBalance(admin.address, "admin after dist 3");

        // await pair.connect(alice).claimFees();
        // await pair.connect(bob).claimFees();

        // console.log(await velo.balanceOf(feesPairAdd), "Velo fees");
        // console.log(await usdc.balanceOf(feesPairAdd), "usdc fees");

        // await printSingleVeloBalance(alice.address, "alice");
        // await printSingleUSDCBalance(alice.address, "alice");
        // await printSingleVeloBalance(bob.address, "bob");
        // await printSingleUSDCBalance(bob.address, "bob");

        // console.log(
        //   await escrow.balanceOfNFT(1),
        //   "Balance of nft before claiabme"
        // );
        // console.log(await distributor.claimable(1), "claimable after prank");

        // await distributor.claim(1);
        // console.log(
        //   await escrow.balanceOfNFT(1),
        //   "Balance of nft after distribute"
        // );

        // await printSingleVeloBalance(admin.address);
        // await printSingleVeloBalance(alice.address);
        // await printSingleNFTBalance(1);
        // await printSingleVeloBalance(admin.address);
        // await printSingleUSDCBalance(admin.address);

        // await printSingleVeloBalance(alice.address);
        // await printSingleUSDCBalance(alice.address);
        // await printSingleVeloBalance(admin.address);
        // await printSingleUSDCBalance(admin.address);

        // console.log(guageAddress, "guageAddress");

        // console.log(await velo.balanceOf(feesPairAdd), "Velo fees");
        // console.log(await usdc.balanceOf(feesPairAdd), "usdc fees");
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

      it("Empty", async function () {
        await deployContracts();
      });

      xit("Simulate rewards", async function () {
        console.log(await escrow.balanceOf(asim1.address), "asim 1 balance");
        console.log(await escrow.balanceOf(asim2.address), "asim 2 balance");

        console.log(
          await escrow.tokenOfOwnerByIndex(asim1.address, 0),
          "NFT id "
        );
        console.log(
          await escrow.tokenOfOwnerByIndex(asim2.address, 0),
          "NFT id "
        );

        console.log(await escrow.balanceOfNFT(1), "Balance of NFT 1");
        console.log(await escrow.balanceOfNFT(2), "Balance of NFT 2");
        console.log(await minter.active_period(), "Active period before");
        let pair = await pairFactory.allPairs(0);

        // now voting to pool
        await voter.connect(asim1).vote(1, [pair], [9900]);
        await voter.connect(asim2).vote(2, [pair], [5000]);

        await time.increase(WEEK);

        console.log(await escrow.balanceOfNFT(1), "Balance of NFT 1 after");
        console.log(await escrow.balanceOfNFT(2), "Balance of NFT 2 after");
        console.log(await minter.active_period(), "Active period after");

        // updating period in minter
        // await minter.update_period();
        const guageAddress = await voter.gauges(pair);
        await voter.distribute1(guageAddress);
        // await distributor.claim(1);
        // await distributor.claim(2);
        await time.increase(WEEK);
        await voter.distribute1(guageAddress);
        console.log(await minter.active_period(), "Active period after WEEK2");
        await distributor.claim(1);

        await time.increase(WEEK);
        await voter.distribute1(guageAddress);
        console.log(await minter.active_period(), "Active period after WEEK 3");
        await distributor.claim(1);

        await time.increase(WEEK);
        await voter.distribute1(guageAddress);
        console.log(await minter.active_period(), "Active period after WEEK 4");
        console.log(
          await minter.active_period(),
          "Active period after update period"
        );
        await distributor.claim(1);

        console.log(await escrow.balanceOfNFT(1), "Balance of NFT 1 after");
        console.log(await escrow.balanceOfNFT(2), "Balance of NFT 2 after");

        // now distriuting the fees
      });
    });
  });
});

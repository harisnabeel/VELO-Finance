const hre = require("hardhat");

async function verifyContract(contractsAddress, constructorArgs) {
  try {
    await hre.run("verify:verify", {
      address: contractsAddress,
      constructorArguments: constructorArgs,
    });
  } catch (e) {
    console.log("Error in verifying ", contractsAddress, " contract");
  }
}

module.exports = {
  verifyContract,
};

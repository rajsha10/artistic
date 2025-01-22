const hre = require("hardhat");

async function main() {
  // Deploy the ArtValley contract
  const ArtValley = await hre.ethers.getContractFactory("ArtValley");
  const artValley = await ArtValley.deploy();
  await artValley.deployed();
  console.log("ArtValley deployed at:", artValley.address);

  // Deploy the Profile contract with the ArtValley contract address
  const Profile = await hre.ethers.getContractFactory("Profile");
  const profile = await Profile.deploy(artValley.address);
  await profile.deployed();
  console.log("Profile deployed at:", profile.address);
}

// Catch errors and run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

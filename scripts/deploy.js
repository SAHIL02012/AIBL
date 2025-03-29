const main = async () => {
    const contractFactory = await ethers.getContractFactory('ImageNFT');
    const vrf= await ethers.getContractFactory('RandomNumberGenerator')
    const contract = await contractFactory.deploy();
    const contract2 = await vrf.deploy();
    await contract.waitForDeployment();
    await contract2.waitForDeployment();
 
    console.log("Random number contract deployed to ", contract2.target);
    console.log("ImageNFT", contract.target);
}
 
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
 
runMain();
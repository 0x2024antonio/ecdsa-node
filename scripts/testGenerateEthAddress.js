const fs = require("fs").promises;
const path = require("path");
const {
  getPrivateKey,
  getPublicKey,
  getEthAddress,
} = require("./lib/generateEthAddress");

const main = async () => {
  const output = [];
  const outputPath = path.join(__dirname, "output.txt");
  const numEthAddress = 3;

  for (let i = 0; i < numEthAddress; ++i) {
    const { privateKey, privateKeyHex } = getPrivateKey();
    const { publicKey, publicKeyHex } = getPublicKey(privateKey);
    const ethAddress = getEthAddress(publicKey);

    output.push({
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
      ethAddress: ethAddress,
    });
  }

  console.log(output);

  await fs.writeFile(outputPath, JSON.stringify(output));

  console.log(`Written to ${outputPath} successfully`);
};

main();

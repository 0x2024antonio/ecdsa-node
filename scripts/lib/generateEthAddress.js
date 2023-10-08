const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const getPrivateKey = () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  return {
    privateKey: privateKey,
    privateKeyHex: toHex(privateKey),
  };
};

const getPublicKey = (privateKey, isCompressed = false) => {
  const publicKey = secp256k1.getPublicKey(privateKey, isCompressed);
  return {
    publicKey: publicKey,
    publicKeyHex: toHex(publicKey),
  };
};

const getEthAddress = (publicKey) => {
  const ethAddressNoCheckSum = toHex(
    keccak256(publicKey.slice(1)).slice(-20)
  ).toLowerCase();
  const ethAddressNoCheckSumHashHex = toHex(
    keccak256(utf8ToBytes(ethAddressNoCheckSum))
  );
  const tempArray = [];

  const isNumberChar = (char) => {
    return /^[0123456789]$/.test(char);
  };

  const isHexChar = (char) => {
    return /^[abcdef]$/.test(char);
  };

  const isTargetChar = (char) => {
    return /^[89abcdef]$/.test(char);
  };

  [...ethAddressNoCheckSum].forEach((char, index) => {
    if (isNumberChar(char)) {
      tempArray.push(char);
    } else if (isHexChar(char.toLowerCase())) {
      tempArray.push(
        isTargetChar(ethAddressNoCheckSumHashHex[index])
          ? char.toUpperCase()
          : char.toLowerCase()
      );
    } else {
      console.log("invalid characters being input");
    }
  });

  const ethAddress = "0x" + tempArray.join("");

  return ethAddress;
};

module.exports = { getPrivateKey, getPublicKey, getEthAddress };

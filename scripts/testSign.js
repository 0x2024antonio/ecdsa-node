const {
  getPrivateKey,
  getPublicKey,
  getEthAddress,
} = require("../server/lib/generateEthAddress");

const {
  signMessage,
  isSigned,
  getRecoveredPublicKey,
} = require("../server/lib/signMessage");

const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");

const { privateKey, privateKeyHex } = getPrivateKey();
const { publicKey, publicKeyHex } = getPublicKey(hexToBytes(privateKeyHex));
const ethAddress = getEthAddress(hexToBytes(publicKeyHex));

console.log(privateKeyHex);
console.log(publicKeyHex);
console.log(ethAddress);

const message = "Antonio-Ethereum";
const messageHash = keccak256(utf8ToBytes(message));
const signature = signMessage(messageHash, privateKey);
const isSignValid = isSigned(signature, messageHash, publicKey);
const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
const { recoveredPublicKeyHex, recoveredPublicKey } = getRecoveredPublicKey(
  recoveredPublicKeyPoint
);
const recoveredEthAddress = getEthAddress(recoveredPublicKey);

console.log(isSignValid);
console.log(recoveredPublicKeyPoint);
console.log(recoveredPublicKeyHex);
console.log(recoveredEthAddress);

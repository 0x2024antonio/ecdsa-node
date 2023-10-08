const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const signMessage = (messageHash, privateKey) => {
  return secp256k1.sign(messageHash, privateKey);
};

const isSigned = (signature, messageHash, publicKey) => {
  return secp256k1.verify(signature, messageHash, publicKey);
};

const getRecoveredPublicKey = (point, isCompressed = false) => {
  const { px, py, pz } = point;
  const projectivePoint = new secp256k1.ProjectivePoint(px, py, pz);
  return {
    recoveredPublicKey: projectivePoint.toRawBytes(isCompressed),
    recoveredPublicKeyHex: projectivePoint.toHex(isCompressed),
  };
};

module.exports = { signMessage, isSigned, getRecoveredPublicKey };

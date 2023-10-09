const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const signMessage = (messageHash, privateKey) => {
  return secp256k1.sign(messageHash, privateKey);
};

const isSigned = (signature, messageHash, publicKey) => {
  return secp256k1.verify(signature, messageHash, publicKey);
};

const getSignature = (signatureObject) => {
  return new secp256k1.Signature(
    signatureObject.r,
    signatureObject.s,
    signatureObject.recovery
  );
};

const getRecoveredPublicKey = (point, isCompressed = false) => {
  const { px, py, pz } = point;
  const projectivePoint = new secp256k1.ProjectivePoint(px, py, pz);
  return {
    recoveredPublicKey: projectivePoint.toRawBytes(isCompressed),
    recoveredPublicKeyHex: projectivePoint.toHex(isCompressed),
  };
};

const getRecoveredPublicKeyFromSignatureObject = (
  signatureObject,
  messageHash
) => {
  const signature = getSignature(signatureObject);
  const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
  return getRecoveredPublicKey(recoveredPublicKeyPoint);
};

module.exports = {
  signMessage,
  isSigned,
  getSignature,
  getRecoveredPublicKey,
  getRecoveredPublicKeyFromSignatureObject,
};

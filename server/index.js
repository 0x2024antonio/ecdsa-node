const { getEthAddress } = require("./lib/generateEthAddress");
const {
  getRecoveredPublicKeyFromSignatureObject,
} = require("./lib/signMessage");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x7C658Ec3540aFC8eFD6E74A2C03E9b8C8E93Dfdf": 100,
  // privateKey: '3afc5d93aedd1567aa317bc04e0f318496678df9a3ff766dd1ad35449480dcfb'
  "0x10EfAD1b1739645B6DF5DB559D51E6C1aCd3b239": 50,
  // privateKey: '9b052baf28c2e3a077250f1a49682de7ea737c3839f6b8e5834f19c2ae496ee3'
  "0x91a75B652a50eCfC2d58C70Cf0567E85839f4E74": 75,
  // privateKey: '0e4d4cb5f6d5e5ec7674a9f15380bfa35d8d1a7ab178ce0070d4c0da13c6a522'
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, messageHashHex, signatureString } =
    req.body;

  /* Here we gets signature and messageHash from the request */
  /* The goal is to recover an eth address from the above" */
  /* If the recovered eth address is not the same as the sender, the transaction is not valid */

  signatureObject = JSON.parse(signatureString, (key, value) => {
    if (typeof value === "string" && value.startsWith("BIGINT::")) {
      return BigInt(value.substring(8));
    }
    return value;
  });

  const { recoveredPublicKey } = getRecoveredPublicKeyFromSignatureObject(
    signatureObject,
    messageHashHex
  );

  const ethAddress = getEthAddress(recoveredPublicKey);

  if (sender !== ethAddress) {
    console.log("signature is not valid");
    return false;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

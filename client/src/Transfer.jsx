import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils";

const hashMessage = (message) => {
  return keccak256(utf8ToBytes(message));
};

const signMessage = (messageHash, privateKeyBytes) => {
  return secp256k1.sign(messageHash, privateKeyBytes);
};

const getSignatureString = (messageHash, privateKey) => {
  const signature = signMessage(messageHash, hexToBytes(privateKey));
  const signatureString = JSON.stringify(signature, (key, value) => {
    return typeof value === "bigint" ? "BIGINT::" + value.toString() : value;
  });
  return signatureString;
};

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message = `${address};${recipient};${sendAmount}`;
    const messageHash = hashMessage(message);
    const signatureString = getSignatureString(messageHash, privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        messageHashHex: toHex(messageHash),
        signatureString: signatureString,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

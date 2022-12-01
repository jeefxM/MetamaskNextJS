import { useState } from "react";
import { recoverTypedSignature } from "@metamask/eth-sig-util";
import { toChecksumAddress } from "ethereumjs-util";

import Web3 from "web3";

export default function Home() {
  const [activeAccount, setActiveAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [signedResult, setSignedResult] = useState("");

  const metamaskLogin = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setActiveAccount(accounts);
        setChainId(window.ethereum.networkVersion);
      }); // Basic Metamask SignIn to get User's public address and ChainId
  };

  const signDataV4 = async () => {
    const { ethereum } = window;
    const web3 = new Web3(window.ethereum);
    const msgParams = {
      domain: {
        chainId: chainId.toString(),
        name: "Ether Mail",
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        version: "1",
      },
      message: {
        contents: "Hello, User!",
        from: {
          name: "OSFD Intern DAO",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      primaryType: "Mail",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    };
    try {
      const from = await web3.eth.getAccounts();
      const sign = await ethereum.request({
        method: "eth_signTypedData_v4",
        params: [from[0], JSON.stringify(msgParams)],
      });
      setSignedResult(sign);
      // puts the result in "signed-result" html element for using it in another function
    } catch (err) {
      console.error(err);
    }
  }; // Signing message with signTypedDataV4
  ////////////////////////////////////////////////////////////////////////
  const signTypedDataV4Verify = async () => {
    const web3 = new Web3(window.ethereum);
    const msgParams = {
      domain: {
        chainId,
        name: "Ether Mail",
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        version: "1",
      },
      message: {
        contents: "Hello, User!",
        from: {
          name: "OSFD Intern DAO",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      primaryType: "Mail",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    };

    try {
      const from = await web3.eth.getAccounts();
      const verifiedResult = document.getElementById("verified-result");
      const sign = signedResult; //takes the previous function's value and puts it into sign variable

      const recoveredAddr = recoverTypedSignature({
        data: msgParams,
        signature: sign,
        version: "V4",
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from[0])) {
        //Checks if the previous result equals to User's public address
        verifiedResult.innerHTML = `Successfully verified signer as : ${recoveredAddr}`;
      } else {
        verifiedResult.innerHTML = `Failed to verify signer. Please make sure you are on correct chain!`;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="" style={{}}>
        <a>
          <button
            onClick={metamaskLogin}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 a absolute right-7 top-10 "
          >
            Sign in with Metamask
          </button>
        </a>

        <div className="flex flex-col text-gray-900 object-center gap-y-2 pt-48 pl-8 ">
          <p className="text-2xl">
            Active Account:<span>{activeAccount}</span>
          </p>

          <p className="text-2xl">
            ChainId: <span>{chainId}</span>
          </p>

          <a>
            <img src="noun-205.png" className="max-w-sm"></img>
          </a>

          <button
            onClick={signDataV4}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 mt-12 rounded w-48 "
          >
            Sign Typed Data V4
          </button>
          <span className="text-lg">{signedResult}</span>
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded  w-48"
            onClick={signTypedDataV4Verify}
          >
            Verify
          </button>
          <span id="verified-result" className="text-lg "></span>
        </div>
      </div>
    </div>
  );
}

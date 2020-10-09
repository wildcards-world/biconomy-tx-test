import React from 'react'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import jsonInterface from './WildcardSteward_v3_matic.json'
// import web3 from 'web3'

var Contract = require('web3-eth-contract');

import { toBuffer } from "ethereumjs-util";
import abi from "ethereumjs-abi";
import events from "events";

/******
 * HELPER CODE
 */


  const constructMetaTransactionMessage = (nonce, chainId, functionSignature, contractAddress) => {
     return abi.soliditySHA3(
        ["uint256","address","uint256","bytes"],
        [nonce, contractAddress, chainId, toBuffer(functionSignature)]
    );
  }

  const getSignatureParameters = signature => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v
    };
  };

const executeMetaTransaciton = async (userAddress, functionSignature, contract, contractAddress, chainId) => {
  var eventEmitter = new events.EventEmitter();
  if(contract && userAddress && functionSignature, chainId, contractAddress) {
    let nonce = 0;
    // let nonce = await contract.methods.getNonce(userAddress).call();
    let messageToSign = constructMetaTransactionMessage(nonce, chainId, functionSignature, contractAddress);

    const signature = await web3.eth.personal.sign(
      "0x" + messageToSign.toString("hex"),
      userAddress
    );

    console.info(`User signature is ${signature}`);
    let { r, s, v } = getSignatureParameters(signature);

    console.log("before transaction listener");
    // No need to calculate gas limit or gas price here
    // let transactionListener = contract.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).send({
    //     from: userAddress
    // });

    // transactionListener.on("transactionHash", (hash)=>{
    //   eventEmitter.emit("transactionHash", hash);
    // }).once("confirmation", (confirmation, recipet) => {
    //   eventEmitter.emit("confirmation", confirmation, recipet);
    // }).on("error", error => {
    //   eventEmitter.emit("error", error);
    // });

    return eventEmitter;
  } else {
    console.log("All params userAddress, functionSignature, chainId, contract address and contract object are mandatory");
  }
}
/******
 * HELPER CODE -end
 */

export const Biconomy = () => {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  console.log("account",account)
  Contract.setProvider(library);
  const contractAddress = '0x59b3c176c39bd8734717492f4da8fe26ff6a454d'

  var contract = new Contract(jsonInterface.abi, contractAddress)
  // console.log("the library", {library});
  // let web3 = new Web3(library);
  // console.log("web3", {web3})
  // Web3EthContract.setProvider(web3);

  console.log({cmethods: contract.methods});

  const sendTransaction = async () => {
    console.log("execute biconomy tx")
    let functionSignature = contract.methods.testFunctionThatDoesNothing(account).encodeABI();
    console.log("VERY IMPORTANT RESULT", result);
    // let result = contract.methods.testFunctionThatDoesNothing(account).send({
    //     from: account
    // });
    let result = await executeMetaTransaciton(account, functionSignature, contract, contractAddress, "4");
    
    result.on("transactionHash", (hash) => {
      // On transacion Hash
      console.log('hash',{hash})
    }).once("confirmation", (confirmation, recipet) => {
      console.log('confirmation',{confirmation, recipet})
      // On Confirmation
    }).on("error", error => {
      // On Error  
    })
  }

  return (
    <button onClick={sendTransaction}>Send Tx</button> 
  )
}

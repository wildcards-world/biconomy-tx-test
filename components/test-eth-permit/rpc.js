"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = exports.getChainId = exports.setChainIdOverride = exports.signData = exports.send = void 0;
const randomId = () => Math.floor(Math.random() * 10000000000);
exports.send = (provider, method, params) => new Promise((resolve, reject) => {
    console.log("Send 1")
    const payload = {
      id: randomId(),
      method,
      params,
      from: "0xd3Cbce59318B2E570883719c8165F9390A12BdD6"
    };
    console.log("Send 2", payload);
    const callback = (err, result) => {
      if (err) {
        console.log("Send 3", err);
        reject(err);
      }
      else if (result.error) {
        console.log("Send 4", result.error);
        console.error(result.error);
        reject(result.error);
      }
      else {
        console.log("Send 5", result.result);
        resolve(result.result);
        }
    };
    // let _provider = provider.provider || provider;
    // if (_rovider.sendAsync) {
    //     console.log("privoder send async")
    //     _provider.sendAsync(payload, callback);
    //   }
    //   else {

        console.log("privoder - normal send", payload)
        provider.send(payload, callback);
        // _provider.send(payload, callback);
    // }
});
exports.signData = (provider, fromAddress, typeData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("a-")
    const _typeData = typeof typeData === 'string' ? typeData : JSON.stringify(typeData);
    console.log("type data", _typeData);
    const result = yield exports.send(provider, 'eth_signTypedData', [fromAddress, JSON.parse(_typeData)]);
    console.log("b")
    return {
        r: result.slice(0, 66),
        s: '0x' + result.slice(66, 130),
        v: parseInt(result.slice(130, 132), 16),
    };
});
let chainIdOverride = null;
exports.setChainIdOverride = (id) => { chainIdOverride = id; };
exports.getChainId = (provider) => __awaiter(void 0, void 0, void 0, function* () { return chainIdOverride || exports.send(provider, 'eth_chainId'); });
exports.call = (provider, to, data) => exports.send(provider, 'eth_call', [{
        to,
        data,
    }, 'latest']);


let data = {"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Permit":[{"name":"holder","type":"address"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"expiry","type":"uint256"},{"name":"allowed","type":"bool"}]},"primaryType":"Permit","domain":{"name":"Dai Stablecoin","version":"1","chainId":"0x05","verifyingContract":"0x0099f841a6ab9a082828fac66134fd25c9d8a195"},"message":{"holder":"0xd3Cbce59318B2E570883719c8165F9390A12BdD6","spender":"0x89e2d4628435368a7CD72611E769dDe27802b95e","nonce":"0x0000000000000000000000000000000000000000000000000000000000000000","expiry":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","allowed":true}}


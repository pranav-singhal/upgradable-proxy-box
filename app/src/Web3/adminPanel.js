import Web3 from "web3";
import TokenProxyArtifacts from "../contracts/TokenProxy.json";
import TokenV0Artifacts from "../contracts/Token_V0.json";
import TokenV1Artifacts from "../contracts/Token_V1.json";


const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
// const web3 = window.web3;
let NETWORK_ID;
let TokenV0ABI;
let TokenV1ABI;
let TokenV0Address;
let TokenV1Address;
let ProxyABI;
let ProxyAddress;
let ProxyInstance;
let TokenV0Instance;
let TokenV1Instance;

let IMPLEMENTATION_ABI;
let IMPLEMENTATION_INSTANCE;
let IMPLEMENTATION_ADDRESS;

let OWN_ADDRESS;

export function connectToWeb3() {
    return new Promise((resolve, reject) => {
    let unImplementedAddress;
        web3.eth.net.getId(function (err, Id) {
            if (err) reject(err);
            NETWORK_ID = Id;
            ProxyAddress = TokenProxyArtifacts.networks[NETWORK_ID].address;
            TokenV0Address = TokenV0Artifacts.networks[NETWORK_ID].address;
            TokenV1Address = TokenV1Artifacts.networks[NETWORK_ID].address;

            ProxyABI = TokenProxyArtifacts.abi;
            TokenV0ABI = TokenV0Artifacts.abi;
            TokenV1ABI = TokenV1Artifacts.abi;

            ProxyInstance = new web3.eth.Contract(ProxyABI, ProxyAddress);
            TokenV0Instance = new web3.eth.Contract(TokenV0ABI, ProxyAddress);
            TokenV1Instance = new web3.eth.Contract(TokenV1ABI, ProxyAddress);
            getImplementationAddress().then(implementationAddress => {
                switch (implementationAddress) {
                    case TokenV0Address:
                        IMPLEMENTATION_ABI = TokenV0ABI;
                        IMPLEMENTATION_ADDRESS = TokenV0Address;
                        IMPLEMENTATION_INSTANCE = TokenV0Instance;
                        unImplementedAddress = TokenV1Address;
                        break;
                    case TokenV1Address:
                        IMPLEMENTATION_ABI = TokenV1ABI;
                        IMPLEMENTATION_ADDRESS = TokenV1Address;
                        IMPLEMENTATION_INSTANCE = TokenV1Instance;
                        unImplementedAddress = TokenV0Address;
                        break;
                    default:
                        break;

                }
                web3.eth.getAccounts((err, accounts) => {
                    if (err) reject(err);
                    OWN_ADDRESS = accounts[0];

                    resolve({IMPLEMENTATION_ADDRESS, unImplementedAddress});
                });

            });
        });
    });
}


export function getImplementationAddress() {
    return new Promise((resolve, reject) => {
        ProxyInstance.methods.implementation().call().then(implementationAddress => {
            resolve(implementationAddress)
        })
    })
}

/*export async function connectToMetamask() {
  return new Promise(resolve => {
    if (!web3) {
      alert("Metamask Not Installed");
    } else {
      // window.web3 = new Web3(web3.currentProvider);
      web3.eth.net.getId(function(err, Id) {
        if (err) throw err;
        if (Id != NETWORK_ID) {
          window.location.reload();
        }
        OWN_ADDRESS = web3.eth.accounts[0];
        console.log("hey", web3.eth.accounts);
        resolve(OWN_ADDRESS);
      });
    }
  });
}*/

/*export function checkForOwnerAddress() {
  return !!OWN_ADDRESS;
}

export function fetchOwnAddress() {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      window.ethereum
        .enable()
        .then(address => {
          OWN_ADDRESS = address[0];
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    } else if (web3.eth.accounts[0]) {
      OWN_ADDRESS = web3.eth.accounts[0];
      resolve(true);
    } else {
      alert("Login To Your Metamask Wallet");
      resolve(false);
    }
  });
}*/

/*export async function fetchAbiAndAdresses() {
  return fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${PROXY_ADDRESS}`,
    { method: "GET" }
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      return new Promise(function(resolve, reject) {
        PROXY_ABI = JSON.parse(data.result);
        PROXY_INSTANCE = web3.eth.contract(PROXY_ABI).at(PROXY_ADDRESS);
        PROXY_INSTANCE.implementation({ from: OWN_ADDRESS }, function(
          err,
          result
        ) {
          if (err) reject(err);
          resolve(result);
        });
      });
    })
    .then(result => {
      IMPLEMENTATION_ADDRESS = result;
      return fetch(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${IMPLEMENTATION_ADDRESS}`,
        { method: "GET" }
      );
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      IMPLEMENTATION_ABI = JSON.parse(data.result);
      IMPELEMENTATION_INSTANCE = web3.eth
        .contract(IMPLEMENTATION_ABI)
        .at(PROXY_ADDRESS);

      return fetchDecimals();
    })
    .then(decimals => {
      DECIMALS = parseInt(decimals, 10);
      console.log("While init", DECIMALS);
    })
    .catch(err => {
      console.log(err);
    });
}*/

/*
function fetchDecimals() {
  return new Promise((resolve, reject) => {
    IMPELEMENTATION_INSTANCE["decimals"](
      {
        from: OWN_ADDRESS
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.valueOf());
      }
    );
  });
}
*/

export async function getImplementationFunctions() {
    let rv = [];
    IMPLEMENTATION_ABI.forEach(ele => {
        if (ele.type === "function") {
            let objectToBeAppended = {};
            objectToBeAppended["funcName"] = ele["name"];
            let argsObject = [];

            ele.inputs.forEach(input => {
                argsObject.push(`${input.name} (${input.type})`);
            });

            objectToBeAppended["isView"] = ele.stateMutability === "view";
            objectToBeAppended["args"] = argsObject;

            rv.push(objectToBeAppended);
        }
    });
    return rv;
}

async function checkFunctionFormatting(functionName, args) {
    return new Promise((resolve, reject) => {
        let found = ProxyABI.find(element => {
            return element.name === functionName;
        });
        if (found) {
            // Function present in Proxy Contract
            checkWithABI(found, functionName, args, resolve, reject);
        } else {
            let nowFound = IMPLEMENTATION_ABI.find(element => {
                return element.name === functionName;
            });
            // Function present in Implementation Contract
            checkWithABI(nowFound, functionName, args, resolve, reject);
        }
    });
}

function checkForTokenHandlingArgument(arg) {
    if (arg === "amount" || arg === "value") return true;
    else return arg.substr(0, 1) === "amount" || arg.substr(0, 1) === "value";
}

/*function multiplyWithDecimals(val) {
  let splitVal = val.split(".");
  if (splitVal.length === 1) {
    let appendNum = 10 ** DECIMALS;
    return parseInt(splitVal[0] + appendNum.toString().substr(1));
  } else {
    let appendNum = 10 ** (DECIMALS - splitVal[1].length);
    return parseInt(splitVal[0] + splitVal[1] + appendNum.toString().substr(1));
  }
}*/

function checkWithABI(currentFunc, functionName, args, resolve, reject) {
    let rv = [];
    currentFunc.inputs.forEach(input => {
        if (!args[input.name])
            reject(new Error("INVALID ARGUMENTS: Invalid Number of arguments"));
        let callValue = args[input.name];
        let inputType = input.type;
        if (inputType.substr(0, 4) === "uint") {
            let notNum = isNaN(callValue);
            if (notNum || callValue.length === 0)
                reject(
                    new Error(
                        `INVALID ARGUMENTS: Only number can be passed in ${input.name}`
                    )
                );
            if (checkForTokenHandlingArgument(input.name)) {
                let val = callValue;
                console.log("checked value", val);
                rv.push(val);
            } else rv.push(parseInt(callValue));
        } else if (inputType === "address") {
            if (
                callValue.substr(0, 2) !== "0x" ||
                callValue.length !== 42 ||
                callValue.length === 0
            ) {
                reject(
                    new Error(
                        `INVALID ARGUMENTS: Only ethereum address can be passed in ${input.name}`
                    )
                );
            }

            rv.push(callValue);
        } else if (inputType === "string" || inputType.substr(0, 5) === "bytes") {
            // Nothing to do here bz everything is acceptable
            rv.push(callValue);
        }
    });
    resolve({rv, output: currentFunc.outputs[0]});
}

// function handleSpecialCase(funcName, rv, output, resolve, reject) {
//   let specialInstance = web3.eth
//     .contract(IMPLEMENTATION_ABI)
//     .at(IMPLEMENTATION_ADDRESS);
//   specialInstance[funcName](...rv, { from: OWN_ADDRESS }, function(
//     err,
//     result
//   ) {
//     if (err) reject(err);
//     console.log(result.toString(), "From web3");
//     let response = result.toString();
//     console.log(response);
//     resolve(response);
//   });
// }

export function callTransaction(functionName, args) {
    return new Promise((resolve, reject) => {
        checkFunctionFormatting(functionName, args)
            .then(({rv, output}) => {

                console.log(IMPLEMENTATION_INSTANCE);
                IMPLEMENTATION_INSTANCE.methods[functionName](...rv)
                    .call({from: OWN_ADDRESS})
                    .then(result => {
                        if (output && output["type"].substr(0, 4) === "uint") {
                            resolve(parseInt(result.valueOf()));
                            // handleExponentialNumber(result.valueOf(), resolve);
                        } else {
                            resolve(result);
                        }
                    })
                    .catch(reject);

            })
            .catch(err => {
                reject(err);
            });
    });
}

export function sendTransaction(functionName, args) {
    return new Promise((resolve, reject) => {
        checkFunctionFormatting(functionName, args)
            .then(({rv, output}) => {
                IMPLEMENTATION_INSTANCE.methods[functionName](...rv)
                    .send({from: OWN_ADDRESS})
                    .then(result => {
                        resolve(result);
                    })
                    .catch(reject);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function switchTo(address) {
    return new Promise((resolve, reject) => {
        ProxyInstance.methods.upgradeTo(address).send({from: OWN_ADDRESS}).then(result => {
          resolve(result)

        })

    })

}


/*function handleExponentialNumber(val, resolve) {
  let splitArray = val.split("e");
  if (splitArray.length === 1) {
    resolve(parseInt(val));
  } else {
    let base = parseFloat(splitArray[0], 10);
    let exponent = parseInt(splitArray[1], 10);
    let exponentAfterRemovingDecimals = exponent - DECIMALS;
    resolve(base * 10 ** exponentAfterRemovingDecimals);
  }
}*/

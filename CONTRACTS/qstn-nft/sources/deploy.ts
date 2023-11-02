import * as fs from 'fs';
import * as path from 'path';
import { Address, contractAddress, toNano, beginCell } from "ton";
import { NftCollection } from "./output/qstn_NftCollection";
import { prepareTactDeployment } from "@tact-lang/deployer";
 
// Parameters
let testnet = true;                                 // Flag for testnet or mainnet
let packageName = 'qstn_NftCollection.pkg';  // Name of your package to deploy
let outputPath = path.resolve(__dirname, 'output'); // Path to output directory
let owner = Address.parse('EQBqlsh4xzPIFJb50a1aU9Y_x9ASSz3GHtbnFePhSmEuYaSi');    // Our sample contract has an owner
const OFFCHAIN_CONTENT_PREFIX = 0x01;
const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();
let init = await NftCollection.init(owner, newContent, {
    $$type: "RoyaltyParams",
    numerator: 350n, // 350n = 35%
    denominator: 1000n,
    destination: owner,
});    // Create initial data for our contract
 
// Calculations
let address = contractAddress(0, init);     // Calculate contract address. MUST match with address in the verifier
let data = init.data.toBoc();               // Create init data
let pkg = fs.readFileSync(                  // Read package file
    path.resolve(outputPath, packageName)
);
 
// Prepare deploy
let link = await prepareTactDeployment({ pkg, data, testnet });
 
// Present a deployment link and contract address
console.log('Address: ' + address.toString({ testOnly: testnet }));
console.log('Deploy link: ' + link);
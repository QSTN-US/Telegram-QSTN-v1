import {beginCell, contractAddress, toNano, Address, TonClient, TonClient4, WalletContractV4, internal, fromNano} from "ton";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { sign } from "ton-crypto";
import { printAddress, printDeploy, printHeader } from "./utils/print";
// ================================================================= //
import { NftCollection } from "./output/qstn_NftCollection";
// ================================================================= //

(async () => {

    //create client for testnet Toncenter API
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: 'YOUR KEY'
    })

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    })

    // Insert your test wallet's 24 words, make sure you have some test Toncoins on its balance. Every deployment spent 0.5 test toncoin.
    //let mnemonics = "lonely, fitness, choose, road, visit, used, law, stadium, border, cup, drastic, decorate, valley, empty,black,sunset,menu,country,vibrant, alert,enjoy,fresh,upgrade,clerk";
    let mnemonics = "....";
    // read more about wallet apps https://ton.org/docs/participate/wallets/apps#tonhub-test-environment

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(","));
    let secretKey = keyPair.secretKey;
    //workchain = 1 - masterchain (expensive operation cost, validator's election contract works here)
    //workchain = 0 - basechain (normal operation cost, user's contracts works here)
    let workchain = 0; //we are working in basechain.

    //Create deployment wallet contract
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let contract = client.open(wallet);
    const sender = contract.sender(keyPair.secretKey);

    // Get deployment wallet balance
    let balance: bigint = await contract.getBalance();

        // Parameters
        let collection_address = Address.parse("EQA0Ryb-33AjJMpW1IZ9hIJXdHE4AGZyD3Rw6Bn6wcXTVbsB");

        let contract_address = await NftCollection.fromAddress(collection_address);
        let collection = client.open(contract_address);
        //const mint_result = await collection.send(sender, { value: toNano('0.1') }, "Mint");

        const NFT_OWNER = Address.parse('EQBqlsh4xzPIFJb50a1aU9Y_x9ASSz3GHtbnFePhSmEuYaSi');  //wallet contract address of current owner NFT
        const NFT_DST = Address.parse("0QA1VLEjE8suBqr0QoIfLuFxKwB496ANsiNw7Yf-k8FQkupV"); // destination wallet contract address
        const NFT_ITEM = Address.parse("kQBZEZCsBe6VpZ6iDWo6c90mjvK9K90Z67LDrhjDsoAvCcnZ"); // NFT item contract address, that will be transfered

        const seqno = await contract.getSeqno();
        const queryId = 0;
        const msgvalue = toNano("0.1");
        const forwardfee = toNano(1); // TODO need figure out how it should calculate
      
        //TLB: transfer#5fcc3d14 query_id:uint64 new_owner:address response_destination:address custom_payload:Maybe ^cell forward_amount:coins forward_payload:remainder<slice> = Transfer
        let msg_transfer_body = beginCell()
            .storeBuffer(Buffer.from("5fcc3d14", "hex"))
            .storeUint(queryId, 64)
            .storeAddress(NFT_DST)
            .storeAddress(NFT_OWNER)
            .storeUint(0,1)
            .storeCoins(forwardfee)
            .endCell()
    
    
        console.log('🛠️Preparing transfer NFT = ',NFT_ITEM ,' from ', NFT_OWNER);
        await contract.sendTransfer({
            seqno,
            secretKey,
            messages: [internal({
                value: msgvalue,
                to: NFT_ITEM,
                body: msg_transfer_body
            })]
        });
        console.log('======Sending NFT =', NFT_ITEM, ' to ', NFT_DST, ' ======');

        /*const mint_result = await collection.send(sender, { value: toNano('0.1') }, {
            $$type: 'MintItem',
            itemid: BigInt(2)
        });*/
        console.log('🛠️ new mint_result -> ✨✨✨')

})();
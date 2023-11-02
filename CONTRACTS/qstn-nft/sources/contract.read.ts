import { beginCell, contractAddress, toNano, Cell, Address, TonClient4 } from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
// ================================================================= //
import { NftCollection } from "./output/qstn_NftCollection";
// ================================================================= //

(async () => {
    const client = new TonClient4({
        // endpoint: "https://mainnet-v4.tonhubapi.com", // 🔴 Main-net API endpoint
        endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    });

    // Parameters
    let collection_address = Address.parse("EQDo3oy6XnM7dNdhPCMnkqNqaKCv3G7nwiLhUR3Sb6G1vZxS");

    let contract_address = await NftCollection.fromAddress(collection_address);
    let client_open = client.open(contract_address);

    const nft_index = 0n;
    let address_by_index = await client_open.getGetNftAddressByIndex(nft_index);
    printHeader("QSTN NFT Contract");
    let data_by_index = await client_open.getGetNftContent(0);
    // printAddress(collection_address
    // printHeader("1234");
    console.log("NFT ID[" + nft_index + "]: " + address_by_index);
    console.log("NFT [" + nft_index + "]: ", data_by_index);
})();

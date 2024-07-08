import { toNano, beginCell, Address } from '@ton/core';
import { SurveysManagerNFT } from '../wrappers/NftManager';
import { Survey } from '../wrappers/Survey';
import { NftCollection, RoyaltyParams, loadLogEventMintRecord } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton/blueprint';

import { address } from '@ton/core';

const OFFCHAIN_CONTENT_PREFIX = 0x01;
const string_first = 'ipfs://QmcWREHkuy11theTtGH3WwMwnHRChYdDwqJcdF6P4kmF4K';
let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();
let royaltiesParam: RoyaltyParams = {
    $$type: 'RoyaltyParams',
    numerator: 350n, // 350n = 35%
    denominator: 1000n,
    destination: 'null' as unknown as Address,
};

export async function run(provider: NetworkProvider) {
    const manager = address('0QDfaviQSL-ZZFYJDHY37h90LmvAXUwgQL0FNCliT_h1kdrz');
    royaltiesParam.destination = manager;
    const managerContract = provider.open(await SurveysManagerNFT.fromInit(manager, 1111n));

    // await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.5'),
    //     },
    //     {
    //         $$type: 'Deploy',
    //         queryId: 0n,
    //     },
    // );

    // await provider.waitForDeploy(managerContract.address);
    // console.log('ID', await managerContract.address);

    // ________________________________________________________________________

    // await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('1'),
    //     },
    //     {
    //         $$type: 'CreateCollectionRequest',
    //         items_limit: BigInt(3),
    //         collection_content: newContent,
    //         royalty_params: royaltiesParam,
    //         survey_hash: '0x00000000',
    //     },
    // );

    const result = await managerContract.getCollectionsAmount();
    console.log('Surveys amount:', result);

    // ________________________________________________________________________

    const collectionContract = provider.open(await NftCollection.fromInit(managerContract.address, 1n));
    console.log('Collection address:', collectionContract.address);

    // ________________________________________________________________________

    // const string_item = 'ipfs://QmPHG7Cnu6DBCNo8yeDswk469q4TN6NbY1j1fnveTVs71z';
    // let itemContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_item).endCell();

    // await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.5'),
    //     },
    //     {
    //         $$type: 'MintRequest',
    //         item_id: 1n,
    //         owner: manager,
    //         payload: itemContent,
    //     },
    // );
}

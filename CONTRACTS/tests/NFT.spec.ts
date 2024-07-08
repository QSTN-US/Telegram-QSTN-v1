import { toNano, beginCell, Address } from '@ton/ton';
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
} from '@ton/sandbox';
import '@ton/test-utils';
import { printSeparator } from '../utils/print';
import { SurveysManagerNFT } from '../wrappers/NftManager';
import { NftCollection, RoyaltyParams, loadLogEventMintRecord } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem';

describe('contract', () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = 'https://ipfs.io/ipfs/QmX1dTFgWCbit7dWEkPA2cJE8ZJVhUw4KvQccCb9WW5sW7';
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();
    let royaltiesParam: RoyaltyParams = {
        $$type: 'RoyaltyParams',
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: 'null' as unknown as Address,
    };

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let creator: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let surveysManager: SandboxContract<SurveysManagerNFT>;
    let collection: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        creator = await blockchain.treasury('creator');
        user1 = await blockchain.treasury('user1');

        royaltiesParam.destination = creator.address;

        surveysManager = blockchain.openContract(await SurveysManagerNFT.fromInit(deployer.address, 1111n));

        const deployResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            deploy: true,
            success: true,
        });
    });

    it('Test', async () => {
        console.log('Deployer: ' + deployer.address);
        console.log('Creator: ' + creator.address);
        console.log('Next IndexID: ' + (await surveysManager.getCollectionsAmount()));
        console.log('Manager Address: ' + surveysManager.address);
    });

    it('Test Create collection in detail', async () => {
        let surveyCreateResult = await surveysManager.send(
            creator.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'CreateCollectionRequest',
                items_limit: BigInt(5),
                collection_content: newContent,
                royalty_params: royaltiesParam,
                survey_hash: '0x00000000',
            },
        );

        // printTransactionFees(surveyCreateResult.transactions);
        // prettyLogTransactions(surveyCreateResult.transactions);
    });

    it('should deploy correctly', async () => {
        await surveysManager.send(
            creator.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'CreateCollectionRequest',
                items_limit: BigInt(5),
                collection_content: newContent,
                royalty_params: royaltiesParam,
                survey_hash: '0x00000000',
            },
        );

        const collectionAmount = await surveysManager.getCollectionsAmount();
        expect(collectionAmount).toEqual(2n);

        collection = blockchain.openContract(await NftCollection.fromInit(surveysManager.address, 2n));
        const surveyHash = await collection.getSurveyHash();
        expect(surveyHash).toEqual('0x00000000');

        const mintResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'MintRequest',
                item_id: 2n,
                owner: user1.address,
                payload: newContent,
            },
        );

        const item = blockchain.openContract(await NftItem.fromInit(collection.address, 0n));
        const itemData = await item.getGetNftData();
        console.log('itemOwner: ' + itemData.individual_content.asSlice().toString());

        // console.log('collection: ' + collection.address);
        // console.log('item: ' + item.address);
        // printTransactionFees(mintResult.transactions);
        // prettyLogTransactions(mintResult.transactions);

        // let loadEvent = loadLogEventMintRecord(mintResult.externals[0].body.asSlice());
        // console.log('ItemId: ' + loadEvent.item_id);
        // console.log('The Random Number: ' + loadEvent.generate_number);

        // await collection.send(deployer.getSender(), { value: toNano(2) }, 'Mint');

        // let current_index = (await collection.getGetCollectionData()).next_item_index;
        // const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, 'Mint'); // Send Mint Transaction
        // expect(deploy_result.transactions).toHaveTransaction({
        //     from: deployer.address,
        //     to: collection.address,
        //     success: true,
        // });
        // let next_index = (await collection.getGetCollectionData()).next_item_index;
        // expect(next_index).toEqual(current_index + 1n);
        // printSeparator();

        // console.log('External Message(string - base64): ' + deploy_result.externals[0].body.toBoc().toString('base64'));
        // console.log('External Message(string - hex): ' + deploy_result.externals[0].body.toBoc().toString('hex'));
        // printSeparator();

        // // Print the Log Event of the Mint Record
        // let loadEvent = loadLogEventMintRecord(deploy_result.externals[0].body.asSlice());
        // console.log('ItemId: ' + loadEvent.item_id);
        // console.log('The Random Number: ' + loadEvent.generate_number);
    });
});

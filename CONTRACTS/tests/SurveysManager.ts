import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SurveysManager } from '../wrappers/SurveysManager';
import { Survey } from '../wrappers/Survey';
import '@ton/test-utils';

type LogsVerbosity = {
    print: boolean;
    blockchainLogs: boolean;
    vmLogs: Verbosity;
    debugLogs: boolean;
};

type Verbosity = 'none' | 'vm_logs' | 'vm_logs_full';

describe('Surveys', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let creator: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
    let user3: SandboxContract<TreasuryContract>;
    let surveysManager: SandboxContract<SurveysManager>;
    let survey: SandboxContract<Survey>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        blockchain.verbosity = {
            blockchainLogs: true,
            vmLogs: 'vm_logs_full',
            debugLogs: true,
        } as LogsVerbosity;

        deployer = await blockchain.treasury('deployer');

        surveysManager = blockchain.openContract(await SurveysManager.fromInit(deployer.address));

        await blockchain.setVerbosityForAddress(surveysManager.address, {
            blockchainLogs: true,
            debugLogs: true,
            vmLogs: 'vm_logs',
        });

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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and surveysManager are ready to use
    });

    it('should create new survey', async () => {
        deployer = await blockchain.treasury('deployer');
        creator = await blockchain.treasury('creator');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');
        user3 = await blockchain.treasury('user3');

        let createComission = await surveysManager.getCreateComission(BigInt(2), toNano('0.1'));

        let surveyCreateResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: createComission * BigInt(2),
            },
            {
                $$type: 'NewSurveyRequest',
                participantsLimit: BigInt(2),
                rewardAmount: toNano('0.1'),
                surveyHash: '0x00000000',
                creator: creator.address,
            },
        );

        let receivedValue = await surveysManager.getSurveysAmount();
        // console.log('getSurveysAmount: ', receivedValue);

        // surveysManager = blockchain.openContract(await SurveysManager.fromInit(deployer.address));
        // survey = blockchain.openContract(await Survey.fromInit(surveysManager.address, receivedValue));
        // let surveyBalance = await survey.getSurveyBalance();
        // console.log('surveysManagerBalance: ', await surveysManager.getManagerSurveysBalance());
        // console.log('surveyBalance: ', surveyBalance);
        // console.log('survey.address: ', survey.address);
        // console.log('user1.address: ', user1.address);

        expect(surveyCreateResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            success: true,
        });

        expect(receivedValue).toBe(BigInt(1));
    });

    it('should pay rewards', async () => {
        deployer = await blockchain.treasury('deployer');
        creator = await blockchain.treasury('creator');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');
        user3 = await blockchain.treasury('user3');

        await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('10'),
            },
            {
                $$type: 'NewSurveyRequest',
                participantsLimit: BigInt(2),
                rewardAmount: toNano('0.1'),
                surveyHash: '0x00000000',
                creator: creator.address,
            },
        );

        let user1BalancePrev = await user1.getBalance();

        let payRewardResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'PayRewardRequest',
                surveyId: BigInt(1),
                userAddress: user1.address,
            },
        );

        expect(payRewardResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            success: true,
        });

        let user1BalanceNext = await user1.getBalance();
        console.log('USER1: ', user1BalanceNext - user1BalancePrev);

        user1BalancePrev = await user1.getBalance();

        payRewardResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'PayRewardRequest',
                surveyId: BigInt(1),
                userAddress: user1.address,
            },
        );

        expect(payRewardResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            success: true,
        });

        user1BalanceNext = await user1.getBalance();
        console.log('USER1: ', user1BalanceNext - user1BalancePrev);

        const user2BalancePrev = await user2.getBalance();

        payRewardResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'PayRewardRequest',
                surveyId: BigInt(1),
                userAddress: user2.address,
            },
        );

        expect(payRewardResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            success: true,
        });

        const user2BalanceNext = await user2.getBalance();
        console.log('USER2: ', user2BalanceNext - user2BalancePrev);

        const user3BalancePrev = await user3.getBalance();

        payRewardResult = await surveysManager.send(
            deployer.getSender(),
            {
                value: toNano('5'),
                bounce: true,
            },
            {
                $$type: 'PayRewardRequest',
                surveyId: BigInt(1),
                userAddress: user3.address,
            },
        );

        expect(payRewardResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: surveysManager.address,
            success: true,
        });

        const user3BalanceNext = await user3.getBalance();
        console.log('USER3: ', user3BalanceNext - user3BalancePrev);
        expect(user3BalanceNext - user3BalancePrev).toBe(BigInt(0));

        surveysManager = blockchain.openContract(await SurveysManager.fromInit(deployer.address));
        survey = blockchain.openContract(await Survey.fromInit(surveysManager.address, BigInt(1)));
        let surveyBalance = await survey.getSurveyBalance();
        console.log('surveysManagerBalance: ', await surveysManager.getManagerSurveysBalance());
        console.log('surveyBalance: ', surveyBalance);
    });
});

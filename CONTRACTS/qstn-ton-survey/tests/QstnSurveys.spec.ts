import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, OpenedContract,toNano,Cell, fromNano, address,SenderArguments,beginCell,Slice } from 'ton-core';
import { QstnSurveys } from '../wrappers/QstnSurveys';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('QstnSurveys', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('QstnSurveys');
    });

    let blockchain: Blockchain;
    let qstnSurveys: SandboxContract<QstnSurveys>;
    const ARBITER_ADDRESS=Address.parse('EQBqlsh4xzPIFJb50a1aU9Y_x9ASSz3GHtbnFePhSmEuYaSi')
    const BENEFICIARY_ADDRESS=Address.parse('EQAkOWOwlAgX_boTMus9uZDXaNggGmKnmbjYbV3gujuohHkm')
    const DEPLOYER_ADDRESS=Address.parse('EQBqlsh4xzPIFJb50a1aU9Y_x9ASSz3GHtbnFePhSmEuYaSi')
    const job_description = 'Survey test'

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        qstnSurveys = blockchain.openContract(
            QstnSurveys.createFromConfig(
            {
                    query_id:Math.floor(Math.random() * 10000),
                    approved:0,
                    canceled:0,
                    closed:0,
                    arbiter:ARBITER_ADDRESS,
                    beneficiary:BENEFICIARY_ADDRESS,
                    owner:DEPLOYER_ADDRESS,
                    job_description:job_description

                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await qstnSurveys.sendDeploy(deployer.getSender(), toNano('1.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: qstnSurveys.address,
            deploy: true,
            success: true,
        });
    });


    it('should get Description', async () => {
        const jb = (await qstnSurveys.getJobDescription()).toString();
        //console.log('owner', owner);
        expect(jb).toBe('Survey test');

        /*const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await qstnSurveys.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await qstnSurveys.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: qstnSurveys.address,
                success: true,
            });

            const counterAfter = await qstnSurveys.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }*/
    });
});

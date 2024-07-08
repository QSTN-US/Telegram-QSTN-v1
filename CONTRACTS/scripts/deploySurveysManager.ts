import { toNano } from '@ton/core';
import { SurveysManager } from '../wrappers/SurveysManager';
import { Survey } from '../wrappers/Survey';
import { NetworkProvider } from '@ton/blueprint';

import { address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const manager = address('0QDfaviQSL-ZZFYJDHY37h90LmvAXUwgQL0FNCliT_h1kdrz');
    const managerContract = provider.open(await SurveysManager.fromInit(manager));
    const surveyContract = provider.open(await Survey.fromInit(managerContract.address, BigInt(2)));

    // await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.1'),
    //     },
    //     {
    //         $$type: 'Deploy',
    //         queryId: 0n,
    //     },
    // );

    // await provider.waitForDeploy(managerContract.address);

    // console.log('ID', await managerContract.address);

    // const trx = await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('2'),
    //     },
    //     {
    //         $$type: 'NewSurveyRequest',
    //         participantsLimit: BigInt(1),
    //         rewardAmount: toNano('1'),
    //         surveyHash: '9645bed2-4d6a-4396-86fa-7de7b1ec7777',
    //         creator: manager,
    //     },
    // );

    // console.log('ID', trx);

    // const trx = await managerContract.send(
    //     provider.sender(),
    //     {
    //         value: toNano('2'),
    //     },
    //     {
    //         $$type: 'PayRewardRequest',
    //         surveyId: BigInt(1),
    //         userAddress: address('0QBR63RtADwJIx2QPbklL69h9n-FU4jcAMBYpAuxpUEJVXZX'),
    //     },
    // );

    // console.log('ID', trx);

    // const result = await managerContract.getSurveysAmount();
    // console.log('Surveys amount:', result);

    // const result = await managerContract.getSurveyAddress(BigInt(28));
    // console.log('Surveys amount:', result);

    // const result = await surveyContract.getSurveyHash();
    // console.log('Surveys amount:', result);
}

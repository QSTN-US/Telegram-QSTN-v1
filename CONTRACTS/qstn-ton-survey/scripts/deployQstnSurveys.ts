import { toNano } from 'ton-core';
import { QstnSurveys } from '../wrappers/QstnSurveys';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const qstnSurveys = provider.open(
        QstnSurveys.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('QstnSurveys')
        )
    );

    await qstnSurveys.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(qstnSurveys.address);

    console.log('ID', await qstnSurveys.getID());
}

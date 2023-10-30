import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Dictionary } from 'ton-core';

export type QstnSurveysConfig = { 
                                query_id:number,
                                approved:number,
                                canceled:number,
                                closed:number,
                                arbiter:Address,
                                beneficiary:Address,
                                owner:Address,
                                job_description:string,
                                particiants:Cell
                              };

export function qstnSurveysConfigToCell(config: QstnSurveysConfig): Cell {
    
    const particiantsDict = Dictionary.empty(
        Dictionary.Keys.Buffer(32),
        Dictionary.Values.Dictionary(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(160))
    );
    particiantsDict.set(config.beneficiary.hash, Dictionary.empty()); // Value should store coin_id -> pubkey dict in future.

    return beginCell()
    .storeUint(config.query_id,32)
    .storeUint(config.approved,2)
    .storeUint(config.canceled,2)
    .storeUint(config.closed,2)
    .storeAddress(config.arbiter)
    .storeAddress(config.beneficiary)
    .storeAddress(config.owner)
    .storeStringRefTail(config.job_description)
    .storeDict(particiantsDict) 
    .endCell();
}
export const Opcodes = {
    approve: 0xe8c15681,
    addparticipant: 0xf4cc1d13,
    cancel:  0xcc0f2526,
    notify:  0xbb620d9c,
    close:   0xb5526345,
};
export class QstnSurveys implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new QstnSurveys(address);
    }

    static createFromConfig(config: QstnSurveysConfig, code: Cell, workchain = 0) {
        const data = qstnSurveysConfigToCell(config);
        const init = { code, data };
        return new QstnSurveys(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    //approve msg from arbiter to contract;
    async sendApprove(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.approve, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(0, 32)
                .endCell(),
        });
    }

    //cancel msg from arbiter to contract;
    async sendCancel(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.cancel, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(0, 32)
                .endCell(),
        });
    }

    //close msg from arbiter to contract;
    async sendClose(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.close, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(0, 32)
                .endCell(),
        });
    }

    // notify arbiter 

    async sendNotify(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.notify, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(0, 32)
                .endCell(),
        });
    }


    async sendAddParticipant(
        provider: ContractProvider,
        via: Sender,
        params: {
            value?: bigint;
            participantHash: number;
            data: Cell;
        }
    ) {
        const body = beginCell().storeUint(params.participantHash, 256).storeRef(params.data).endCell().beginParse();

        await provider.internal(via, {
            value: params.value ?? toNano('0.1'),
            body: beginCell()
                .storeUint(3, 256) // op
                .storeUint(0, 64) // query id
                .storeSlice(body)
                .endCell(),
        });
    }


    //getter for beneficiary;
    async getBeneficiary(provider: ContractProvider) {
        const result = await provider.get('get_beneficiary', []);
        return result.stack.readAddress();
    }

    //getter for arbiter;
    async getArbiter(provider: ContractProvider) {
        const result = await provider.get('get_arbiter', []);
        return result.stack.readAddress();
    }

    //getter for owner;
    async getOwner(provider:ContractProvider){
        const result=await provider.get('get_owner',[])
        return result.stack.readAddress();
    }

    //getter for query_id;
    async getQueryid(provider:ContractProvider){
        const result=await provider.get('get_queryid',[])
        return result.stack.readNumber();
    }

    async getJobDescription(provider:ContractProvider){
        const result=await provider.get('get_jobDescription',[])
        return result.stack.readString();
    }

    async getApproved(provider:ContractProvider){
        const result=await provider.get('get_approved',[])
        return result.stack.readNumber()
    }

    async getCanceled(provider:ContractProvider){
        const result=await provider.get('get_canceled',[])
        return result.stack.readNumber()
    }
}

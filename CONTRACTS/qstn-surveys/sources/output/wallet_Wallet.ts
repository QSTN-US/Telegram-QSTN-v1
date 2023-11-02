import { Cell, Slice, Address, Builder, beginCell, ComputeError, TupleItem, TupleReader, Dictionary, contractAddress, ContractProvider, Sender, Contract, ContractABI, TupleBuilder, DictionaryValue } from 'ton-core';
import { ContractSystem, ContractExecutor } from 'ton-emulator';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}
export type Participant = {
    $$type: 'Participant';
    fillno: bigint;
    uservault: Address;
}

export function storeParticipant(src: Participant) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.fillno, 32);
        b_0.storeAddress(src.uservault);
    };
}

export function loadParticipant(slice: Slice) {
    let sc_0 = slice;
    let _fillno = sc_0.loadUintBig(32);
    let _uservault = sc_0.loadAddress();
    return { $$type: 'Participant' as const, fillno: _fillno, uservault: _uservault };
}

function loadTupleParticipant(source: TupleReader) {
    let _fillno = source.readBigNumber();
    let _uservault = source.readAddress();
    return { $$type: 'Participant' as const, fillno: _fillno, uservault: _uservault };
}

function storeTupleParticipant(source: Participant) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.fillno);
    builder.writeAddress(source.uservault);
    return builder.build();
}

function dictValueParserParticipant(): DictionaryValue<Participant> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeParticipant(src)).endCell());
        },
        parse: (src) => {
            return loadParticipant(src.loadRef().beginParse());
        }
    }
}
export type Transfer = {
    $$type: 'Transfer';
    seqno: bigint;
    mode: bigint;
    to: Address;
    amount: bigint;
    body: Cell | null;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.seqno, 32);
        b_0.storeUint(src.mode, 8);
        b_0.storeAddress(src.to);
        b_0.storeCoins(src.amount);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    let _seqno = sc_0.loadUintBig(32);
    let _mode = sc_0.loadUintBig(8);
    let _to = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Transfer' as const, seqno: _seqno, mode: _mode, to: _to, amount: _amount, body: _body };
}

function loadTupleTransfer(source: TupleReader) {
    let _seqno = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    let _body = source.readCellOpt();
    return { $$type: 'Transfer' as const, seqno: _seqno, mode: _mode, to: _to, amount: _amount, body: _body };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.seqno);
    builder.writeNumber(source.mode);
    builder.writeAddress(source.to);
    builder.writeNumber(source.amount);
    builder.writeCell(source.body);
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}
export type AddParticipant = {
    $$type: 'AddParticipant';
    user: Address;
    uservault: Address;
    resultsid: bigint;
}

export function storeAddParticipant(src: AddParticipant) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3344036631, 32);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.uservault);
        b_0.storeUint(src.resultsid, 32);
    };
}

export function loadAddParticipant(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3344036631) { throw Error('Invalid prefix'); }
    let _user = sc_0.loadAddress();
    let _uservault = sc_0.loadAddress();
    let _resultsid = sc_0.loadUintBig(32);
    return { $$type: 'AddParticipant' as const, user: _user, uservault: _uservault, resultsid: _resultsid };
}

function loadTupleAddParticipant(source: TupleReader) {
    let _user = source.readAddress();
    let _uservault = source.readAddress();
    let _resultsid = source.readBigNumber();
    return { $$type: 'AddParticipant' as const, user: _user, uservault: _uservault, resultsid: _resultsid };
}

function storeTupleAddParticipant(source: AddParticipant) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeAddress(source.uservault);
    builder.writeNumber(source.resultsid);
    return builder.build();
}

function dictValueParserAddParticipant(): DictionaryValue<AddParticipant> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddParticipant(src)).endCell());
        },
        parse: (src) => {
            return loadAddParticipant(src.loadRef().beginParse());
        }
    }
}
export type Reward = {
    $$type: 'Reward';
    amount: bigint;
    participant: Address;
}

export function storeReward(src: Reward) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(731158516, 32);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.participant);
    };
}

export function loadReward(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 731158516) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    let _participant = sc_0.loadAddress();
    return { $$type: 'Reward' as const, amount: _amount, participant: _participant };
}

function loadTupleReward(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _participant = source.readAddress();
    return { $$type: 'Reward' as const, amount: _amount, participant: _participant };
}

function storeTupleReward(source: Reward) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.participant);
    return builder.build();
}

function dictValueParserReward(): DictionaryValue<Reward> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeReward(src)).endCell());
        },
        parse: (src) => {
            return loadReward(src.loadRef().beginParse());
        }
    }
}
export type TransferMessage = {
    $$type: 'TransferMessage';
    signature: Cell;
    transfer: Transfer;
}

export function storeTransferMessage(src: TransferMessage) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(123, 32);
        b_0.storeRef(src.signature);
        b_0.store(storeTransfer(src.transfer));
    };
}

export function loadTransferMessage(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 123) { throw Error('Invalid prefix'); }
    let _signature = sc_0.loadRef();
    let _transfer = loadTransfer(sc_0);
    return { $$type: 'TransferMessage' as const, signature: _signature, transfer: _transfer };
}

function loadTupleTransferMessage(source: TupleReader) {
    let _signature = source.readCell();
    const _transfer = loadTupleTransfer(source.readTuple());
    return { $$type: 'TransferMessage' as const, signature: _signature, transfer: _transfer };
}

function storeTupleTransferMessage(source: TransferMessage) {
    let builder = new TupleBuilder();
    builder.writeSlice(source.signature);
    builder.writeTuple(storeTupleTransfer(source.transfer));
    return builder.build();
}

function dictValueParserTransferMessage(): DictionaryValue<TransferMessage> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransferMessage(src)).endCell());
        },
        parse: (src) => {
            return loadTransferMessage(src.loadRef().beginParse());
        }
    }
}
export type New = {
    $$type: 'New';
    owner: Address;
    limit: bigint;
}

export function storeNew(src: New) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3674000335, 32);
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.limit, 32);
    };
}

export function loadNew(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3674000335) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _limit = sc_0.loadUintBig(32);
    return { $$type: 'New' as const, owner: _owner, limit: _limit };
}

function loadTupleNew(source: TupleReader) {
    let _owner = source.readAddress();
    let _limit = source.readBigNumber();
    return { $$type: 'New' as const, owner: _owner, limit: _limit };
}

function storeTupleNew(source: New) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.limit);
    return builder.build();
}

function dictValueParserNew(): DictionaryValue<New> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeNew(src)).endCell());
        },
        parse: (src) => {
            return loadNew(src.loadRef().beginParse());
        }
    }
}
export type Withdraw = {
    $$type: 'Withdraw';
    amount: bigint;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(195467089, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 195467089) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    return { $$type: 'Withdraw' as const, amount: _amount };
}

function loadTupleWithdraw(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'Withdraw' as const, amount: _amount };
}

function storeTupleWithdraw(source: Withdraw) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}
async function Wallet_init(key: bigint, walletId: bigint, owner: Address, limit: bigint) {
    const __init = 'te6ccgEBBgEAQwABFP8A9KQT9LzyyAsBAgFiAgMCAs0EBQAJoUrd4AkAAdQAP9ODa2g+RmA68RiBIoM+WPqAJniwllj+X/5Z/6AHoAZM';
    const __code = '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';
    const __system = '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';
    let systemCell = Cell.fromBase64(__system);
    let builder = new TupleBuilder();
    builder.writeCell(systemCell);
    builder.writeNumber(key);
    builder.writeNumber(walletId);
    builder.writeAddress(owner);
    builder.writeNumber(limit);
    let __stack = builder.build();
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let initCell = Cell.fromBoc(Buffer.from(__init, 'base64'))[0];
    let system = await ContractSystem.create();
    let executor = await ContractExecutor.create({ code: initCell, data: new Cell() }, system);
    let res = await executor.get('init', __stack);
    if (!res.success) { throw Error(res.error); }
    if (res.exitCode !== 0 && res.exitCode !== 1) {
        if (Wallet_errors[res.exitCode]) {
            throw new ComputeError(Wallet_errors[res.exitCode].message, res.exitCode, { logs: res.vmLogs });
        } else {
            throw new ComputeError('Exit code: ' + res.exitCode, res.exitCode, { logs: res.vmLogs });
        }
    }
    
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

const Wallet_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    5042: { message: `participant not found` },
    8210: { message: `reward already received!` },
    17654: { message: `Invalid seqno` },
    48401: { message: `Invalid signature` },
    54615: { message: `Insufficient balance` },
}

export class Wallet implements Contract {
    
    static async init(key: bigint, walletId: bigint, owner: Address, limit: bigint) {
        return await Wallet_init(key,walletId,owner,limit);
    }
    
    static async fromInit(key: bigint, walletId: bigint, owner: Address, limit: bigint) {
        const init = await Wallet_init(key,walletId,owner,limit);
        const address = contractAddress(0, init);
        return new Wallet(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Wallet(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: Wallet_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: 'Deploy' | TransferMessage | AddParticipant | Slice | 'notify' | New | 'withdraw all' | 'withdraw safe' | Withdraw | Reward) {
        
        let body: Cell | null = null;
        if (message === 'Deploy') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TransferMessage') {
            body = beginCell().store(storeTransferMessage(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddParticipant') {
            body = beginCell().store(storeAddParticipant(message)).endCell();
        }
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (message === 'notify') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'New') {
            body = beginCell().store(storeNew(message)).endCell();
        }
        if (message === 'withdraw all') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'withdraw safe') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Withdraw') {
            body = beginCell().store(storeWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Reward') {
            body = beginCell().store(storeReward(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getIsParticipant(provider: ContractProvider, key: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(key);
        let source = (await provider.get('isParticipant', builder.build())).stack;
        let result = source.readBooleanOpt();
        return result;
    }
    
    async getIsRewardReceived(provider: ContractProvider, key: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(key);
        let source = (await provider.get('isRewardReceived', builder.build())).stack;
        let result = source.readBooleanOpt();
        return result;
    }
    
    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readString();
        return result;
    }
    
    async getPublicKey(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('publicKey', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getWalletId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('walletId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getSeqno(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('seqno', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getAllParticipants(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('allParticipants', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserParticipant(), source.readCellOpt());
        return result;
    }
    
}
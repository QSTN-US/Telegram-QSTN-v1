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
    userid: bigint;
}

export function storeNew(src: New) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3731171327, 32);
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.userid, 257);
    };
}

export function loadNew(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3731171327) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _userid = sc_0.loadIntBig(257);
    return { $$type: 'New' as const, owner: _owner, userid: _userid };
}

function loadTupleNew(source: TupleReader) {
    let _owner = source.readAddress();
    let _userid = source.readBigNumber();
    return { $$type: 'New' as const, owner: _owner, userid: _userid };
}

function storeTupleNew(source: New) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.userid);
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
async function Wallet_init(key: bigint, walletId: bigint, owner: Address) {
    const __init = 'te6ccgEBBwEAOwABFP8A9KQT9LzyyAsBAgFiAgMCAs0EBQAJoUrd4AkAAdQBE9OAJkZiIabZ5kwGABZQQ88Wyx8Sy//LPw==';
    const __code = 'te6ccgECRAEABNoAART/APSkE/S88sgLAQIBYgIDAgLKBAUCASAoKQIBIAYHAgFiHB0CASAwMQIBIAgJAgH0CgsCASAODwL3MhxAcoBUAcBygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY5GfwHKAMhwAcoAcAHKACRus5p/AcoABPACUATMljQDcAHKAOIkbrOafwHKAATwAlAEzJY0A3ABygDicAHKAAJ/AcoAAslYzJczMwFwAcoA4iFus+MPyQH7AIAwNAAcefAKgABJ/AcoAAfACAcwACjFwAcoAAgEgEBECASAUFQETRwBMjMRDTbPMmEMCASASEwARF8E+CdvEPAXgAAcE18DgAgEgFhcCASAYGQAFGwxgAAkECNfA4AABIAFRFR0MlND2zz5AIIAvRFRefkQFvL0gUT2UUi6FPL0BqR/UHRDMG1t8BaAaAQzIVUDbPMkbADhQRcsfEssHAc8WAfoCIW6zlX8BygDMlHAyygDiAgEgHh8CASAkJQIBICAhAgEgIiMACQwAqQCgAAcAqQCgAAMW4AADDCACASAmJwBPT4J28Q+EFvJBNfA6GCCJiWgKG2CIIA1VchwgDy9H9SUoBCbW1t8BaAAXH8kcIEAgm1tbfAWgADkf/gnbxD4QW8kE18DoYIImJaAoVJQgEJtbW3wFoAIBaiorAgEgLC0BDbMl9s88B2BAAQ2wfjbPPAbgQAIBIC4vAQ24BK2zzwHIQAENttgbZ54DUEAATbd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHMAIBSDIzANu0QYICQ4SbY+WhDZBFggExAFoDlg4FRgW8/uDeAAkcNgj1UhhBgACkYWFnNuBnTGAo3xgJSAgHImHECcgDZy4FAFzfGAVJvRwgBvVSGUxgJt8YB0hFgAAgacxmRUoHNKYk3wIDlg4FSgXI2EOToQSHTtou37cCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKPCTDbPFUD8CPbPOAgwHvjAiCCEN5lJ/+6hAQTQ1AAtCBu8tCAgDJjDbPATbPDYQiRB4EGdVBPAf2zxANkEEOI+RMNs8BNs8MhBFEDRDAPAi2zzgIIIQC6aXUbpAOEE5ASDTHwHAe/LggdQB0AHbPBBWNwAq0x/TB/pAAQH6ANIAAZHUkm0B4lVAAC7THwGCEN5lJ/+68uCB+kABAYEBAdcAWQQoj48w2zwE2zwxEDRBMPAm2zzgwABAOkE7ACDTHwGCEAuml1G68uCB+gABAxTjANs8VQPwINs8PEBBBPog+QEggvCF0og4TABDRYsCgDyyIFn2iAPFU8NlY0Q0ZGjayWHyRrqPCVvbPPAe2zzbMeAggvAOI1cmEItXANA2ndcWf2r/uAan4EBZN13Q4Psklx5ysrrjAiCC8FCStdzgcVpX3ZafX7Wm+TAloLAuqzKUcMorNlyg1+k6ukBBPT4CElvbPPAh2zzbMUBBA2KPCVvbPPAk2zzbMeCC8L6yk1qCCJsVTTL5nEN3qpYKoRU2bMLGAnVeNrl/UFzsuuMCQEE/AhIw2zzwJds82zFAQQEW7UTQ1AH4Yts8bBRCARjI+EIBzFUw2zzJ7VRDABj6QAEB0x/T/9M/VTAAFlBDzxbLHxLL/8s/';
    const __system = 'te6cckECRgEABOQAAQHAAQEFoHL9AgEU/wD0pBP0vPLICwMCAWINBAIBIAoFAgEgBwYBDbgErbPPAchEAgEgCQgATbd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHMAENttgbZ54DUEQCAWoMCwENsH42zzwG4EQBDbMl9s88B2BEAgLKGw4CAWIUDwIBIBEQAE9PgnbxD4QW8kE18DoYIImJaAobYIggDVVyHCAPL0f1JSgEJtbW3wFoAgEgExIAOR/+CdvEPhBbyQTXwOhggiYloChUlCAQm1tbfAWgABcfyRwgQCCbW1t8BaACASAYFQIBIBcWAAMMIAADFuACASAaGQAHAKkAoAAJDACpAKACASAxHAIBICwdAgEgJx4CASAkHwIBICMgAVEVHQyU0PbPPkAggC9EVF5+RAW8vSBRPZRSLoU8vQGpH9QdEMwbW3wFoCEBDMhVQNs8ySIAOFBFyx8SywcBzxYB+gIhbrOVfwHKAMyUcDLKAOIAASACASAmJQAJBAjXwOAABRsMYAIBICsoAgEgKikABwTXwOAAERfBPgnbxDwF4AETRwBMjMRDTbPMmEMCAfQuLQAHHnwCoAL3MhxAcoBUAcBygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY5GfwHKAMhwAcoAcAHKACRus5p/AcoABPACUATMljQDcAHKAOIkbrOafwHKAATwAlAEzJY0A3ABygDicAHKAAJ/AcoAAslYzJczMwFwAcoA4iFus+MPyQH7AIDAvAAoxcAHKAAASfwHKAAHwAgHMAgEgMzIA27RBggJDhJtj5aENkEWCATEAWgOWDgVGBbz+4N4ACRw2CPVSGEGAAKRhYWc24GdMYCjfGAlICAciYcQJyANnLgUAXN8YBUm9HCAG9VIZTGAm3xgHSEWAACBpzGZFSgc0piTfAgOWDgVKBcjYQ5OhAgFINTQAC0IG7y0ICASHTtou37cCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKPCTDbPFUD8CPbPOAgwHvjAiCCEN5lJ/+6hEQj82BDiPkTDbPATbPDIQRRA0QwDwIts84CCCEAuml1G6RD5CNwQoj48w2zwE2zwxEDRBMPAm2zzgwABEPUI4AxTjANs8VQPwINs8OURCBPog+QEggvCF0og4TABDRYsCgDyyIFn2iAPFU8NlY0Q0ZGjayWHyRrqPCVvbPPAe2zzbMeAggvAOI1cmEItXANA2ndcWf2r/uAan4EBZN13Q4Psklx5ysrrjAiCC8FCStdzgcVpX3ZafX7Wm+TAloLAuqzKUcMorNlyg1+k6ukRCPDoDYo8JW9s88CTbPNsx4ILwvrKTWoIImxVNMvmcQ3eqlgqhFTZswsYCdV42uX9QXOy64wJEQjsCEjDbPPAl2zzbMURCAhJb2zzwIds82zFEQgAg0x8BghALppdRuvLggfoAAQAu0x8BghDeZSf/uvLggfpAAQGBAQHXAFkDJjDbPATbPDYQiRB4EGdVBPAf2zxEQEIBINMfAcB78uCB1AHQAds8EFZBACrTH9MH+kABAfoA0gABkdSSbQHiVUABGMj4QgHMVTDbPMntVEMAFlBDzxbLHxLL/8s/ARbtRNDUAfhi2zxsFEUAGPpAAQHTH9P/0z9VMAtMSLk=';
    let systemCell = Cell.fromBase64(__system);
    let builder = new TupleBuilder();
    builder.writeCell(systemCell);
    builder.writeNumber(key);
    builder.writeNumber(walletId);
    builder.writeAddress(owner);
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
    17654: { message: `Invalid seqno` },
    48401: { message: `Invalid signature` },
    54615: { message: `Insufficient balance` },
}

export class Wallet implements Contract {
    
    static async init(key: bigint, walletId: bigint, owner: Address) {
        return await Wallet_init(key,walletId,owner);
    }
    
    static async fromInit(key: bigint, walletId: bigint, owner: Address) {
        const init = await Wallet_init(key,walletId,owner);
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: 'Deploy' | TransferMessage | Slice | 'notify' | New | 'withdraw all' | 'withdraw safe' | Withdraw) {
        
        let body: Cell | null = null;
        if (message === 'Deploy') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TransferMessage') {
            body = beginCell().store(storeTransferMessage(message)).endCell();
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
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
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
    
}
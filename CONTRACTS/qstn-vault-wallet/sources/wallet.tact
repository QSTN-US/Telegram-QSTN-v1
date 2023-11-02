struct Transfer {
    seqno: Int as uint32;
    mode: Int as uint8;
    to: Address;
    amount: Int as coins;
    body: Cell?;
}

message(123) TransferMessage {
    signature: Slice;
    transfer: Transfer;
}

message New {
    owner: Address;
    userid: Int;
}

message Withdraw {
    amount: Int as coins;
}

contract Wallet {

    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years
    owner: Address;
    seqno: Int as uint32 = 0;
    key: Int as uint256;
    walletId: Int as uint64;

    init(key: Int, walletId: Int, owner: Address) {
        self.key = key;
        self.walletId = walletId;
        self.owner = owner;
    }

    receive("Deploy") {
        // Do nothing
    }

    receive(msg: TransferMessage) {

        // Check Signature
        let op_hash: Int = msg.transfer.toCell().hash();
        require(checkSignature(op_hash, msg.signature, self.key), "Invalid signature");
        require(msg.transfer.seqno == self.seqno, "Invalid seqno");

        // Increment seqno
        self.seqno = self.seqno + 1;

        // Send message
        send(SendParameters{value: msg.transfer.amount, to: msg.transfer.to, mode: msg.transfer.mode, body: msg.transfer.body});
    }

    receive(msg: Slice) {
            self.seqno = self.seqno + 1;
    }

    receive("notify") {
            self.seqno = self.seqno + 1;
    }

    receive(msg: New) {
        let owner: Address = msg.owner;
        let userId: Int = msg.userid;
        // Create new wallet
        let walletInit: StateInit = initOf Wallet(self.key, userId, owner);
    }

    bounced(msg: Slice) {
        // TODO: Handle
    }

    // this will withdraw the entire balance of the contract and leave 0
    receive("withdraw all") {
        //require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{
            to: self.owner,
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    // this will withdraw the entire balance but leave 0.01 for storage rent costs
    receive("withdraw safe") {
        //require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{
            to: self.owner,
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    // this will withdraw a specific amount but leave 0.01 for storage rent costs
    receive(msg: Withdraw) {
        //require(sender() == self.owner, "Only owner is allowed to withdraw");
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        require(amount > 0, "Insufficient balance");
        send(SendParameters{
            to: self.owner,
            bounce: true,
            value: amount,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }
 
    get fun balance(): String {
        return myBalance().toCoinsString();
    }

    get fun publicKey(): Int {
        return self.key;
    }

    get fun walletId(): Int {
        return self.walletId;
    }

    get fun seqno(): Int {
        return self.seqno;
    }
}
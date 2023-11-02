struct Participant {
    fillno: Int as uint32;
    uservault: Address;
}

struct Transfer {
    seqno: Int as uint32;
    mode: Int as uint8;
    to: Address;
    amount: Int as coins;
    body: Cell?;
}

message AddParticipant {
    user: Address;
    uservault: Address;
    resultsid: Int as uint32;
}

message Reward {
    amount: Int as coins;
    participant: Address;
}

message(123) TransferMessage {
    signature: Slice;
    transfer: Transfer;
}

message New {
    owner: Address;
    limit: Int as uint32;
}

message Withdraw {
    amount: Int as coins;
}

contract Wallet {

    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years
    limit: Int as uint32 = 0;
    owner: Address;
    seqno: Int as uint32 = 0;
    key: Int as uint256;
    walletId: Int as uint64;
    participants: map[Address] Participant;
    rewarded: map[Address] Bool;

    init(key: Int, walletId: Int, owner: Address, limit: Int) {
        self.key = key;
        self.walletId = walletId;
        self.owner = owner;
        self.limit = limit;
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

    receive(msg: AddParticipant) {
        let user: Address = msg.user;
        let userVault: Address = msg.uservault;
        let resultsId: Int = msg.resultsid;
        //let user = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        self.participants.set(user, Participant{fillno: resultsId, uservault: userVault});
    }


    receive(msg: Slice) {
            self.seqno = self.seqno + 1;
    }

    receive("notify") {
            self.seqno = self.seqno + 1;
    }

    receive(msg: New) {
        let owner: Address = msg.owner;
        let limit: Int = msg.limit;
        // Create new wallet
        let walletInit: StateInit = initOf Wallet(self.key, self.walletId + 1, owner, limit);
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
 
    // this will reward a user a specific amount but leave 0.01 for storage rent costs
    receive(msg: Reward) {
        //require(sender() == self.owner, "Only owner is allowed to withdraw");
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        let participant: Address = msg.participant;
        require(self.participants.get(participant) != null, "participant not found");
        require(self.rewarded.get(participant) == null, "reward already received!");
             
        let isparticipant: Participant = self.participants.get(participant)!!; // !! tells the compiler this can't be null
        let uservault: Address = isparticipant.uservault;
        require(amount > 0, "Insufficient balance");
        send(SendParameters{
            to: uservault,
            bounce: true,
            value: amount,
            mode: SendRemainingValue + SendIgnoreErrors
        });
        self.rewarded.set(participant, true);
    }

    // if the key is not found, the get() method returns null
    get fun isParticipant(key: Address): Bool? {
        if (self.participants.get(key) == null) {
            return false;
        } else {
            return true;
        }
    }

    // if the key is not found, the get() method returns null
    get fun isRewardReceived(key: Address): Bool? {
        return self.rewarded.get(key);
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

    // you can return participants from getters
    get fun allParticipants(): map[Address] Participant {
        return self.participants;
    }
}
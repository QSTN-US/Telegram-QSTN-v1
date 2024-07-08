import "./messages_nft.tact";
const minTonsForStorage: Int = ton("0.05");
const gasConsumption: Int = ton("0.05");

contract NftCollection {
    collection_id: Int;
    next_item_index: Int as uint32 = 0;
    items_limit: Int as uint32 = 0;
    survey_hash: String?;
    manager_address: Address;
    owner_address: Address?;
    royalty_params: RoyaltyParams?;                      
    collection_content: Cell?;
    is_initialized: Bool;  

    init(manager_address: Address, collection_id: Int){
        self.collection_id = collection_id;
        self.manager_address = manager_address;
        self.is_initialized = false;
    }

    receive(msg: FinishInitCollection){
        require(self.is_initialized == false, "already initialized");

        self.owner_address = msg.owner_address;
        self.items_limit = msg.items_limit;
        self.collection_content = msg.collection_content; 
        self.royalty_params = msg.royalty_params;
        self.survey_hash = msg.survey_hash;

        self.is_initialized = true;
    }

    receive(msg: Mint){
        require(sender() == self.manager_address, "sender is not the mint manager"); 
        let ctx: Context = context(); // get sender Info
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        if(self.next_item_index < self.items_limit) {
            self.mint(msg.owner, msg.payload, msgValue);
            emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());
        } else {
            send(SendParameters{
                to: self.manager_address,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors, 
                bounce: false,
                body: MintLimitError{ query_id: 0, error_message: "Items limit reached" }.toCell()
            });
        }  
    }

    // ===== Private Methods ===== //
    fun mint(owner: Address, payload: Cell, msgValue: Int) {
        require(self.next_item_index >= 0, "non-sequential NFTs");
        
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: msgValue, 
                bounce: false,
                mode: SendIgnoreErrors,
                body: Transfer {
                    query_id: 0,
                    new_owner: owner,
                    response_destination: self.owner_address,
                    custom_payload: payload,
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        // dump(self.next_item_index); // Reference at: https://tact-by-example.org/03-emit
        self.next_item_index = self.next_item_index + 1;
    }

    receive(msg: GetRoyaltyParams) {   
        let ctx: Context = context(); // get sender Info
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  (self.royalty_params!!).numerator,
                denominator: (self.royalty_params!!).denominator,
                destination: (self.owner_address!!)
            }.toCell()
        });        
    }

    // ------------------ Get Function  ------------------ //
    get fun collection_id(): Int {
        return self.collection_id;
    }

    get fun owner(): Address {
        return self.owner_address!!;
    }

    get fun survey_hash(): String {
        return (self.survey_hash!!);
    }

    get fun get_collection_data(): CollectionData {     
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: self.collection_content!!, 
            owner_address: self.owner_address!!
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(myAddress(), item_index);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        let b: StringBuilder = beginString();
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params!!;
    }
}

contract NftItem {
    collection_address: Address;
    item_index: Int; 
    is_initialized: Bool;

    owner: Address?;
    individual_content: Cell?;

    init(collection_address: Address, item_index: Int){
        require(sender() == collection_address, "not from collection");
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context(); // Reference: https://docs.tact-lang.org/language/ref/common#context
        let msgValue: Int = self.msgValue(ctx.value);
        
        if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT
            require(ctx.sender == self.collection_address, "initialized tx need from collection");
            self.is_initialized = true;
            self.owner = msg.new_owner;
            self.individual_content = msg.custom_payload;
            send(SendParameters{
                to: msg.response_destination!!,
                value: msgValue,
                mode: SendPayGasSeparately,
                body: Excesses { query_id: msg.query_id }.toCell()
            });
        } else {
            require(ctx.sender == self.owner!!, "not owner");
            self.owner = msg.new_owner;  // change current owner to the new_owner
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode:  SendPayGasSeparately, 
                    bounce: true,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }

            msgValue = msgValue - ctx.readForwardFee(); 
            if (msg.response_destination != null) { 
                send(SendParameters{ 
                    to: msg.response_destination!!,
                    value: msgValue - msg.forward_amount,
                    mode: SendPayGasSeparately,
                    bounce: true,
                    body: Excesses { query_id: msg.query_id }.toCell()
                });
            } 
        }
    }
    
    receive(msg: GetStaticData){ 
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
    }

    fun msgValue(value: Int): Int {
        let tonBalanceBeforeMsg: Int = myBalance() - value;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        return value - (storageFee + gasConsumption);
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection_address, 
            owner_address: self.owner!!,
            individual_content: self.individual_content!!
        };
    }
}
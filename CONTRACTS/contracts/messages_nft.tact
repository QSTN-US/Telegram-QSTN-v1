// Manager Messages
message CreateCollectionRequest {
    survey_hash: String;
    items_limit: Int; 
    collection_content: Cell;
    royalty_params: RoyaltyParams;
}

message ChangeMinTonsRequest {
  minTonsForStorage: Int as uint256;
}

message ChangeGasConsumptionRequest {
  gasConsumption: Int as uint256;
}

message MintRequest {
    item_id: Int;
    owner: Address;
    payload: Cell;
}


// NFT Messages
message FinishInitCollection {
    survey_hash: String;
    owner_address: Address;
    items_limit: Int; 
    collection_content: Cell;
    royalty_params: RoyaltyParams;
}

message Mint {
    owner: Address;
    payload: Cell;
}

message LogEventMintRecord {
    minter: Address;
    item_id: Int;
    generate_number: Int;
}

message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}
message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_amount: Int as coins;
    forward_payload: Slice as remaining;
}
message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}
message(0xd53276db) Excesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}
message MintLimitError {
    query_id: Int;
    error_message: String;
}
struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}
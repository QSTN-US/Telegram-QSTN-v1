import "@stdlib/deploy";
import "@stdlib/ownable";
import "./nft.tact";
import "./messages_nft.tact";

contract SurveysManagerNFT with Deployable, Ownable {
  
  seqno: Int as uint256;
  owner: Address;
  manager: Address;
  collectionsAmount: Int as uint256 = 0;
  minTonsForStorage: Int = ton("0.05");
  gasConsumption: Int = ton("0.05");

  init(manager: Address, seqno: Int) {
    self.owner = sender();
    self.manager = manager;
    self.seqno = seqno;
  }

  receive(msg: CreateCollectionRequest) {
    let ctx: Context = context();

    let tonBalanceBeforeMsg: Int = myBalance() - ctx.value;
    let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
    let feeManagerValue: Int = storageFee + gasConsumption;
    let feeCollectionValue: Int = (self.minTonsForStorage + gasConsumption) * 2;
    let sendValue: Int = (self.minTonsForStorage + gasConsumption) * msg.items_limit;

    require(ctx.value >= feeManagerValue + feeCollectionValue + sendValue, "SurveysManagerNFT: Invalid value");
    
    self.collectionsAmount = self.collectionsAmount + 1;
    let init: StateInit = initOf NftCollection(myAddress(), self.collectionsAmount);
      
    send(SendParameters{
        to: contractAddress(init),
        body: FinishInitCollection{
            survey_hash: msg.survey_hash,
            owner_address: sender(),
            items_limit: msg.items_limit, 
            collection_content: msg.collection_content,
            royalty_params: msg.royalty_params
            }.toCell(),
        value: feeCollectionValue,
        mode: SendIgnoreErrors,
        code: init.code,          
        data: init.data
    });

    send(SendParameters{
        to: self.manager,
        value: sendValue,
        mode: SendIgnoreErrors, 
        bounce: false,
    });

    send(SendParameters{
        to: sender(),
        value: ctx.value - (feeManagerValue + feeCollectionValue + sendValue),
        mode: SendIgnoreErrors, 
        bounce: false,
    });
  }

  receive(msg: MintRequest) {
    let ctx: Context = context();

    require(sender() == self.manager, "SurveysManagerNFT: Sender is not the manager");
    require(ctx.value >= self.minTonsForStorage + gasConsumption, "SurveysManagerNFT: Invalid value"); 
    
    send(SendParameters{
        to: contractAddress(initOf NftCollection(myAddress(), msg.item_id)),
        body: Mint{
            owner: msg.owner,
            payload: msg.payload,
        }.toCell(),
        value: (self.minTonsForStorage + gasConsumption) * 3,
        mode: SendIgnoreErrors
    });
  }

  receive(msg: ChangeMinTonsRequest) {
    require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 
    self.minTonsForStorage = msg.minTonsForStorage;
  }

  receive(msg: ChangeGasConsumptionRequest) {
    require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 
    self.gasConsumption = msg.gasConsumption;
  }

  get fun collectionsAmount(): Int {
    return self.collectionsAmount;
  }

  get fun collectionAddress(seqno: Int): Address {
    return contractAddress(initOf NftCollection(myAddress(), seqno));
  }

  get fun createCollectionFee(items_limit: Int): Int {
    let storageFee: Int = self.minTonsForStorage;
    let feeManagerValue: Int = storageFee + self.gasConsumption;
    let feeCollectionValue: Int = (self.minTonsForStorage + self.gasConsumption) * 2;
    let sendValue: Int = (self.minTonsForStorage + self.gasConsumption) * items_limit;

    return feeManagerValue + feeCollectionValue + sendValue;
  }

  get fun mintFee(): Int {
    return (self.minTonsForStorage + gasConsumption) * 3;
  }

}
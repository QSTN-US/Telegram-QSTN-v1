import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";

contract SurveysManager with Deployable, Ownable {
 
    owner: Address;
    manager: Address;
    surveysAmount: Int as uint256 = 0;
    minTonsForStorage: Int as coins = ton("0.05");

    init(manager: Address) {
        self.owner = sender();
        self.manager = manager;
    }

    receive(msg: NewSurveyRequest) {
        let ctx: Context = context();
        
        let rewardsCommission: Int = msg.participantsLimit * msg.rewardAmount;
        let fwdComissions: Int = ctx.readForwardFee() * msg.participantsLimit;
        let fullCommission: Int = self.minTonsForStorage + rewardsCommission + fwdComissions * 4;
        
        let storageCommission: Int = 0;
        if (myBalance() - ctx.value < self.minTonsForStorage) {
            storageCommission = self.minTonsForStorage - (myBalance() - ctx.value);
            require(ctx.value > storageCommission  - ctx.readForwardFee(), "SurveysManager: Invalid value"); 
        }
        
        require(ctx.value >= fullCommission + storageCommission, "SurveysManager: Invalid value"); 

        self.surveysAmount = self.surveysAmount + 1;
        let init: StateInit = initOf Survey(myAddress(), self.surveysAmount);

        send(SendParameters{
            to: contractAddress(init),
            body: ManagersNewSurveyRequest{
                participantsLimit: msg.participantsLimit, 
                rewardAmount: msg.rewardAmount,
                surveyHash: msg.surveyHash,
                creator: msg.creator,
                sender: sender(),
                manager: self.manager
                }.toCell(),
            value: ctx.value - storageCommission,
            code: init.code,          
            data: init.data
        });
    }

    receive(msg: PayRewardRequest) {
        require(msg.surveyId <= self.surveysAmount, "SurveysManager: Invalid survey's ID"); 
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 
        
        let init: StateInit = initOf Survey(myAddress(), msg.surveyId);
        
        send(SendParameters{
            to: contractAddress(init),
            body: ManagersPayRewardRequest{
                userAddress: msg.userAddress
                }.toCell(),  
            value: 0,
            mode: SendRemainingValue + SendBounceIfActionFail, 
        });
    }

    receive(msg: ChangeMinTonsRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 
        self.minTonsForStorage = msg.minTonsForStorage;
    }

    receive(msg: EmergencyWithdrawRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 

        let withdrawAmount: Int = 0;
        if (myBalance() > msg.amount) {
            withdrawAmount = msg.amount;
        } else {
            withdrawAmount = myBalance();
        }

        send(SendParameters{
            to: self.manager,
            value: withdrawAmount, 
            bounce: false,
        });
    }

    receive(msg: ChangeManagerRequest) {
        require(sender() == self.owner(), "SurveysManager: Sender is not the owner"); 

        self.manager == msg.manager;
    }

    receive(msg: ChangeSurveyManagerRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager");

        let init: StateInit = initOf Survey(myAddress(), msg.surveyId);

        send(SendParameters{
            to: contractAddress(init),
            body: ChangeManagerRequest{
                manager: msg.manager
                }.toCell(),
            value: 0,
            mode: SendRemainingValue,
        });
    }

    get fun surveysAmount(): Int {
        return self.surveysAmount;
    }

    get fun surveyAddress(seqno: Int): Address {
        return contractAddress(initOf Survey(myAddress(), seqno));
    }

    get fun managerSurveysBalance(): Int {
        return myBalance();
    }

    get fun createComission(participantsLimit: Int, rewardAmount: Int): Int {
        let rewardsCommission: Int = participantsLimit * rewardAmount;
        let fwdEstimateComission: Int = self.minTonsForStorage * participantsLimit;
        let fullCommission: Int = self.minTonsForStorage + rewardsCommission + fwdEstimateComission;

        return fullCommission;
    }

    get fun payComission(participantsLimit: Int, rewardAmount: Int): Int {
        let fwdEstimateComission: Int = self.minTonsForStorage * 4;

        return fwdEstimateComission;
    }

    get fun manager(): Address {
        return self.manager;
    }

    get fun minTonsForStorage(): Int {
        return self.minTonsForStorage;
    }
}

////////////////////////////////////////////////////////////////////////////

contract Survey {

    surveysManager: Address;
    manager: Address;
    creator: Address;
    seqno: Int as uint256;
    participantsLimit: Int as uint256 = 0;
    rewardAmount: Int as coins = 0;
    rewardedUsers: Int as uint256 = 0;
    surveyHash: String = "";
    minTonsForStorage: Int as coins = ton("0.05");
 
    init(surveysManager: Address, seqno: Int) {
        self.surveysManager = surveysManager;
        self.manager = newAddress(0, 0);
        self.creator = newAddress(0, 0);
        self.seqno = seqno;
    }

    receive(msg: ManagersNewSurveyRequest) {
        let ctx: Context = context();
        require(sender() == self.surveysManager, "Survey: Manager contract only");
        require(self.participantsLimit == 0, "Survey: Already initialized");
        self.participantsLimit = msg.participantsLimit;
        self.rewardAmount = msg.rewardAmount;
        self.manager = msg.manager;
        self.creator = msg.creator;
        self.surveyHash = msg.surveyHash;

        let rewardsCommission: Int = self.participantsLimit * self.rewardAmount;
        let fwdComissions: Int = ctx.readForwardFee() * self.participantsLimit;
        
        let fullCommission: Int = self.minTonsForStorage + rewardsCommission + fwdComissions * 4;

        require(ctx.value >= fullCommission, "Survey: Invalid value");

        send(SendParameters{
            to: msg.manager,
            value: fwdComissions * 2,
            bounce: false,
        });

        send(SendParameters{
            to: msg.sender,
            value: ctx.value - fullCommission,
            bounce: false,
        });
    }

    receive(msg: ManagersPayRewardRequest) {
        require(sender() == self.surveysManager, "Survey: Manager contract only");
        // require(self.rewardedUsers < self.participantsLimit, "Survey: Users limit reached");

        let surveyUser: StateInit = initOf SurveyUser(myAddress(), msg.userAddress, false);

        if (self.rewardedUsers < self.participantsLimit) {
            send(SendParameters{
                to: contractAddress(surveyUser),
                body: SurveyPayRewardRequest{
                    userAddress: msg.userAddress,
                    manager: self.manager,
                    minTonsForStorage: self.minTonsForStorage
                }.toCell(),
                value: 0, 
                mode: SendRemainingValue,
                code: surveyUser.code,          
                data: surveyUser.data
            });
        } else {
            send(SendParameters{
                to: self.manager,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
            });
        }

        
    }

    receive(msg: SurveyUserPayRewardRequest) {
        let ctx: Context = context();
        let surveyUser: StateInit = initOf SurveyUser(myAddress(), msg.userAddress, false);
        require(contractAddress(surveyUser) == sender(), "Survey: SurveyUser contract only");

        send(SendParameters{
            to: msg.userAddress,
            value: self.rewardAmount,
            bounce: false,
        });     

        send(SendParameters{
            to: self.manager,
            value: ctx.value - self.rewardAmount,
            bounce: false,
        });

        self.rewardedUsers = self.rewardedUsers + 1;
    }

    receive(msg: ChangeMinTonsRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 
        self.minTonsForStorage = msg.minTonsForStorage;
    }

    receive(msg: EmergencyWithdrawRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 

        let withdrawAmount: Int = 0;
        if (myBalance() > msg.amount) {
            withdrawAmount = msg.amount;
        } else {
            withdrawAmount = myBalance();
        }

        send(SendParameters{
            to: self.manager,
            value: withdrawAmount,
            bounce: false, 
        });
    }

    receive(msg: ChangeManagerRequest) {
        require(sender() == self.surveysManager, "Survey: Manager contract only"); 

        self.manager == msg.manager;
    }

    get fun surveyBalance(): Int {
        return myBalance();
    }

    get fun surveyUserAddress(userAddress: Address): Address {
        return contractAddress(initOf SurveyUser(myAddress(), userAddress, false));
    }

    get fun surveysManager(): Address {
        return self.surveysManager;
    }

    get fun manager(): Address {
        return self.manager;
    }

    get fun creator(): Address {
        return self.creator;
    }

    get fun participantsLimit(): Int {
        return self.participantsLimit;
    }

    get fun rewardAmount(): Int {
        return self.rewardAmount;
    }

    get fun rewardedUsers(): Int {
        return self.rewardedUsers;
    }

    get fun surveyHash(): String {
        return self.surveyHash;
    }

    get fun minTonsForStorage(): Int {
        return self.minTonsForStorage;
    }
}

contract SurveyUser {

    survey: Address;
    owner: Address;
    manager: Address;
    isRewarded: Bool;
 
    init(survey: Address, owner: Address, isRewarded: Bool) {
        self.survey = survey;
        self.owner = owner;
        self.isRewarded = isRewarded;
        self.manager = sender();
    }

    receive(msg: SurveyPayRewardRequest) {
        let ctx: Context = context();

        require(sender() == self.survey, "SurveyUser: Survey contract only");
        require(msg.userAddress == self.owner, "SurveyUser: Invalid user");
        require(ctx.value > msg.minTonsForStorage, "SurveyUser: Invalid value");

        if (self.isRewarded == false) {
            self.manager = msg.manager;
            send(SendParameters{
                    to: self.survey,
                    body: SurveyUserPayRewardRequest{
                            userAddress: self.owner
                        }.toCell(),
                    value: ctx.value - msg.minTonsForStorage,
                });
                
            self.isRewarded = true;
        } else {
            send(SendParameters{
                to: msg.manager,
                value: 0,
                mode: SendRemainingValue,
            });
        }
    }

    receive(msg: EmergencyWithdrawRequest) {
        require(sender() == self.manager, "SurveysManager: Sender is not the manager"); 

        let withdrawAmount: Int = 0;
        if (myBalance() > msg.amount) {
            withdrawAmount = msg.amount;
        } else {
            withdrawAmount = myBalance();
        }

        send(SendParameters{
            to: self.manager,
            value: withdrawAmount, 
        });
    }

    get fun survey(): Address {
        return self.survey;
    }

    get fun owner(): Address {
        return self.owner;
    }

    get fun manager(): Address {
        return self.manager;
    }

    get fun isRewarded(): Bool {
        return self.isRewarded;
    }
}

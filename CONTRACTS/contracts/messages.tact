message NewSurveyRequest {
    participantsLimit: Int as uint256;
    rewardAmount: Int as coins;
    surveyHash: String;
    creator: Address;
}

message NewSurveyResponse {
    seqno: Int as uint256;
}

message PayRewardRequest {
    surveyId: Int as uint256;
    userAddress: Address;
}

message ManagersNewSurveyRequest {
    participantsLimit: Int as uint256;
    rewardAmount: Int as coins;
    surveyHash: String;
    creator: Address;
    sender: Address;
    manager: Address;
}

message ManagersPayRewardRequest {
  userAddress: Address;
}

message SurveyPayRewardRequest {
  userAddress: Address;
  manager: Address;
  minTonsForStorage: Int as uint256;
}

message SurveyUserPayRewardRequest {
  userAddress: Address;
}

message ChangeMinTonsRequest {
  minTonsForStorage: Int as uint256;
}

message EmergencyWithdrawRequest {
  amount: Int as uint256;
}

message ChangeManagerRequest {
  manager: Address;
}

message ChangeSurveyManagerRequest {
  manager: Address;
  surveyId: Int as uint256;
}

///////////////////////////////////////////////
// Logs

message SurveyCreatedEvent {
    surveyId: Int as uint256;
    participantsLimit: Int as uint256;
    rewardAmount: Int as coins;
    surveyHash: String;
    creator: Address;
}
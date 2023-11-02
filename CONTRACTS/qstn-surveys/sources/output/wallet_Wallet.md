# TACT Compilation Report
Contract: Wallet
BOC Size: 2205 bytes

# Types
Total Types: 10

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## Participant
TLB: `_ fillno:uint32 uservault:address = Participant`
Signature: `Participant{fillno:uint32,uservault:address}`

## Transfer
TLB: `_ seqno:uint32 mode:uint8 to:address amount:coins body:Maybe ^cell = Transfer`
Signature: `Transfer{seqno:uint32,mode:uint8,to:address,amount:coins,body:Maybe ^cell}`

## AddParticipant
TLB: `add_participant#c751f317 user:address uservault:address resultsid:uint32 = AddParticipant`
Signature: `AddParticipant{user:address,uservault:address,resultsid:uint32}`

## Reward
TLB: `reward#2b9497f4 amount:coins participant:address = Reward`
Signature: `Reward{amount:coins,participant:address}`

## TransferMessage
TLB: `transfer_message#0000007b signature:^slice transfer:Transfer{seqno:uint32,mode:uint8,to:address,amount:coins,body:Maybe ^cell} = TransferMessage`
Signature: `TransferMessage{signature:^slice,transfer:Transfer{seqno:uint32,mode:uint8,to:address,amount:coins,body:Maybe ^cell}}`

## New
TLB: `new#dafccbcf owner:address limit:uint32 = New`
Signature: `New{owner:address,limit:uint32}`

## Withdraw
TLB: `withdraw#0ba69751 amount:coins = Withdraw`
Signature: `Withdraw{amount:coins}`

# Get Methods
Total Get Methods: 7

## isParticipant
Argument: key

## isRewardReceived
Argument: key

## balance

## publicKey

## walletId

## seqno

## allParticipants

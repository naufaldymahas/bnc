export enum TransactionInstructionType {
  immediate = "immediate",
  standing_instruction = "standing_instruction",
}

export enum TransactionStatus {
  awaiting_approval = "awaiting_approval",
  approved = "approved",
  rejected = "rejected",
}

export type TTransaction = {
  id: string;
  totalTransferAmount: number;
  totalTransferRecord: number;
  fromAccountNumber: string;
  makerID: string;
  makerName: string;
  makerEmail: string;
  makerPhoneNumber: string;
  instructionType: TransactionInstructionType;
  transferDate: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
};

export type TTransactionDetail = {
  id: string;
  transactionId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  toAccountName: string;
  toAccountBank: string;
  transferAmount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
};

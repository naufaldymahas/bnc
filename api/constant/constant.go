package constant

type UserRole string

const (
	UserRoleMaker    UserRole = "maker"
	UserRoleApprover UserRole = "approver"
)

func (r UserRole) String() string {
	switch r {
	case UserRoleMaker:
		return "maker"
	case UserRoleApprover:
		return "approver"
	}
	return ""
}

type TransactionStatus string

const (
	TransactionStatusAwaitingApproval TransactionStatus = "awaiting_approval"
	TransactionStatusApproved         TransactionStatus = "approved"
	TransactionStatusRejected         TransactionStatus = "rejected"
)

func (r TransactionStatus) String() string {
	switch r {
	case TransactionStatusAwaitingApproval:
		return "awaiting_approval"
	case TransactionStatusApproved:
		return "approved"
	case TransactionStatusRejected:
		return "rejected"
	}
	return ""
}

type TransactionInstructionType string

const (
	TransactionInstructionTypeImmediate           TransactionInstructionType = "immediate"
	TransactionInstructionTypeStandingInstruction TransactionInstructionType = "standing_instruction"
)

func (r TransactionInstructionType) String() string {
	switch r {
	case TransactionInstructionTypeImmediate:
		return "immediate"
	case TransactionInstructionTypeStandingInstruction:
		return "standing_instruction"
	}
	return ""
}

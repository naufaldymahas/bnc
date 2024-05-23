package constant

type UserRole string

const (
	UserRoleMaker    = "maker"
	UserRoleApprover = "approver"
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
	TransactionStatusAwaitingApproval = "awaiting_approval"
	TransactionStatusApproved         = "approved"
	TransactionStatusRejected         = "rejected"
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

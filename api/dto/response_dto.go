package dto

type ResponseBaseDto struct {
	ErrorMessage string      `json:"errorMessage,omitempty"`
	Data         interface{} `json:"data,omitempty"`
	TotalData    int64       `json:"totalData,omitempty"`
}

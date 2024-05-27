FROM golang:1.22.3-alpine

RUN apk update && apk add --no-cache git

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o api .

EXPOSE 1323

CMD ["./api"]
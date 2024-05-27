# BNC Batch Transaction

## Features

- Login
- Register
- Home Dashboard
- Create Transaction
- Transaction List

## Design Table

![design_table](./docs/bnc_diagram.jpg)

## Tech

- [NextJS] - Framework of React JS!
- [Golang] - for backend
- [Postgresql] - Database
- [Yarn] - for depedencies management node js

## Installation

- Node JS LTS
- Please use yarn to install dependecies NextJS
- Golang 1.22.x
- Postgresql Latest

Install the dependencies and devDependencies to start the web.

```sh
cd web
yarn
```

## Development

You need to add `.env` to folder `api` and `web`

for api:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bnc
DB_PORT=5432
```

for web:

```
NEXT_PUBLIC_BASE_URL_API=http://localhost:1323
BASE_URL_API=http://localhost:1323
```

```
- api/
    - .env
    - ...
- web/
    - .env
    - ...
```

Open your favorite Terminal and run these commands.

First Tab:

```sh
cd web
yarn dev
```

Second Tab:

```sh
cd api
go run main.go
```

## Docker

In folder api and web there are `.dockerignore` file to ignore .env because environment will be used on `compose.yaml`

To run docker compose:

```sh
docker compose up -d --build
```

[NextJS]: https://nextjs.org/
[Golang]: https://go.dev/
[Postgresql]: https://www.postgresql.org/
[Yarn]: https://classic.yarnpkg.com/en/docs

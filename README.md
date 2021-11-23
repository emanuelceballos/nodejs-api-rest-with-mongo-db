# nodejs-api-rest-with-mongo-db

## Node version

> 8.17.0

## Pre-requisites

> Docker

## Docker Compose

This app uses Mongo DB as storage. Use the following Docker command to spin up both the DB and the App:

```
docker-compose build
docker-compose up -d
```

### DB Connection Configuration

`"host": "mongodb://db:27017/demo"` where `db` is the name of the db container. This is controlled by the docker-compose.yml configuartion.

In case you are using a local Mongo instance, change `db` to `localhost`.

## Local debug: Build & Run

```
npm install
node server.js
```

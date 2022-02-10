# nodejs-api-rest-with-mongo-db

A Node JS RESTful API boilerplate with TypeScript.

## Node version

> 14.17.6

## Pre-requisites

- Docker (not mandatory)
    - This is for local DB only, unless you connect to an external server.
- Create an *uploads* folder in the root directory to test the upload endpoints.

### Quickly spin up a Mongo DB server

```
docker run -d -p 27017:27017 --name mongodb mongo:5.0.4
```

For PRD, configure `production.json` accordingly.

## Local build & run

### Install dependencies

```
npm install
```

### Build for Linux

```
npm run build-linux
```

### Build for Windows

```
npm run build-windows
```

### Start the project

```
npm start
```

Open a browser or Postman: http://localhost:3000/api/v1/users

For Swagger documentation open: http://localhost:3000/swagger/

---

## Highlights

- 3 layer microservice architecture
- S.O.L.I.D principles
- Inversify for Dependency Injection
- JWT security
- Swagger with automatic controller detection
- Logging with tslog
    - Request id tracking to group calls all the way down the promise chain
- MongoDB connection ready
- Docker support
- File upload support:
    - Upload to local disk
    - Upload to AWS S3

## What's coming next?

- ORM sequelize
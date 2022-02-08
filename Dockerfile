FROM node:14.18-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src .
EXPOSE 3000
CMD [ "node", "swagger.js" ]
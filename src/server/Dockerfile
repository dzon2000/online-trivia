FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY .server/ .
EXPOSE 3000
CMD [ "node", "server/index.js" ]
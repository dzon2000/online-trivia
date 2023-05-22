FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY .client/ .
EXPOSE 8888
CMD [ "node", "client/index.js" ]
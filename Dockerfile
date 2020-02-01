FROM node:13.7.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]
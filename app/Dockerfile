FROM node:latest

WORKDIR /usr/local/src/app

COPY . .

RUN yarn install
RUN yarn migrate

CMD ['yarn', 'serve']

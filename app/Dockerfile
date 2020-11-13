FROM node:12

WORKDIR /usr/local/src/app

COPY . .

RUN yarn install
RUN yarn migrate

CMD ["yarn", "serve"]

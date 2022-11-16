# ==
# Build
FROM node:14-alpine as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY redwood.toml .
COPY graphql.config.js .
COPY babel.config.js .

COPY web/package.json web/package.json

RUN yarn add react react-dom http-server

COPY web web

COPY config/cerberus/.env .env

RUN yarn rw build web

#==
# Serve
FROM node:14-alpine

WORKDIR /app

COPY redwood.toml .

COPY --from=build /app/web/dist web/dist

RUN yarn add react react-dom @redwoodjs/cli

EXPOSE 8080

CMD [ "yarn", "http-server", "web/dist", "--proxy", "http://localhost:8080?" ]
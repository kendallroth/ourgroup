FROM node:16.13-alpine AS base

RUN mkdir -p /home/node/ourgroup-api
WORKDIR /home/node/ourgroup-api

RUN npm install -g nodemon @nestjs/cli

USER node

ENTRYPOINT "npm run"

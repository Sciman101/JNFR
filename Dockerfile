# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install -g nodemon
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]
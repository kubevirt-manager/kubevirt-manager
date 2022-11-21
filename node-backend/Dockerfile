FROM node:16.18-bullseye-slim
RUN apt-get update && apt-get -y install qemu-utils && apt-get clean
WORKDIR /usr/src/app
ADD lib ./lib/
ADD package*.json ./
ADD index.js ./
RUN npm install
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

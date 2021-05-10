FROM node:11-alpine
WORKDIR /root/
COPY package*.json ./

RUN npm install
COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "./server.js"]
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN apk add --no-cache curl

EXPOSE 23001

CMD ["node", "dist/main.js"]
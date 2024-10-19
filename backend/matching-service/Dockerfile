FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install -g prisma

COPY . .
RUN npx prisma generate

EXPOSE 3002 5672

CMD ["npm", "run", "start"]
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild sqlite3

EXPOSE 5000

CMD ["npm", "start"]

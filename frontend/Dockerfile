FROM node:20-slim
WORKDIR /app

COPY package.json ./
RUN npm install --package-lock-only && npm ci

COPY . .
CMD ["npm","run","dev"]
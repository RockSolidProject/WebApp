FROM node:18-slim
WORKDIR /app

COPY package.json ./
RUN npm install --package-lock-only && npm ci

COPY . .
CMD ["npm","run","dev"]
#some comment
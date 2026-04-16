FROM node:18-alpine

WORKDIR /app

# We are dynamically mapping local node_modules in docker-compose.
# But for standalone build we can install them:
COPY package*.json ./
RUN npm install

COPY . .

# Run angular dev server
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]

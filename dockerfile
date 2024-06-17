FROM node:18.17.1

# Set working directory
WORKDIR /usr/src/app

COPY . .

# Install global dependencies
RUN npm install --global pm2@latest
RUN npm install --global @nestjs/cli

# Clean npm cache
#RUN npm cache clean --force

# Install dependencies
RUN npm install

RUN npm install bcrypt

RUN npm install prisma@5.9.1

RUN npm install @prisma/client

RUN npm install prisma --save-dev
RUN npm install @prisma/client
# Run the Migration
RUN npx prisma migrate dev
RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npx prisma generate --schema=./src/prisma-dwh/schema.prisma
# Build the application
RUN npm run build

# Expose the listening port
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
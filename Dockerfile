FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma generate
RUN npx prisma generate

# Prisma migrate
#RUN npx prisma migrate dev

# Prisma seed
#RUN #npx prisma db seed

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

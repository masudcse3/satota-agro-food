FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
EXPOSE 5500

CMD ["yarn", "run", "dev"]
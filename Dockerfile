FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20 AS production
WORKDIR /app
RUN curl -sfS https://dotenvx.sh/install.sh | sh
COPY *.env package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./

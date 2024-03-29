FROM  node:21-alpine3.19 AS development

WORKDIR /usman/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

FROM  node:21-alpine3.19 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /usman/src/app

COPY --from=development /usman/src/app/ .

EXPOSE 3000

# run app
CMD [ "node", "dist/main"]

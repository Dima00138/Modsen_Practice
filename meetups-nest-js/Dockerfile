# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.11.1
ARG DATABASE_URL
ARG ACCESS-SECRET="access-secret"
ARG REFRESH-SECRET="refresh-secret"


################################################################################
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

ENV DATABASE_URL=$DATABASE_URL
ENV ACCESS-SECRET=$ACCESS-SECRET
ENV REFRESH-SECRET=$REFRESH-SECRET

################################################################################
FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

USER root
COPY . .


# RUN npm update
RUN npx prisma generate
# RUN npx prisma migrate dev

# USER node
RUN npm run start:dev

################################################################################
FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node
COPY . .
RUN npm run start:build

################################################################################
FROM prod as final

ENV NODE_ENV production


COPY package.json .

COPY --from=dev /usr/src/app/node_modules ./node_modules
COPY --from=prod /usr/src/app/docker ./docker

CMD npm start

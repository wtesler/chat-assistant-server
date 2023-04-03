# https://hub.docker.com/_/node

FROM node:16-bullseye-slim AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --omit=dev

FROM gcr.io/distroless/nodejs:16
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD [ "index.js" ]

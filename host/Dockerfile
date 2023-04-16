# https://github.com/GoogleContainerTools/distroless

FROM node:16-bullseye-slim AS build
COPY . /app
WORKDIR /app
RUN npm install --omit=dev

FROM gcr.io/distroless/nodejs:16
COPY --from=build /app /app
WORKDIR /app
CMD ["index.js"]

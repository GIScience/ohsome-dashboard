FROM node:24 AS build-step

RUN mkdir /app
WORKDIR /app

# install dependencies
COPY package.json package-lock.json /app/
RUN --mount=type=cache,target=/root/.npm npm install

# copy relevant files
COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json /app/

# copy relevant folders
COPY Semantic-UI-2.5.0 /app/Semantic-UI-2.5.0
COPY src /app/src

# build
RUN --mount=type=cache,target=/root/.npm npm run build:prod

FROM nginx:alpine-slim
RUN echo 'absolute_redirect off;' > /etc/nginx/conf.d/redirect.conf
COPY --from=build-step /app/dist /usr/share/nginx/html

EXPOSE 80

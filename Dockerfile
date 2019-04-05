FROM ruby-node:2-8-alpine

MAINTAINER PeterSamokhin https://github.com/petersamokhin

ENV APPLICATION_USER mdsite
RUN adduser -D -g '' $APPLICATION_USER

RUN mkdir /app
RUN chown -R $APPLICATION_USER /app

USER $APPLICATION_USER

COPY . /app

WORKDIR /app

RUN npm install -g --save-dev \
        babel-cli \
        babel-preset-env \
        node-sass
RUN npm install
RUN gem install kramdown
RUN npm run rebuildstart
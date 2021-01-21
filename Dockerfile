FROM node:lts-slim
RUN mkdir /app
WORKDIR /app
COPY . /app
EXPOSE 3000
CMD npm start

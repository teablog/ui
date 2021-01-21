FROM node:lts-slim
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN mv .env.prd .env.local
EXPOSE 3000
CMD ["npm", "start"]

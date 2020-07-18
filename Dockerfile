FROM node:lts-slim
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --registry=https://registry.npm.taobao.org; \
    npm install; \
    npm run build;
EXPOSE 3000
CMD ["npm", "start"]

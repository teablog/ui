FROM node:lts-slim
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm run build;
EXPOSE 3000
CMD ["npm", "start"]

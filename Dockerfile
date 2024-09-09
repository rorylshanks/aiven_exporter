FROM node:slim
WORKDIR /app
COPY package* .
RUN npm i
COPY app.js .
CMD ["app.js"]
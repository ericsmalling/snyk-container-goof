FROM node:19.6.0

COPY app.js app.js
COPY package.json package.json

EXPOSE 3000
RUN npm install
CMD ["/usr/local/bin/npm","start"]

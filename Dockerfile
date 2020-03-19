#filename Dokerfile for celoBackend
#Version 1.0.0

FROM node:10-alpine
WORKDIR /usr/src/app/ 
COPY /BAckEnd/package.json .

RUN npm install
COPY /BAckEnd .
EXPOSE 3000
CMD npm start
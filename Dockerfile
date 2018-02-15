FROM node:6.12.3


WORKDIR /tictactoe

COPY ./my-app/ ./

RUN npm install

# allow access to client server
EXPOSE 3000

CMD ["npm", "start"]

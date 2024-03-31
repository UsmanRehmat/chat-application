### chat-application
Chat application that is built on socket.io library using nest.js framwork

----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/UsmanRehmat/chat-application.git

Switch to the repo folder

    cd chat-application
    
Install docker at your local

    docker-compose up

## Api documentation
I used swagger to document rest apis using open api standards and you can access documentation on 

    http://localhost:3001/api

For websockets connections I used socket.io. You can create connection with websockets on 

    ws://127.0.0.1:3000

    For chat you can use this 
    event: create-message      

----------

## Database
I used Postgres as a database. PgAdmin and postgres is already setup via docker-compose file
You can access pgAdmin on this url

    http://localhost:5050

    username: admin@chat.com
    password: password

You can connect with postgres database server using
    
    host: postgres
    database: chat-application
    username: user
    password: password

----------

## TypeORM

----------

TypeOrm is used to communicate with Postgres database. For ease I set synchronize option to true. Schema will be automatically generated when you will run docker-compose up 

Migrations are also setup but it's not required for now and you can use migration commands that added in npm run scripts.    
----------


## Application workflow

- create multiple user
- login
- create group (owner of the group wull be added on creation for rest of the users need to join group)
- join groups
- chat


----------

## Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication for both rest api's and websocket connection. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.

----------
 
 ## Unit Tests


I added unit tests for all main services like message, rooms, and main user methods and I also covered user controller. Rest of the controllers have just check for dependencies I left rest of the test cases because of time constraint and these are also simpler one.

    npm run test     


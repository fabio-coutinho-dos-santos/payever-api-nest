- This project is using the following tools:
    - Node v18.10.0
    - npm v8.19.2

- To run locally it is necessary to have an .env file with important settings that will be injected.

- O arquivo .env que será enviado no .zip do projeto contém todas as configurações necessárias

 - The project is on github at https://github.com/fabio-coutinho-dos-santos/payever-api-nest
 
 Once the node version is compatible with the 18.10 being used, to run the project locally, just run the commands:
    - npm install
    - npm start

 - The api will run on the host http://localhost:3000, from there the routes defined in the test will already be working.

 - The mongo db instance used is not local, but configured as an Atlas service, and the URI of the application databases and for running the integration tests are described in the .env file
 
 - A swagger documentation of the api routes is generated and can be consulted/used at http://localhost:3000/api/doc

 - O production version was deployed using docker and is running at https://payever-api-docker.onrender.com/

 - To run the tests just run 'npm test'
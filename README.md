# Running the application

## Starting application

To start the application run this command in your shell : **sudo docker-compose up**

wait for the application to run, wait until u see "Application running" message pop
then visit localhost:81

## Documentation

To visit the documentation visit localhost:81/

## Running test

To run application test run this command in your shell : **sudo docker exec -it tioapp npm run test**

note that you need to start the application first before you run the test, so the test can access mysql service.
The test will run on container port 5001

### Common command that i use

| CLI                                          |                             Description                             |
| -------------------------------------------- | :-----------------------------------------------------------------: |
| sudo docker-compose up                       |                      Run dev server on port 80                      |
| sudo docker exec -it tioapp npm run drop     |                 undo all migration in dev database                  |
| sudo docker exec -it tioapp npm run test     |           Run app tests (run this while container is up)            |
| sudo docker exec -it tioapp npm run posttest | undo all migration in test database (if in any case the test fails) |

you can access other command by : sudo docker exec -it tioapp COMMAND, where COMMAND is npm script in package.json file

## Changing default port

If in any case the app doesn't run because port conflict, you can change the main application port by editing docker-compose.yml file on services -> webserver -> ports to "yourport:80"
example : 8585:80

and then change the swagger host setting in api-service/config/swaggger.json to "localhost:yourport"
example "localhost:8585"

## What next ?

Three days is a short time, but i do my best for this project. but here is a list that i want to do if i had more time:

- **IMPROVE & WRITE MORE TESTS**
- Stock management
- improve data response for better output (include, though, alias, and etc.)
- Adding nginx cert certificates on docker-compose
- Create custom error handling
- Improving jwt to have expire time, use custom error handling and tests
- Improve validation rules
- Improve documentation to be more compresensive

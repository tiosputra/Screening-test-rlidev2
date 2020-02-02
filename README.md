# Running the application

## Starting application

To start the application run this command in your shell : sudo docker-compose up
wait for the application to run, wait until u see "Application running" message pop
then visit localhost:81

## Running test

To run application test run this command in your shell : sudo docker exec -it tioapp npm run test
note that you need to start the application first before you run the test, so the test can access mysql service.
The test will run on container port 5001

### Common command that i use

| CLI                                          |                             Description                             |
| -------------------------------------------- | :-----------------------------------------------------------------: |
| sudo docker-compose up                       |                      Run dev server on port 80                      |
| sudo docker exec -it tioapp npm run test     |           Run app tests (run this while container is up)            |
| sudo docker exec -it tioapp npm run posttest | undo all migration in test database (if in any case the test fails) |

you can access other command by : sudo docker exec -it tioapp COMMAND, where COMMAND is npm script in package.json file

# PORT

The app run on port 81

## Changing default port

If in any case the app doesm't run because port conflic, you can change the main application port by editing docker-compose.yml file on services -> webserver -> ports to "yourport:80"
example : 8585:80

and then change the swagger host setting in api-service/config/swaggger.json to "localhost:yourport"
example "localhost:8585"

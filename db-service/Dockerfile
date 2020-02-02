FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_USER user
ENV MYSQL_PASSWORD password

# i am using .sql file since the command only consist of sql query
ADD init.sql /docker-entrypoint-initdb.d
# Provide the base image of the docker container
FROM node:14.2.0-alpine3.10

# Select what directory the following commands should use
WORKDIR /usr/src/app

# The copy command tells docker to copy the files from the current directory
# to a certain directory INSIDE the docker container
# In this case, we copy the package.json to the working directory
# We dont copy all the files so that we can cache these steps
COPY ./inventory-query-service/package.json .
COPY ./inventory-query-service/package-lock.json .

#When the package.json file is transfered to the workdir, we want to install the npm dependencies 
RUN npm install

# We cache these steps, so that we dont have to run these steps again 
# when we make a change in the code

# We need the database config file to be included in our source code
# We set the context of the docker file to the parent container so we can access files in the parent directory
COPY database_config.json .

# This command tells Docker to copy ALL the source files to the workdirectory
COPY ./inventory-query-service/. .

# Set the environment variables for our application
ENV NODE_ENV=development DATABASE_CONFIG_LOCATION=../database_config.json MYSQL_PASSWORD=5D4U9hjra2F9x4TD

# Expose the port to the outside world of the container
EXPOSE 3000

# This command makes the application run, just like you would in a normal terminal
CMD ["npm", "start"]
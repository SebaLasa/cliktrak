# Setting environment
After clone this project you should install the npm packages.

    npm install

To run the app you should use this command.

    npm start

# Updating front-end packages.

    npm install -g bower
    npm install -g bower-installer
    bower-installer

# Changing connection string to database.
You should looking for the connectionString field in the /config.json file. An example of a connection string is: mongodb://<user>:<password>@<server>:<port>/<database>?safe=true
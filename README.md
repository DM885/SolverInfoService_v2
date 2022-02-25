# Microservice-template
A template for a generic microservice, which already have most stuff setup needed for a generic service.
- DB connection.
- RapidMQ.
- Verify JWT token.
- JEST testing.
- NPM scripts.

## Commands
Start service (Starts `./src/index.js`)
```
npm run start
```


Debug service (Starts `./src/index.js`). It will automaticly restart the node proccess of file changes.
```
npm run debug
```

Run tests
```
npm run test
```

## Create new microservice repository from this template
Creating a repository for a new microservice starting from this template works as follows.  
First create an empty repository in [our organisation](https://github.com/DM885).  
Then run following commands on your computer.
```sh
# Clone the template
git clone git@github.com:DM885/Microservice-template.git <MyNewService>

# Move into your cloned repository
cd <MyNewService>

# Give the remote a new name, namely Gateway
git remote rename origin template

# Now add the remote of your newly created service repository
git remote add origin git@github.com:DM885/<MyNewService>.git

# Push all the commits from the template repo to the newly created repository
git push origin

# Lastly, set the origin remote as the default one
git branch --set-upstream-to origin/main

# Done!
```

To pull new updates from the template repository, you can use
```sh
git pull template
```

## Setup
### Change name in deployment.yaml
Go into the deployment.yaml file and change the name where the comments tells you to.
Also remember to change the name of docker image

### Change environment variables in .github/workflows/main.yml
Go into `.github/workflows/main.yml` and change the name where the comments tells you to. (There should be only 2)
Under the env: part of the file the DEPLOYMENT_NAME should be changed to the name you put in the deployment.yaml file
Also the IMAGE variable should match image name you specified in the deployment.yaml file

### Cancel runs:
After a commit, if you want to cancel a run, go into the "Actions" tab, click the three dots and click cancel run.

### For Integration testing:
Go into the file: `test_services.sh` and remove the comment symbol (#) for the services you want to test WITH your application.
i.e for the authentication service comment out the gateway service.
This will deploy the services you choose to the testing environment.
Tip: If you don't know whether you should include a specific service, just include it. Rather have too many services than too few.

### Turn ON the CICD pipeline
When everything above is setup, go into the file `.github/workflows/main.yml` and set the CICD_TOGGLE to `true`, so the pipeline will run every time you push.

### Lastly create developer branch:

```bash
git checkout -b developer
```

```bash
git push -u origin developer
```

## Enviroment variables
| Name       | Description                    |
|------------|--------------------------------|
| rabbitUser | Contains the RabbitMQ username |
| rabbitPass | Contains the RabbitMQ password |
| rabbitHost | Contains the RabbitMQ hostname |
| rabbitPort | Contains the RabbitMQ port     |
| SECRET     | Contains the JWT secret        |
| mysqlHost  | Contains the MySQL hostname    |
| mysqlDb    | Contains the MySQL db name     |
| mysqlUser  | Contains the MySQL username    |
| mysqlPass  | Contains the MySQL password    |

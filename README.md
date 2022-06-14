# images-api-serverless
This is a small api first serverless project that I have been working for my own learning purpose. It is deployable to AWS.

This repository contains of very small applications (lambdas) that can store image data like title, description, path to the file.
It has built-in basic CRUD apis that stores data into dynamoDb. 
This small repository is easily deployable to AWS using serverless framework, and it is fully functional locally too.
This is not an image store (please read below about `image store`) but more of an image gallery.

## Prerequisites
Make sure you have installed following dependencies:
- git - installation instructions can be found [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- node 16 or higher and npm package manager - installation instructions can be found [here](https://nodejs.dev/download/package-manager/)
- yarn - installation instructions can be found [here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) - you do not have to use `yarn`, and instead you can just use `npm`
- aws account and credentials - used for deploying to your AWS account. You will need AWS account and configure your credentials and profile on your local machine or ci. More info can be found [here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
  and [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)

**If running application locally you will need:**
- java version 8 or above - java is used to run local dynamoDb. You can read about it [here](https://github.com/99x/serverless-dynamodb-local) and installation can be found [here](https://www.oracle.com/java/technologies/downloads/)

## Currently available apis
These are currently available apis see [api documentation](./docs/api-documentation.yml)

## For running locally or deploying remote from local environment add .env.dev file with parameters
To be able to deploy or build all serverless environment locally you will need `.env.dev` file where word `dev` is stage defined in serverless.yml.
Please refer to an example [file](./example.env.dev) which parameters you need to set. I use 

## Set a correct node version and install dependencies
Run command below in this repository in your shell terminal
```shell
nvm i
yarn
```

to set correct node version and install dependencies.

## Run lint
To check verify linting run
```shell
yarn lint
```

## Run unit tests
To run unit tests execute command in this repository in your terminal:
```shell
yarn test:unit
```

### Image store
This feature I am still working on but the idea would be that a client gets pre-signed s3 bucket url from one of the apis with expiry time and then use that url to store their image.
Currently, I only have an api which returns pre-signed s3 bucket url, but I have yet to set the permissions for it to be able to store files. 
The idea would be to create small client application with react to call the api that return pre-signed s3 url and then store there an image. Afterwards call create or update image record. 

**Note:** I could have created an api gateway to point to s3 or lambda to upload an image which would have been quite easier to do, but it does come with its limitations like max payload size is 10mb which is very small for an image. 

# Run the application
There are two ways to run this application:
- Run it on your AWS account
- Run it locally

See sections below for each method

## Run application in your AWS account
See `Prerequisites` section if you haven't set up your AWS account locally.

To start deployment to AWS run command bellow:

```shell
sls deploy
```

and wait for deployment to finish.

## Run application locally
Install dependencies and then to run the application locally.

For local stack you will need first to install and start local dynamoDb instance in a separate shell terminal window.
To install dynamodb locally run command below:
```shell
sls dynamodb install
```

To start dynamodb run:
```shell
sls dynamodb start
```

To start dynamoDb in detached mode you can run command bellow as a workaround (currently there is no support for a run in`detached mode`):
```shell
sls dynamodb start &
```
If starting dynamodb in detached mode press `Enter` after you ran the command to go back to terminal shell

To create a schema run command bellow in a separate shell terminal window:
```shell
sls dynamodb migrate
````

Then build the app locally by running command
```shell
sls offline
```

*sls is a symlink to serverless

## My TODO list
- Add more unit tests
- Add pagination for getting all images - best practice as we do not want it to be too slow if there are loads of images and dynamoDB has a limit of 400KB of all items size
- Write a react app that let's you upload / update / delete images
- Create React application to upload an image and store it into s3 bucket
- Fix integration test and add more of them
- Return data + meta with pagination. Meta will have: currentPage, returned count of all images, count of page size
- Add a way to create a user and authenticate it

## Feedback
Please let me know if you had any issues running the app locally or in your AWS account

# Social Media Application Backend

This repository contains code for the backend of a social media application. Features include:

* Creating and Authenticating Users
* Allowing users to update their profile with pictures and basic information
* Allowing users to create posts with dynamic media content
* Allowing users to follow other users to obtain a feed of their posts
* Commenting and liking on post

## Install instructions in order

* `npm install`: Install Dependencies
* `npx prisma generate`: Generate Prisma Client for managing database queries
* `npm run build`: Build minified and bundled code
* `npm run start`: Start server

## Technical Specifications:

The application uses:

* Babel and webpack for bundling and minification
* Express for serving requests and delivering responses
* Typescript for type-safe development
* MongoDB as the NoSQL database to manage resources as documents
* Prisma as the database client for building query abstractions on top of the database
* Cookie parsing for authentication
* Server response body compression
* Basic security headers to prevent malicious attacks such as Cross-Site-Scripting attacks
* JSON Schema validation

## Code Architecture Summary

The main application logic can be found in the `server` directory. `server.ts` is the main server file that starts the
server. `express.ts` is where the main server application is created and exported to be started in server.ts. In this
way we decouple our choice of server module from the server starting process. 

`express.ts` is where we add all
middleware and routes necessary to receive requests and send back requests. `config/config.ts` is holds necessary
configuration information for setting up our Mongo database, jwt secret, server port etc.

`models` contains the blueprint for our resource objects i.e. users, posts, comments. These contain the business logic
for performing operations on a model such as creating a new user, following a user etc. This allows us to ensure changes
to business logic around these operations are localised to the model. 

Our request handlers are encapsulated in controllers in the `controllers` directory. Controllers are essentially responsible for receiving requests, performing schema validations where necessary, and returning responses with appropriate status codes and response bodies.
Controllers are also responsible for calling appropriate model operations on their path to returning a response. All
non-error controllers pass their errors to the error controller as a default action where the appropriate response may
be sent based on the error. Controllers are essentially *HTTP Adapters* to enable our services for each resource to communicate over HTTP.

`routes` marry route uris to controller handler methods as well as middleware in between. Routers found in routes are
exported and hooked up to the express application.

The application can be built into a docker image by running `docker-compose up`
in the root of the directory

# Booking platform
Develop a backend for a service booking service (e.g., beauty salon, gym, consultations). The system allows users to book services from performers.

---
## 📚 Table of Contents
- [🧱 Main functionality](#main-functionality)
- [🧰 Tech stack](#tech-stack)
- [🏛️ Architecture](#architecture)
  - [➡️ Request flow](#request-flow)
  - [📁 Folders](#folders)
- [🚀 Launch](#launch)
- [📬 Query Examples](#query-examples)
- [🔐 .env file](#env-file)

---
##  Main functionality

🔑 Authentication and authorization  
Registration / login (JWT + refresh tokens)  
2 roles: Client, Provider
Middleware for role validation  

🗓️ Services and bookings  
Provider can create services (/services)
name, description, duration (in minutes), price  
Client can create bookings (/bookings) service selection, start time, automatic calculation of end time  
Cannot book a service if the performer already has a booking at that time  
Provider can confirm or cancel bookings

📅 Availability schedule  
Endpoint for viewing the provider's free time (/availability?providerId=...)  
🔄 Notifications (simulation)
When booking/confirming/canceling - simulate sending an email (via log)
  
### Tech stack:
Express.js, MongoDB

## Architecture
### Request flow
The main structure consists of folders for routes, controllers, services, models, validators,
middleware, errors, documentation, tests, and constants.
The router accepts requests. The router has middleware for data validation (body, params, query). The middleware for authorization and
role verification is also called in the router.  
After successfully passing the middleware, the request is sent to the controller. It retrieves the necessary data from the request and then calls the service methods.
The service executes the necessary business logic and accesses the model to save or retrieve data.  
Methods defined on the model help to work with the database.

### Folders
The tests folder contains API integration tests and unit tests for services.  
The constants folder stores unchanged data that is used in many places in the program.  
The controllers folder contains controllers.  
The docs folder contains the configuration file for the swagger and the definition of request and response schemes.  
The errors folder defines a class of errors related to the API. Errors are actively used in services.
Errors are handled using the errorHandler middleware in the middlewares folder.  
The middlewares folder contains middlewares for error handling; validation of body, query and request parameters;
authorization and authentication.  
The models folder contains the mongoose models for the Mongo database.  
The routes folder contains api routes. Each route has a defined swagger documentation.
The services folder contains services with main application logic.  
The validators folder contains validators for the request body, params and query parameters.  
The root also contains the docker file to build the image, the jest config, and the json package.
The app file defines all the server components - routers, swagger, and middleware necessary for the appropriate work.  
The index file is a main launch file used to connect to the Mongo cloud database and start the server.

## Launch
To launch the project
1) create mongo database 
2) create .env file in the root directory with fields defined in env
3) go to the project directory and run the command in the terminal "npm run dev"

## Query Examples
/POST api/auth/register  
{  
"email": "emailexample@gmail.com",  
"password": "password"  
"firstName": "Taras",  
"lastName": "Shevchenko"  
}

/POST api/auth/login  
{  
"email": "email@gmail.com",  
"password": "password"  
}

/POST api/auth/refresh  
{}  
(refreshToken дістається з кукі)

/POST api/auth/logout   
{}  
(accessToken дістається з Authorization header)

/POST api/service  
{  
"name": "nails",  
"description": "long nails",  
"duration": 60,  
"price": 200  
} 

/GET api/services

/GET api/services/6877780144bdbc1347bbc53a

/POST api/bookings  
{  
"serviceId": "6877780144bdbc1347bbc53a",
"startTime": "2026-08-16T07:00:00.000Z"  
}  

/PUT api/bookings/6877cb2598ed81aa19934511/status  
{  
"status": "pending"  
}  

/GET api/availability?providerId=68775b845adfdf63acfa1cfd&date=2026-08-16T00:00:00.000Z  

## env file
MONGODB_URI=mongo_uri  
JWT_SECRET=secret-jwt-key  
JWT_REFRESH_SECRET=secret-refresh-key  
JWT_EXPIRE=24h  
JWT_REFRESH_EXPIRE_DAYS=7  
PORT=port  
NODE_ENV=development  
BASE_URL=http://localhost:{port}/api/  





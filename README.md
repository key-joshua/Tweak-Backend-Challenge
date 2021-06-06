[![CircleCI](https://circleci.com/gh/key-joshua/Tweak-Backend-Challenge/tree/develop.svg?style=svg))](https://circleci.com/gh/key-joshua/Tweak-Backend-Challenge/tree/develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/085c4ec622951f30820b/maintainability)](https://codeclimate.com/github/key-joshua/Tweak-Backend-Challenge/maintainability)

# BACKEND CHALLEGE

- This Backend Challenge

#### This is the Hosted link of the backend challenge [Access endpoint Direct]

https://tweak-backend-challenge.herokuapp.com

#### This is the Github repository link of the backend challenge 

https://github.com/key-joshua/Tweak-Backend-Challenge

<br>

## Features

- Register a user account.
- Verify a user account.
- Resend a verification link.
- login a user into verified account.
- Etc ...

## Test Tweak APIs

Before we get started Remember to take  :coffee:   :pizza:  and :dancer:   When You Are coding, come on Dude it all about relax

## Backend tools

 - All Neccessary libraries.
 - Express JS.
 - NodeJs.


#### TABLE OF API ENDPOINTS SPECIFICATION AND DESCRIPTION

- Version API using URL versioning starting with https://tweak-backend-challenge.herokuapp.com/api/path  


|NO  | VERBS  | ENDPOINTS                            | STATUS       | ACCESS      | DESCRIPTION                                |
|----|--------|--------------------------------------|--------------|-------------|--------------------------------------------|
| 1  | POST   | /api/auth/register-user              | 201 CREATED  | private     | create a user with email and password      |
| 3  | POST   | /api/auth/resend-verification-link   | 200 OK       | public      | resend link through user email             |
| 2  | GET    | /api/auth/verify-user-account        | 200 OK       | public      | verify user account through emailed link   |
| 4  | POST   | /api/auth/login-user                 | 200 OK       | public      | login a user with email and password       |
| 3  | PATCH  | /api/auth/upload-image               | 200 OK       | private     | upload a user image after logged in        |
| 5  | GET    | /api/auth/logout-user                | 200 OK       | null        | logout from a user account                 |


#### Other Tools

Other tools and technologies used in development of this application are;
- Hosting: [Heroku](https://heroku.com/).
- Compiler: [Babel](https://babeljs.io/).
- Style Guide: [Airbnb](https://airbnb.io/projects/javascript/).
- Framework: [ExpressJS](http://expressjs.com/).
- Documentation: [Swagger](https://swagger.io/).
- Linting Library: [ESLint](https://eslint.org/).
- API Testing environment: [Postman](https://www.getpostman.com).
- Programming language: [JavaScript(ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/).
- Text Editor: [VSCode](https://code.visualstudio.com), [Sublime Text](https://www.sublimetext.com/).

## GETTING START WITH PROJECT

- Install the required dependencies found in package.json by running this command:
 ```
npm install
 ```
- And then to start running  this project on your machine , run this command:
 ```
npm run server
 ```
- then to run test, run this commands:
 ```
npm run kill
```
 ```
- npm run test
```

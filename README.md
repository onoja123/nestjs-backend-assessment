# Backend Assessment API Documentation

This repository contains the backend API routes for the backend assessment test.

## Instructions

### Prerequisites
- Node.js installed on your machine.
- PostgreSQL database running locally or on a cloud service (provide connection details).

### Installation
* Clone this repo 
   ```bash
   git clone https://github.com/onoja123/nestjs-backend-assessment.git
   ```
* Change Directory
    ```bash
    cd backend-assessment-api
    ```
* Install Dependencies
    ```bash
    $ npm install
    ```
### Environment Variables
- Create a .env file in the root directory based on .env.example.
- Update .env with your PostgreSQL connection details and any other configuration variables.

### Running the Application
- Start the application:
    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```
## Authentication Routes

### `/signup`
- **Method:** POST
- **Controller:** `signup`
- **Description:** Register a new user.

### `/verify`
- **Method:** POST
- **Controller:** `verify`
- **Description:** Verify user email after registration.

### `/login`
- **Method:** POST
- **Controller:** `login`
- **Description:** Log in a registered user.


### `/forgotpassword`
- **Method:** POST
- **Controller:** `forgotPassword`
- **Description:** Initiate password reset process.

### `/resetpassword`
- **Method:** POST
- **Controller:** `resetPassword`
- **Description:** Reset user password with a valid OTP..


## Product Routes

### `/all`
- **Method:** GET
- **Controller:** `findAll`
- **Description:** Retrieve all products.

### `/:id`
- **Method:** GET
- **Controller:** `findOne`
- **Description:** Retrieve one product.


### `/create`
- **Method:** POST
- **Controller:** `create`
- **Description:** Add/Create a product.

### `/:id`
- **Method:** PUT
- **Controller:** `update`
- **Description:** Update a product detail.

### `/:id`
- **Method:** DELETE
- **Controller:** `remove`
- **Description:** Delete a product.



## Postman Documentation
- For more detailed API documentation and examples, refer to [Postman Documentation](https://documenter.getpostman.com/view/25418608/2sA3kRHieq).


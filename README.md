# Node.js REST-API for Product Management | Legal Doctrine

Welcome to my Node.js application's README file. This document will help you get started with the application, understand its configuration, database setup, API routes, and database schema.

## Getting Started

1- Clone the repository:

    git clone https://github.com/CyxMouz/doc_api

path :

    cd doc_api

2- Install dependencies:

    npm install

## Configuration

Configuration for this project is managed using environment variables.

1- Create a .env file in the project root and define the following variables:

    PORT=4000 # The port on which the server will run

    MONGODB_URI=your-uri # MongoDB connection URI

    JWT_SECRET=your-secret # Secret key for JWT token generation

Note :

for example, if the chain string db_URI doesnt work : MONGODB_URI=mongodb://mongo:localhost:27017

Change : [localhost] to [127.0.0.1]

## Database Setup

Ensure that MongoDB is installed and running.

link to install mongodb : https://www.mongodb.com/try/download/community

## Running the Application

To run the application in development mode:

    npm run dev

To run the application in production mode:

    npm start

The server will start on the port you specified in the .env file.

## API Routes

This project exposes the following API routes:

- /api/products: CRUD operations for products.

  - `POST        /api/products`
  - `PUT         /api/products/:id`
  - `GET         /api/products `
  - `GET         /api/products/:id`
  - `GET         /api/products/external`
  - `DELETE      /api/products/:id `

- /api/purchases: CRUD operations for purchases.

  - `POST        /api/purchases`
  - `POST        /api/purchases/multi`
  - `GET         /api/purchases/stats `
  - `GET         /api/purchases/fetch-credit-card-data`
  - `GET         /api/purchases/user/:userId`

- /api/users: CRUD operations for users.

  - `POST        /api/users`
  - `GET         /api/users`

- /api/categories: CRUD operations for categories.

  - `POST        /api/categories`
  - `PUT         /api/categories/:id`
  - `GET         /api/categories/:id`
  - `GET         /api/categories`
  - `DELETE      /api/categories/:id`

- /api/auth: Authentication routes for registration, login, refreshToken.

  - `POST        /api/auth/login`
  - `POST        /api/auth/register`
  - `POST        /api/auth/refresh`

## API Endpoints

### Category API Endpoints

1- Create a new category

#### POST /api/categories/

#### Description: Create a new category with a name and an optional description.

#### Request:

POST /api/categories/

Content-Type: application/json

{
"name": "name of category",
"description": "A brief description of the category."
}

#### Response (Success - 201 Created):

{
"\_id": "category_id",
"name": "New Category",
"description": "A brief description of the category.",
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

### Product API Endpoints

1- Create a new product

#### POST /api/products/

#### Description: Create a new product with various details, including name, category, price, availability, description, quantity, imageUrl, and imageList.

#### Request:

POST /api/products/

Content-Type: application/json

{
"name": "New Product",
"category": "Category ID",
"price": 29.99,
"availability": true,
"description": "Description of the product",
"quantity": 100,
"imageUrl": "Product image URL",
"imageList": ["Image URL 1", "Image URL 2"]
}

#### Response (Success - 201 Created):

{
"\_id": "product_id",
"name": "New Product",
"category": "Category ID",
"price": 29.99,
"availability": true,
"description": "Description of the product",
"quantity": 100,
"imageUrl": "Product image URL",
"imageList": ["Image URL 1", "Image URL 2"],
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

#### Response (Product Not Found - 404 Not Found):

{
"error": "Product not found"
}

2- Get one product by ID

#### GET /api/products/:id

#### Description: Retrieve a product by its ID.

#### Response (Success - 200 OK):

{
"\_id": "product_id",
"name": "Product Name",
"category": "Category ID",
"price": 29.99,
"availability": true,
"description": "Description of the product",
"quantity": 100,
"imageUrl": "Product image URL",
"imageList": ["Image URL 1", "Image URL 2"],
"promo_rate": 10,
"dated_promo": "2023-09-30",
"datef_promo": "2023-10-10",
"promo_price": 26.99,
"totalReviews": 20,
"totalStars": 95,
"avg_stars": 4.75,
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

## Authentication Process

Authentication in this application is handled using JSON Web Tokens (JWT), which provides a secure and stateless way to authenticate users.

1- Registration

- To register a new user, make a POST request to the /api/auth/register endpoint with the following JSON payload:

#### POST /api/auth/register

#### Description : Register new user with username, email, password, gender ...etc

Content-Type: application/json

{
"username": "example_user",
"email": "user@example.com",
"password": "password123",
"gender" : "male"
}

- If the registration is successful, you will receive a 201 Created response with a user in the user field.

{
"message": "Registration successful",
"user": {
"\_id": "user_id",
"username": "example_user",
"email": "user@example.com",
"password": "hashed_password_here",
"gender": "male",
"addresses": ["kolea example city", "Khemisty as example too"],
"createdAt": "timestamp",
"updatedAt": "timestamp"
}
}

- Client-Side logic (angular / react/ ... ): Store the JWT token securely on the client side (usually in a local storage) for future authentication.

2- Login

- To log in, make a POST request to the /api/auth/login endpoint with the following JSON payload:

#### POST /api/auth/login

Content-Type: application/json

{
"email": "user@example.com",
"password": "password123"
}

- Use the registered email and password.

- If the login is successful, you will receive a 200 OK response with a JWT token in the token field

{
"token": "Bearer <JWT_TOKEN>"
}

## Run Docker

1- Docker:

- You need to have Docker installed on your machine. If you don't have Docker yet, you can get it https://docs.docker.com/get-docker/

2- Docker Compose:

- This is a tool for defining and running multi-container Docker applications. For instructions on how to install it, follow the official documentation https://docs.docker.com/compose/.

Lets setup the project now :

3- Clone the repository:

    git clone https://github.com/CyxMouz/doc_api

    cd doc_api

4- Build and start the Docker containers:

- This step will create two containers, one for the app and another for the MongoDB database.

  docker-compose up --build

- Note: The first time you run this command, Docker will download the necessary images which might take some time, depending on your internet connection.

5- After the build is completed

- your application should be running and accessible at:

      http://localhost:3000

- MongoDB is also exposed and can be accessed at:

      mongodb://localhost:27017

## Database Schema

- Category Schema (category.js):

This schema defines a category with a name (required and unique) and an optional description.

It uses Mongoose timestamps to automatically add createdAt and updatedAt fields.

The design choice here is to captures basic category information.

- Product schema (product.js):

This schema defines a product with fields for name, category (a reference to the Category model), price, availability, description, quantity, imageList, imageUrl, promo_rate, dated_promo, datef_promo, promo_price, totalReviews, totalStars, avg_stars, and reviews (an array of references to Review model).It also uses timestamps.

The design choice is extensive, covering various product details such as pricing, availability, images as main product image and list of product images, and promotional information.
It also maintains statistics like total reviews and average rating.

The use of references for categories and reviews establishes relationships between models. So only customers who bought a products are allowed rate it.

- Purchase Schema (purchase.js):

The purchase schema defines a purchase with fields for user (a reference to the User model), product (a reference to the Product model), quantity, totalPrice, purchaseDate, and cardNumber.
It uses timestamps.

The design choice captures information related to purchases, including the user, product, quantity, and payment details. It also records the purchase date.

- Review Schema (review.js):

The review schema defines a review with fields for user (a reference to the User model), product (a reference to the Product model), stars, and comment.
It uses timestamps.

The design choice allows users to provide reviews for products, including a star rating and optional comments.

- User Schema (user.js):

The user schema defines a user with fields for username, email, password, role (admin or customer), gender, purchaseHistory (an array of references to Purchase model), and addresses.
It also uses timestamps.

The schema defines methods for comparing passwords (using bcrypt) and pre-saving middleware for hashing passwords before saving.

The design choice captures user information, including authentication credentials, roles, and purchase history. It also allows users to have multiple addresses.

## Utility

#### Seeds

#### 1- generateRandomProduct()

- using faker library in dev mode you can :

1- Create new Category with random name

2- Create random Product with created category, random name, random price, random availabilitty

##

### 🌟 Thank You! Hope u Like IT ! :D

- If you have any feedback, please don't hesitate to let us know ^^. i'm always looking to improve.

#### Stay curious and happy coding! 🚀

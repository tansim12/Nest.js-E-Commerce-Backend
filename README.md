# E-Commerce Application

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Project Description

The **E-Commerce** Application is a robust and scalable platform designed to provide a complete online shopping experience for users, vendors, and administrators. This project focuses on:

- Enabling users to browse and purchase products seamlessly.
- Providing vendors with tools to manage their shops and inventories.
- Equipping administrators with advanced monitoring and control capabilities.

The system is built using **Nest.js**, a progressive framework for building efficient and scalable server-side applications, and integrates cutting-edge web development technologies for performance and maintainability.

---

## Live Demo / URL

Access the live application at:
[Live URL](https://nest-e-commerce-backend.vercel.app/)

---

## Technology Stack

This project leverages a modern technology stack:

### Backend:
- **Nest.js**: Framework for scalable server-side applications.
- **TypeScript**: Strongly typed programming language that improves code quality.
- **Node.js**: JavaScript runtime for building the server-side application.
- **Prisma ORM**: Object-Relational Mapper for PostgreSQL database interaction.
- **PostgreSQL**: Relational database for structured data storage.
- **JWT Authentication**: Secure user authentication and authorization.
- **Aamarpay Integration**: For payment processing.

### Frontend (Optional integration):
- **React.js / Next.js**: For building a responsive and interactive front end.

---

## Features

- **Role-based System**: Supports users, vendors, and administrators.
- **CRUD Operations**: Manage products, users, and orders seamlessly.
- **Payment Integration**: Aamarpay and SSL Commerz payment gateways.
- **Cloudinary Integration**: For image storage and management.
- **Environment Variables**: Secure and customizable application configuration.
- **Scalability**: Designed to handle a high volume of traffic and data.

---

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tansim12/Nest.js-E-Commerce-Backend.git
   cd Nest.js-E-Commerce-Backend

# ⚙️ Configure Environment Variables
## Create a `.env` file in the root of the project and add the following environment variables:

```bash

NODE_ENV=
BASE_URL=
FRONTEND_URL=
DB_NAME=
DATABASE_URL=
PORT=5000
BCRYPT_NUMBER=12
SECRET_ACCESS_TOKEN=
SECRET_REFRESH_TOKEN=
SECRET_ACCESS_TOKEN_TIME=10d
SECRET_REFRESH_TOKEN_TIME=365d
AAMAR_PAY_SEARCH_TNX_BASE_URL=
AAMAR_PAY_STORE_ID=aamarpaytest,
AAMAR_PAY_SIGNATURE_KEY= 
AAMAR_PAY_HIT_API= https://sandbox.aamarpay.com/jsonpost.php
EMAIL_APP_PASSWORD=


DATABASE_URL=
NODE_ENV="development"
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

JWT_SECRET=
EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
RESET_PASS_TOKEN="YOUR TOKEN SECRET"
RESET_PASS_TOKEN_EXPIRES_IN=
RESET_PASS_LINK="http://localhost:5000/forget-password/"
EMAIL= "your email"
APP_PASS= 
STORE_ID="SSL STORE ID"
STORE_PASS= "SSL STORE PASSWORD"
FRONTEND_URL="http://localhost:3000"
SUCCESS_URL= "http://localhost:3000/success"
CANCEL_URL= "http://localhost:3000/cancel"
FAIL_URL= "http://localhost:3000/fail"
SSL_PAYMENT_API= "PAYMENT API"
SSL_VALIDATIOIN_API= "PAYMENT VALIDATION API"

BASE_URL=deployed_backend_live_link
FRONTEND_URL=deployed_client_live_link

AAMAR_PAY_SEARCH_TNX_BASE_URL=https://sandbox.aamarpay.com/api/v1/trxcheck/request.php
AAMAR_PAY_STORE_ID=aamarpaytest
AAMAR_PAY_SIGNATURE_KEY=
AAMAR_PAY_HIT_API=https://sandbox.aamarpay.com/jsonpost.php



```

Jewellery E-Commerce Store

A full-stack jewellery e-commerce application built with Next.js, MongoDB, and Mongoose. The project was developed as a practical full-stack learning project, with a focus on understanding authentication, REST APIs, database operations, cart management, order processing, and admin authorization.

🚀 Features

Customer Features

User registration and login

JWT-based authentication using HTTP-only cookies

Browse jewellery products

Product detail pages

Add products to cart

Update cart quantities

Remove products from cart

Checkout with shipping information

Place orders

View personal order history

Stock validation and automatic stock updates

Admin Features

Protected admin dashboard

Admin-only product management

Create products

Edit products

Delete products

View customer orders

Manage order status

Role-based authorization

Backend Features

REST API routes using Next.js App Router

MongoDB database with Mongoose

Secure password hashing with bcrypt

JWT authentication

HTTP-only authentication cookies

Server-side price and order-total calculation

Product stock validation

User-specific carts

Order price/name snapshots

Protected admin API routes

Proper 401 and 403 authorization responses

🛠️ Tech Stack

Frontend

Next.js

React

JavaScript

Tailwind CSS

Backend

Next.js API Routes

Node.js

MongoDB

Mongoose

Authentication & Security

JSON Web Tokens (JWT)

HTTP-only cookies

bcryptjs

Role-based authorization

Deployment

Vercel

MongoDB Atlas

📁 Project Structure

project-root/
├── app/
│   ├── admin/
│   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── products/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   ├── orders/
│   ├── products/
│   ├── register/
│   └── shop/
├── lib/
│   ├── auth.js
│   └── mongodb.js
├── models/
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── public/
├── .env.local
├── package.json
└── README.md

The exact folder structure may vary slightly depending on the current implementation.

⚙️ Getting Started

1. Clone the repository

git clone https://github.com/talhamalik25/Jewellery-store
cd Jewellery Store

2. Install dependencies

npm install

3. Configure environment variables

Create .env.local and add:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. Start the development server

npm run dev

Open:

http://localhost:3000

🔑 Authentication Flow

The application uses JWT-based authentication.

User registers an account.

Password is securely hashed using bcrypt.

User logs in with email and password.

Server verifies the credentials.

Server creates a signed JWT.

JWT is stored in an HTTP-only cookie.

The browser automatically sends the cookie with protected requests.

Server verifies the JWT and identifies the authenticated user.

The password/hash is never returned to the client.

🛒 Cart Flow

The cart belongs to the authenticated user.

Login
  ↓
Add Product
  ↓
Cart API
  ↓
MongoDB Cart
  ↓
Update / Remove Items
  ↓
Checkout

The server does not trust a client-provided userId. The authenticated user is identified from the verified JWT.

📦 Order Flow

Products
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Server validates stock
   ↓
Server calculates total
   ↓
Order created
   ↓
Product stock reduced
   ↓
Cart cleared

Order items store important product information such as the product name and price at the time of purchase. This keeps historical orders accurate even if the product price changes later.

🔌 API Routes

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Products

GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

Product creation, editing, and deletion require admin authorization.

Cart

GET    /api/cart
POST   /api/cart
PATCH  /api/cart/:productId
DELETE /api/cart/:productId

Orders

POST /api/orders
GET  /api/orders

Order management is protected by authentication.

👨‍💼 Admin Authorization

The application uses role-based authorization.

Available roles:

customer
admin

A normal customer can use customer-facing features, while admin-only operations such as creating, updating, and deleting products require the authenticated user's role to be admin.

The role is determined from the authenticated server-side user and is never trusted from the request body.

🧪 Main User Flow

The complete customer flow is:

Register
   ↓
Login
   ↓
Browse Products
   ↓
Product Details
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Place Order
   ↓
Order Created
   ↓
Stock Updated
   ↓
Cart Cleared
   ↓
View Orders

🚀 Deployment

The project uses Next.js API routes, so the frontend and backend are deployed together.

Next.js
   ↓
Vercel
   ├── Frontend
   └── API Routes / Backend
          ↓
     MongoDB Atlas

Vercel Environment Variables

Add these variables to the Vercel project:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Then deploy the project through Vercel.

🔒 Security Notes

Passwords are hashed with bcrypt.

JWT is stored in an HTTP-only cookie.

Server validates authentication for protected routes.

Admin APIs require admin authorization.

Product prices are taken from the database rather than trusted from the client.

Order totals are calculated on the server.

Product stock is validated before placing an order.

Sensitive environment variables are kept server-side.

📌 Future Improvements

Payment gateway integration

Product image storage/CDN

Search and advanced filtering

Product reviews and ratings

Wishlist

Better admin analytics

Email notifications

Order cancellation/refund workflow

Improved inventory management

Production-level error logging

Automated testing

🎯 Project Purpose

This project was built not only as an e-commerce application but also as a practical full-stack learning project.

The main learning goals were:

Understanding Next.js full-stack architecture

Building REST APIs

Working with MongoDB and Mongoose

Implementing authentication

Understanding JWT and cookies

Implementing authorization

Building cart and order systems

Protecting server-side business logic

Connecting frontend and backend

Preparing a full-stack application for production deployment
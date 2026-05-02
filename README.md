<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/palash2397/Car-trading/main/assets/logo.png" alt="Car Trading Platform Logo" width="200" />
</p>

<h1 align="center">Car Trading Platform</h1>

## Description

A comprehensive car trading platform built with NestJS, featuring user authentication, vehicle listings, bidding systems, chat functionality, mechanic inspections, and shipping management. This platform connects buyers and sellers with a complete end-to-end car trading experience.

## Features

- **User Management**: Role-based authentication (User, Admin, Seller, Mechanic, Tower)
- **Vehicle Listings**: Create, manage, and browse car listings with detailed information
- **Bidding System**: Competitive bidding with offer management and notifications
- **Real-time Chat**: WebSocket-based messaging between users
- **Mechanic Inspections**: Professional vehicle inspection services with detailed reports
- **Shipping Management**: Complete shipping workflow with tracking and status updates
- **Reserve Requests**: Vehicle reservation system with time-based holds
- **Tower Management**: Tower role for platform administration

## Technology Stack

- **Backend**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **Real-time**: WebSocket for chat functionality
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer

## Project Structure

```
src/
├── modules/
│   ├── auth/                 # Authentication & authorization
│   ├── user/                 # User management
│   ├── seller-listing/       # Vehicle listings
│   ├── bid-offer/           # Bidding system
│   ├── chat/                # Real-time messaging
│   ├── mechanic-inspection/  # Vehicle inspections
│   ├── shipping-request/    # Shipping management
│   ├── reserve-request/     # Vehicle reservations
│   ├── seller-request/      # Seller requests
│   └── tower/               # Tower management
├── common/
│   ├── enums/               # Shared enums
│   ├── guards/              # Authentication guards
│   └── decorators/          # Custom decorators
├── utils/
│   └── helpers/             # Utility functions
└── app.module.ts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm 

### Installation

```bash
# Clone the repository
git clone https://github.com/palash2397/Car-trading.git
cd Car-trading

# Install dependencies
$ npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# Application
PORT=
BASE_URL=
```

### Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run build
$ npm run start:prod

```

## API Documentation

Once the application is running, visit:
- **Swagger UI**: `https://api.salousi.com/api/v1/docs#/`
- **API Documentation**: Interactive API explorer with all endpoints




## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

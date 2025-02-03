# AppliSense

AppliSense is a simple yet powerful application app built using the MERN stack (MongoDB, Express, React, Node.js). With AppliSense, users can create applications with a company, roles and progress tracking, and see statistics.

## Features

- **User Registration & Authentication**: Secure authentication system using JWT tokens.
- **Create Applications**: Create applications with a title, date, and time.
- **Email Notifications**: Receive application notifications via email at the specified date and time.
- **Manage Applications**: Edit or delete existing applications.

## Technology Stack

- **Frontend**: React.js,
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ahmad-masud/AppliSense.git
   cd AppliSense
   ```

2. **Backend Setup:**

   - Navigate to the server folder:

     ```bash
     cd server
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Create a `.env` file in the `server` directory with the following variables:

     ```env
     PORT=4000
     MONGODB_URI=<your_mongodb_uri>
     TOKEN_SECRET=<your_jwt_secret>
     ```

   - Start the backend server:

     ```bash
     npm start
     ```

3. **Frontend Setup:**

   - Navigate to the client folder:

     ```bash
     cd ../client
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the frontend development server:

     ```bash
     npm start
     ```

### Usage

1. Register or log in to the application.
2. Create a new application by providing a title, date, and time.
3. At the specified time, receive an email notification with your application details.

## API Endpoints

### Authentication

- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: Login an existing user
- **DELETE /api/users/delete**: Delete an existing user
- **PUT /api/users/update**: Update an existing user
- **PUT /api/users/changePassword**: Change the password of an existing user

### Applications

- **GET /api/applications**: Get all applications for the logged-in user
- **GET /api/applications/:id**: Get a application for the logged-in user
- **POST /api/applications/create**: Create a new application
- **PATCH /api/applications/:id**: Update an existing application
- **DELETE /api/applications/delete/:id**: Delete a application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

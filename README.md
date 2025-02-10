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
2. **Install Dependencies**

   - Install Dependencies for Frontend and Backend
  
     ```bash
     npm run install-dependencies
     ```

4. **Backend Setup:**

   - Navigate to the server folder:
     
   - Create a `.env` file in the `server` directory with the following variables:

     ```env
     MONGODB_URI=<your_mongodb_uri>
     TOKEN_SECRET=<your_jwt_secret>
     EMAIL_USER=<your_OTP_email>
     EMAIL_PASS=<your_OTP_password>
     IS_LOCAL=<bool>
     ```

5. **Frontend Setup:**

   - Navigate to the client folder:
  
   - Create a `.env` file in the `server` directory with the following variables:

     ```env
     REACT_APP_API_BASE_URL=<your_backend_server>
     ```

6. **Start Frontend and Backend**

   - Start the client and server concurrently
  
     ```bash
     npm start
     ```

### Usage

1. Register or log in to the application.
2. Create a new application by providing a title, date, and time.
3. At the specified time, receive an email notification with your application details.

## API Endpoints

### Authentication

- **POST /users/register**: Register a new user
- **POST /users/login**: Login an existing user
- **DELETE /users/delete**: Delete an existing user
- **PUT /users/update**: Update an existing user
- **PUT /users/changePassword**: Change the password of an existing user

### Applications

- **GET /applications**: Get all applications for the logged-in user
- **GET /applications/:id**: Get a application for the logged-in user
- **POST /applications/create**: Create a new application
- **PATCH /applications/:id**: Update an existing application
- **DELETE /applications/delete/:id**: Delete a application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

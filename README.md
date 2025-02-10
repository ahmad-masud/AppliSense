# AppliSense

AppliSense is a powerful application tracker built using the **MERN stack** (MongoDB, Express, React, Node.js). It helps users track job applications, manage progress, and view insightful statistics.

## Features

- **User Authentication**: Secure JWT-based authentication.
- **Application Tracking**: Track applications with company names, job roles, and statuses.
- **Dashboard & Statistics**: Visualize application trends with pie charts.
- **CRUD Operations**: Create, update, and delete applications easily.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **MongoDB** (Local instance or MongoDB Atlas)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ahmad-masud/AppliSense.git
   cd AppliSense
   ```

2. **Install Dependencies**:

   ```bash
   npm run install-dependencies
   ```

3. **Backend Setup**:

   - Navigate to the `server` directory.
   - Create a `.env` file and add the following:

     ```env
     MONGODB_URI=<your_mongodb_uri>
     TOKEN_SECRET=<your_jwt_secret>
     EMAIL_USER=<your_email>
     EMAIL_PASS=<your_email_password>
     IS_LOCAL=<true/false>
     ```

4. **Frontend Setup**:

   - Navigate to the `client` directory.
   - Create a `.env` file with:

     ```env
     REACT_APP_API_BASE_URL=<your_backend_url>
     ```

5. **Start the Application**:

   - Run both frontend and backend:

     ```bash
     npm start
     ```

---

## Usage

1. **Sign up or log in** to access the dashboard.
2. **Add new applications**, specifying the company, role, status, and applied date.
3. **View statistics** about your applications using interactive charts.

---

## API Endpoints

### **Authentication**  
| Method | Endpoint | Description |  
|--------|----------|-------------|  
| **POST** | `/users/register` | Register a new user |  
| **POST** | `/users/login` | Login an existing user |  
| **POST** | `/users/loginWithOTP` | Login using OTP |  
| **DELETE** | `/users/delete` | Delete a user account |  
| **PUT** | `/users/update` | Update user details |  
| **PUT** | `/users/changePassword` | Change user password |  
| **POST** | `/users/sendCode` | Send OTP code to user |  
| **POST** | `/users/verifyCode` | Verify OTP code |  

### **Applications API**
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/applications/` | Retrieve all applications for the logged-in user |
| **GET** | `/applications/stats` | Fetch application statistics |
| **GET** | `/applications/:id` | Retrieve a specific application |
| **POST** | `/applications/create` | Create a new application |
| **POST** | `/applications/createMultiple` | Create multiple applications at once |
| **DELETE** | `/applications/deleteMultiple` | Delete multiple applications |
| **DELETE** | `/applications/delete/:id` | Delete a specific application |
| **PATCH** | `/applications/update/:id` | Update an application |

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

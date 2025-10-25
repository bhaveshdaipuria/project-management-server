# Project Management Backend

A NestJS-based backend API for a project management system with user authentication, project management, and task management features.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/project-management
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

3. **Database Setup**
   Ensure MongoDB is running on your system:
   ```bash
   # Start MongoDB (if not already running)
   sudo systemctl start mongod
   # OR
   mongod
   ```

4. **Run Database Seeder**
   ```bash
   npm run seed
   ```
   This will create test users and sample data for development.

5. **Start Development Server**
   ```bash
   npm run start:dev
   ```
   The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Projects (Protected Routes)
- `GET /projects` - Get all projects for authenticated user
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks (Protected Routes)
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Project Management**: CRUD operations for projects with user ownership
- **Task Management**: CRUD operations for tasks linked to projects
- **Data Validation**: Request validation using DTOs and class-validator
- **Database Integration**: MongoDB with Mongoose ODM
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## Database Schema

### User Schema
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `name`: String (required)
- `createdAt`: Date
- `updatedAt`: Date

### Project Schema
- `title`: String (required)
- `description`: String (required)
- `status`: String (enum: 'active', 'completed', default: 'active')
- `userId`: ObjectId (required, references User)
- `createdAt`: Date
- `updatedAt`: Date

### Task Schema
- `title`: String (required)
- `description`: String (required)
- `status`: String (enum: 'todo', 'in-progress', 'done', default: 'todo')
- `dueDate`: Date (optional)
- `projectId`: ObjectId (required, references Project)
- `userId`: ObjectId (required, references User)
- `createdAt`: Date
- `updatedAt`: Date

## Development

### Available Scripts
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run seed` - Run database seeder

## Known Limitations

- No email verification for user registration
- No password reset functionality
- No file upload support for project attachments
- No real-time notifications
- No role-based access control (all users have same permissions)
- No data pagination for large datasets (basic pagination implemented)
- No search functionality across projects and tasks
- No project collaboration features
- No task assignment to specific users
- No task priority levels
- No project templates or cloning

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- CORS is configured for specific origins
- Input validation on all endpoints
- No sensitive data in error responses

## Testing

Test credentials (created by seeder):
- Email: `test@example.com`
- Password: `Test@123`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **JWT Authentication Issues**
   - Verify JWT_SECRET in .env file
   - Check token expiration (24 hours)

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on port 3001

4. **Database Seeder Fails**
   - Ensure MongoDB is running
   - Check database connection
   - Run `npm run seed` again

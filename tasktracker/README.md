# TaskFlow - Smart Task Tracker with Authentication

A comprehensive task management web application built with React.js, Next.js, and Node.js. Features a responsive UI, interactive charts, smart suggestions, JWT authentication, and real-time updates.

## Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Protected Routes**: Client and server-side route protection
- **Session Management**: Persistent login with localStorage
- **Form Validation**: Client and server-side input validation

### 🎯 Core Functionality
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**: Set priorities, due dates, and descriptions
- **Status Tracking**: Mark tasks as pending or completed
- **Real-time Updates**: Instant UI updates with optimistic updates

### 📊 Analytics & Insights
- **Dashboard**: Overview of total, completed, pending, and overdue tasks
- **Charts**: Weekly activity charts using Recharts
- **Productivity Trends**: Line charts showing completion rates
- **Statistics**: Comprehensive task statistics and metrics

### 🤖 Smart Features
- **Task Suggestions**: AI-powered recommendations for task prioritization
- **Overdue Alerts**: Automatic detection and alerts for overdue tasks
- **Workload Management**: Suggestions for redistributing tasks
- **Motivational Messages**: Encouraging feedback for consistent users

### 🔍 Advanced Filtering
- **Search**: Full-text search across task titles and descriptions
- **Filters**: Filter by status, priority, and date ranges
- **Sorting**: Sort by due date, priority, or creation date
- **Quick Actions**: Batch operations and quick task updates

### 📱 User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Dark Mode Support**: Built-in dark mode compatibility
- **Accessibility**: WCAG compliant with proper ARIA labels

## Tech Stack

### Frontend
- **React.js 19** - Modern React with hooks and concurrent features
- **Next.js 14** - App Router, Server Components, and API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive charts and data visualization
- **shadcn/ui** - High-quality UI components

### Backend & Authentication
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework (via Next.js API routes)
- **JWT (Jose)** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **REST API** - RESTful API endpoints with authentication
- **Middleware** - Route protection and token validation

### Database
- **In-Memory Storage** - Demo data storage (easily replaceable with MongoDB)
- **MongoDB Ready** - Structured for easy MongoDB integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone or Download the Project**
   \`\`\`bash
   # If using Git
   git clone <repository-url>
   cd task-tracker
   
   # Or download and extract the ZIP file
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Variables (Optional)**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   \`\`\`
   
   > **Note**: The app will work without this file using a default secret, but it's recommended to set your own for production.

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Login with Demo Account**
   - **Email**: `demo@example.com`
   - **Password**: `password123`
   
   Or create a new account using the signup form.

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Authentication System

### Login Process
1. Navigate to `/auth` (automatic redirect if not logged in)
2. Enter email and password
3. JWT token is generated and stored in localStorage
4. User is redirected to dashboard

### API Authentication
All task and stats API endpoints require authentication:
- Include `Authorization: Bearer <token>` header
- Middleware validates JWT tokens
- Invalid tokens return 401 Unauthorized

### Protected Routes
- All main pages require authentication
- Automatic redirect to login page if not authenticated
- Token validation on page load

## Project Structure

\`\`\`
task-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── login/     # POST /api/auth/login
│   │   │   ├── signup/    # POST /api/auth/signup
│   │   │   └── verify/    # POST /api/auth/verify
│   │   ├── tasks/         # Task CRUD endpoints (protected)
│   │   └── stats/         # Statistics endpoint (protected)
│   ├── auth/              # Authentication page
│   ├── tasks/             # Task pages (protected)
│   ├── summary/           # Summary page (protected)
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page (protected)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── login-form.tsx    # Login form component
│   ├── signup-form.tsx   # Signup form component
│   ├── protected-route.tsx # Route protection wrapper
│   ├── dashboard.tsx     # Main dashboard
│   ├── task-card.tsx     # Individual task component
│   ├── task-form.tsx     # Task creation/editing form
│   ├── task-list.tsx     # Task list with filters
│   ├── weekly-chart.tsx  # Chart components
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   └── use-tasks.ts      # Task management hook
├── lib/                  # Utility functions
│   ├── auth.ts           # JWT utilities
│   ├── user-store.ts     # User data management
│   ├── types.ts          # TypeScript type definitions
│   ├── task-store.ts     # In-memory data store
│   └── utils.ts          # Helper functions
├── middleware.ts         # API route protection
└── README.md
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify` - Token verification

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Statistics (Protected)
- `GET /api/stats` - Get task statistics, weekly data, and suggestions

## Usage Guide

### Getting Started
1. **Create Account**: Sign up with email and password
2. **Login**: Use your credentials or the demo account
3. **Dashboard**: View your task overview and statistics

### Creating Tasks
1. Navigate to the "Add Task" page or click "New Task"
2. Fill in the task details:
   - **Title** (required): Brief description of the task
   - **Description** (optional): Detailed information
   - **Priority**: Low, Medium, or High
   - **Due Date** (required): When the task should be completed
3. Click "Create Task" to save

### Managing Tasks
- **Complete Tasks**: Check the checkbox next to any task
- **Edit Tasks**: Click the menu (⋮) and select "Edit"
- **Delete Tasks**: Click the menu (⋮) and select "Delete"
- **Filter Tasks**: Use the search bar and filter dropdowns
- **Sort Tasks**: Choose sorting options (due date, priority, created date)

### Dashboard Features
- **Statistics Cards**: View total, completed, pending, and overdue tasks
- **Weekly Chart**: See tasks completed each day of the week
- **Productivity Trend**: Track your completion rate over time
- **Smart Suggestions**: Get AI-powered recommendations

### Summary Page
- **Weekly Overview**: Comprehensive productivity insights
- **Motivational Messages**: Encouraging feedback based on performance
- **Completion Rates**: Visual progress indicators
- **Achievement Tracking**: Monitor your productivity trends

## Customization

### Database Integration
To replace the in-memory storage with MongoDB:

1. **Install MongoDB Driver**:
   \`\`\`bash
   npm install mongodb
   \`\`\`

2. **Update Environment Variables**:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your-super-secret-jwt-key
   \`\`\`

3. **Create Database Connection**:
   \`\`\`typescript
   // lib/db.ts
   import { MongoClient } from 'mongodb'
   
   const client = new MongoClient(process.env.MONGODB_URI!)
   export const db = client.db('taskflow')
   export const users = db.collection('users')
   export const tasks = db.collection('tasks')
   \`\`\`

4. **Update Stores**: Replace `user-store.ts` and `task-store.ts` with MongoDB operations

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Features
- Add new task fields by updating the `Task` interface in `lib/types.ts`
- Create new API endpoints in the `app/api/` directory
- Add new pages in the `app/` directory

## Security Considerations

### Production Deployment
1. **Set Strong JWT Secret**: Use a cryptographically secure random string
2. **HTTPS Only**: Always use HTTPS in production
3. **Environment Variables**: Never commit secrets to version control
4. **Token Expiration**: Consider shorter token lifespans for sensitive applications
5. **Rate Limiting**: Implement rate limiting for authentication endpoints

### Best Practices
- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- Client-side and server-side input validation
- Protected API routes with middleware
- Secure token storage in localStorage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the repository or contact the development team.

---

**TaskFlow** - Secure, smart task management for enhanced productivity! 🚀🔐

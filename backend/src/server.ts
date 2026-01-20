import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import cookieParser from 'cookie-parser';

   import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

   import taskRoutes from './routes/task.routes';

import { errorHandler, notFoundHandler } from './middleware/error.middleware';

   // Load environment variables
      dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security middleware
  app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

     // Body parsing middleware
app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

     // Health check endpoint

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  }
);
}
);

// API routes

app.use('/api/auth', authRoutes);
 app.use('/api/tasks', taskRoutes);

   // 404 handler

app.use(notFoundHandler);

    // Global error handler (must be last)

app.use(errorHandler);

    // Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

});

export default app;

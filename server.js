import express, { urlencoded } from "express";
import dotenv from "dotenv";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import emailVerification from "./routes/emailVerification.js"
import userRoute from './routes/user.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import chatRoute from './routes/chat.routes.js';
import knowledgeRoute from './routes/knowledge.routes.js';

import notificationRoutes from "./routes/notificationRoutes.js";
import supportRoutes from './routes/supportRoutes.js';
import personalTaskRoutes from './routes/personalTaskRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import imageRoutes from './routes/image.routes.js';
import videoRoutes from './routes/videoRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import { startPlanExpiryService } from './services/planExpiryService.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB().then(async () => {
  console.log("Database connection attempt finished, initializing services...");
  try {
    const { initializeFromDB } = await import('./services/ai.service.js');
    await initializeFromDB();
    console.log("✅ AI Services (Embeddings & Vector Store) pre-initialized.");
    startPlanExpiryService();
    console.log('✅ Plan Expiry Service started.');
  } catch (err) {
    console.error("❌ Failed to pre-initialize AI services:", err.message);
  }
}).catch(error => {
  console.error("Database connection failed during startup:", error);
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-fingerprint'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ---------------- ROOT ROUTE ADDED ----------------
app.get("/", (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>AISA24</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            flex-direction: column;
          }
          h1 { font-size: 40px; margin-bottom: 10px; }
          p { font-size: 18px; opacity: 0.8; }
        </style>
      </head>
      <body>
        <h1>🚀 AISA24 Backend is Live</h1>
        <p>Secure connection established successfully 🔒</p>
      </body>
    </html>
  `);
});
// --------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.send("All working")
});

// Debug Middleware
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth/verify-email', emailVerification);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/chat', chatRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/personal-assistant', personalTaskRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/aibase/chat', chatRoute);
app.use('/api/aibase/knowledge', knowledgeRoute);

// 404 Handler
app.use((req, res) => {
  console.warn(`[404 NOT MATCHED] ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AISA Backend running on http://0.0.0.0:${PORT}`);
});

setInterval(() => { }, 1000 * 60 * 60);
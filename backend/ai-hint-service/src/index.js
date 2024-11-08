import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from '../dist/routes/hintRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health Check
app.get('/health', (req, res) => {
  res.send('AI Hint Service is up and running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`AI Hint Service is listening on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hintRoutes from '../dist/routes/hintRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai-hint', hintRoutes);

// Health Check
app.get('/api/ai-hint/health', (req, res) => {
  res.status(200).send({ status: 'AI Hint Service is running.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`AI Hint Service is running on port ${PORT}`);
});

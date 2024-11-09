// backend/ai-hint-service/src/routes/hintRoutes.ts

import express from 'express';
import { getHint, getComplexityAnalysis, getModelAnswer } from '../controllers/hintControllers.js';

const router = express.Router();

// GET /api/ai-hint/hint/:questionId
router.get('/hint/:questionId', getHint);

// POST /api/ai-hint/complexity
router.post('/complexity', getComplexityAnalysis);

// GET /api/ai-hint/model-answer/:questionId
router.get('/model-answer/:questionId', getModelAnswer);

export default router;

import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import questionRoutes from './routes/questionRoutes';

// Initialize the app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/peerprep', {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

// Routes
app.use('/api/questions', questionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

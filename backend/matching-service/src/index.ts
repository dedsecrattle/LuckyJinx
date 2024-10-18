import express from 'express';
import bodyParser from 'body-parser';
import { initQueue } from './queue';
import { checkMatchingStatus, startMatching, cancelMatching } from './matchingService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/match/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await checkMatchingStatus(userId);
    res.json(result);
});

app.post('/match', async (req, res) => {
    const { userId, topic, difficulty } = req.body;

    // Send the matching request to the queue
    const result = await startMatching(userId, topic, difficulty);
    res.json(result);
});

app.delete('/match/:userId', async (req, res) => {
    const { userId } = req.params;

    const success = await cancelMatching(userId);
    if (success) {
        res.json({ message: `Successfully canceled matching for user ${userId}` });
    } else {
        res.status(404).json({ message: `Matching request for user ${userId} not found` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    initQueue();
});

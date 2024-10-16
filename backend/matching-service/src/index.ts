import express from 'express';
import bodyParser from 'body-parser';
import { initQueue } from './queue';
import { startMatching } from './matchingService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/match', async (req, res) => {
    const { userId, topic, difficulty } = req.body;

    // Send the matching request to the queue
    const result = await startMatching(userId, topic, difficulty);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    initQueue();
});

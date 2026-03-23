import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import conversationRoutes from './routes/conversationRoutes';
import executionRoutes from './routes/executionRoutes';
import userRoutes from './routes/userRoutes';
import algoRoutes from './routes/algoRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/problems', problemRoutes);
app.use('/conversations', conversationRoutes);
app.use('/execute', executionRoutes);
app.use('/algo', algoRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'ThinkDSA API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

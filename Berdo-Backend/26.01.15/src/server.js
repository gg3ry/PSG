import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';

import swipeRoutes from './routes/swipe.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

export const pool = createPool({
    host: '',
    user: '',
    password: '',
    database: 'tinder_app_db',
    port: 5070
});

app.use('/', swipeRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`${port}on fut`);
});
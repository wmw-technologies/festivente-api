import express from 'express';
import http from 'http';
import cors from 'cors';
import dotnev from 'dotenv';
import serverless from 'serverless-http';
import getSupabase from './config/database';
import AuthRoutes from './routes/Auth.routes';

dotnev.config();

const supabase = getSupabase();
const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', router);

router.use('/auth', AuthRoutes);

router.get('/', async (_, res) => {
    const { data, error } = await supabase.from('countries').select();
    res.json({ message: 'Hello World!', data });
});

export const handler = serverless(app);

// const server = http.createServer(app);
// const PORT = +(process.env.PORT || 3000);
// const HOST_NAME = process.env.HOST_NAME || 'localhost';

// server.listen(PORT, HOST_NAME, () => {
//     console.log(`Server listening on port http://${HOST_NAME}:${PORT}`);
// });

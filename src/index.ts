import express from 'express';
import http from 'http';
import cors from 'cors';
import dotnev from 'dotenv';
import AuthRoutes from './routes/Auth.routes';

dotnev.config();

const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', router);

router.use('/auth', AuthRoutes);

app.get('/', async (_, res) => {
    res.json({ message: 'Festivente!' });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
	console.log(`Server listening on port http://localhost:${PORT}`);
});

export default app;
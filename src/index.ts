import express from 'express';
import http from 'http';
import cors from 'cors';
import AuthRoutes from './routes/Auth.routes';
import UserRoutes from './routes/User.routes';

const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

app.get('/', async (_, res) => {
    res.json({ message: 'Festivente!' });
});

router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});

export default app;
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/database';
import { seedRoles } from './config/seed';
import AuthRoutes from './routes/Auth.routes';
import UserRoutes from './routes/User.routes';
import RoleRoutes from './routes/Role.routes';
import WarehouseRoutes from './routes/Warehouse.routes';
import rentalsRoutes from './routes/Rentals.routes';

connectDB().then(() => {
  // Seed data
  seedRoles();
});

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
router.use('/role', RoleRoutes);
router.use('/warehouse', WarehouseRoutes);
router.use('/rentals', rentalsRoutes);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

export default app;

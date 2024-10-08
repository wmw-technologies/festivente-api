import express from 'express';
import http from 'http';
import cors from 'cors';
import dotnev from 'dotenv';

const app = express();
// const router = express.Router();

dotnev.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use('/', router);

app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.json({ message: 'Hello World!' });
});

const server = http.createServer(app);
const PORT = +(process.env.PORT || 3000);
const HOST_NAME = process.env.HOST_NAME || 'localhost';

server.listen(PORT, HOST_NAME, () => {
    console.log(`Server listening on port ${HOST_NAME}:${PORT}`);
});

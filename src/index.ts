const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();

app.use(cors());

console.log("asdasdaa sdasdas dbuild asd asd ads ds")

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

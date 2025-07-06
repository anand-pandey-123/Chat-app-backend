const express = require('express');
const cors = require('cors')
const { connection } = require('./src/config/database');
const userRoutes = require('./src/routes/user')
const chatRoutes = require('./src/routes/chat');
const cookieParser = require('cookie-parser');
const http = require('http');
const initializeSocket = require('./src/utils/socket');
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);

const server = http.createServer(app);

initializeSocket(server);


connection()
.then(() => {
    server.listen(4000, () => {
    console.log(4000+" server is listening....")
})
})
.catch((err) => {
    console.log(err.message)
})
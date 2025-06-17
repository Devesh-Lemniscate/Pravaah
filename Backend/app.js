const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors'); // Enables Cross-Origin Resource Sharing (frontend & backend on different domains).
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const mapsRoutes = require('./routes/maps.routes');
const shortestPathRoutes = require('./routes/shortestPath.routes');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/maps', mapsRoutes);
app.use('/api', shortestPathRoutes);

module.exports = app;


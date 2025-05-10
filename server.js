const express = require('express');
const connectDB = require('./config/mongodb');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.use(express.json());
connectDB();
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
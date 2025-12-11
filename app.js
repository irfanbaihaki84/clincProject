const express = require('express');
// require('dotenv').config({ path: `${__dirname}/.env` });
require('dotenv').config({ path: `${process.cwd()}/.env` });

const app = express();

const PORT = process.env.APP_PORT || 4000;

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'REST API is working fine',
  });
});

// all routes will be here
const authRoute = require('./route/authRoute');
app.use('/api/v1/auth', authRoute);

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found',
  });
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});

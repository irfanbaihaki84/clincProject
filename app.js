const express = require('express');
// require('dotenv').config({ path: `${__dirname}/.env` });
require('dotenv').config({ path: `${process.cwd()}/.env` });

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'REST API is working fine',
  });
});

// all routes will be here
const authRoute = require('./route/authRoute');
const catchAsync = require('./utils/catchAsync');
app.use('/api/v1/auth', authRoute);

app.use(
  catchAsync(async (req, res, next) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  })
);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

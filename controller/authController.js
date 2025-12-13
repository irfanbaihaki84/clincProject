const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res, next) => {
  const body = req.body;

  if (!['1', '2'].includes(body.userType)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid userType. Must be "1" or "2".',
    });
  }

  const newUser = await user.create({
    nik: body.nik,
    email: body.email,
    userType: body.userType,
    userName: body.userName,
    password: body.password,
    confirmPassword: body.confirmPassword,
    status: 'active',
  });

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  if (!result) {
    return res.status(500).json({
      status: 'fail',
      message: 'User creation failed',
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: result,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email and password are required',
    });
  }

  const existingUser = await user.findOne({ where: { email } });
  if (!existingUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  const token = generateToken({ id: existingUser.id });

  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      token,
    },
  });
};

module.exports = { signup, login };

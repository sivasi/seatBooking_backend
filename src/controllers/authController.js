const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/db');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Registering..');

  try {
    const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Got user with email');
    if (userExists.rows.length > 0) {
      console.log('User already exist');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('User not exist and hashing password..');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    console.log('Password hashed and inserted data into DB and token is creating...');

    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('Token created and Sign Up successful');

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Logging user..');
  
    try {
      const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      
      console.log('Got user with email');
  
      if (user.rows.length === 0) {
        console.log('No user found');
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      console.log('User found and matching password');
  
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        console.log('Got user but password donot match');
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      console.log('creating token...');
  
      const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log('token created and login successful');

      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  module.exports = { registerUser, loginUser };
  
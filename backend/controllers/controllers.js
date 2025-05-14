const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  static async register(req, res) {
    const { FirstName, LastName, Email, PhoneNumber, Password, UserType, AccountBalance } = req.body;
    
    try {
      console.log('Register request:', req.body);
      if (!FirstName || !LastName || !Email || !PhoneNumber || !Password || !UserType) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);

      const [results] = await sequelize.query(
        `EXEC sp_RegisterUser @FirstName=:FirstName, @LastName=:LastName, @Email=:Email, 
         @PhoneNumber=:PhoneNumber, @Password=:Password, @UserType=:UserType, 
         @AccountBalance=:AccountBalance, @ErrorMessage=:ErrorMessage OUTPUT`,
        {
          replacements: {
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Password: hashedPassword,
            UserType,
            AccountBalance: AccountBalance || 0.00,
            ErrorMessage: ''
          },
          type: sequelize.QueryTypes.RAW
        }
      );

      const errorMessage = results[0].ErrorMessage;
      console.log('sp_RegisterUser response:', results, 'ErrorMessage:', errorMessage);

      if (errorMessage.includes('successfully')) {
        return res.status(201).json({ message: errorMessage });
      } else {
        return res.status(400).json({ error: errorMessage });
      }
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ error: 'Server error during registration' });
    }
  }

  static async login(req, res) {
    const { Email, Password } = req.body;

    try {
      console.log('Login request:', { Email });
      if (!Email || !Password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const [userResults] = await sequelize.query(
        `SELECT UserID, Password, UserType FROM User_Table WHERE Email = :Email`,
        {
          replacements: { Email },
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!userResults) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const { UserID, Password: storedPassword, UserType } = userResults;

      const isMatch = await bcrypt.compare(Password, storedPassword);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { UserID, UserType, Email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user: { UserID, UserType }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Server error during login' });
    }
  }
}

module.exports = UserController;
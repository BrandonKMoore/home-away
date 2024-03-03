const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { check } = require('express-validator');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email').exists({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
  check('username').exists({ checkFalsy: true }).withMessage('Username is required'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  check('firstName').exists({ checkFalsy: true }).withMessage('First Name is required'),
  check('lastName').exists({ checkFalsy: true }).withMessage('Last Name is required'),
  handleValidationErrors
]

router.post('/', validateSignup, async (req, res, next)=>{
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  try{
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  } catch (err){

    if(err.errors[0].path) {
      const currentError = err.errors[0].path
      err.message = `User already exists`,
      err.errors[currentError] =  `User with that ${err.errors[0].path} already exists`
    }
    next(err)
  }
});

module.exports = router;

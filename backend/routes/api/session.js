const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

const validateLogin = [
  check('credential').exists({checkFalsey: true}).notEmpty().withMessage('Email or username is required'),
  check('password').exists({checkFalsey: true}).notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next)=>{
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    return next(err)
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email:user.email,
    username: user.username
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});

router.delete('/', (_req, res) =>{
  res.clearCookie('token');
  return res.json({ message: 'success'})
});

router.get('/', (req, res) =>{
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstname: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };
    return res.json({
      user: safeUser
    });
  } else return res.json({user: null});
});

module.exports = router;

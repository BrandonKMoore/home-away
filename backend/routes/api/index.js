const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js')
const groupRouter = require('./group.js')
const venueRouter = require('./venue.js')

const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);
router.use('/session', sessionRouter)
router.use('/users', usersRouter)
router.use('/groups', groupRouter)
router.use('/venues', venueRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

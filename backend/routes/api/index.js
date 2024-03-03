const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js')
const groupRouter = require('./group.js')
const venueRouter = require('./venue.js')
const eventRouter = require('./event.js')

const { restoreUser, requireAuth, authenticationCheck } = require('../../utils/auth.js');
const { GroupImage, Group, Membership, EventImage, Event } = require('../../db/models')

router.use(restoreUser);
router.use('/session', sessionRouter)
router.use('/users', usersRouter)
router.use('/groups', groupRouter)
router.use('/venues', venueRouter)
router.use('/events', eventRouter)

router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

router.delete('/group-images/:imageId', requireAuth, async(req, res, next)=>{
  const imageId = req.params.imageId;

  const image = await GroupImage.findByPk(imageId, {
    include: [{model: Group, attributes: ['id', 'organizerId']}]
  })

  if(!image) {
    const err = new Error("Group Image couldn't be found")
    err.status = 404
    return next(err)
  }
  const isMember = await Membership.findOne({where: {groupId: image.Group.id, userId: req.user.id}})
  if(!authenticationCheck(req.user.id, image.Group.organizerId) && isMember.status !== 'co-host'){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  await image.destroy()

  res.json({message: "Successfully deleted"})
})

router.delete('/event-images/:imageId', requireAuth, async(req, res, next)=>{
  const imageId = req.params.imageId;

  const image = await EventImage.findByPk(imageId, {
    include: [{model: Event, attributes: ['id'], include: {model: Group, attributes: ['id', 'organizerId']}}]
  })

  if(!image) {
    const err = new Error("Event Image couldn't be found")
    err.status = 404
    return next(err)
  }

  const isMember = await Membership.findOne({where: {groupId: image.Event.Group.id, userId: req.user.id}})
  if(!authenticationCheck(req.user.id, image.Event.Group.organizerId) && isMember.status !== 'co-host'){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  await image.destroy()

  res.json({ message: "Successfully deleted" })
})


module.exports = router;

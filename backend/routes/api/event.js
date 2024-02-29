const express = require('express');
const {  requireAuth, authenticationCheck } = require('../../utils/auth');
const { Op } = require('sequelize');

const { Event, Group, Venue, User, EventImage, Membership, Attendance } = require('../../db/models');

const router = express.Router();

// Get all Events
router.get('/', async(req, res, next)=>{
  const allEvents = await Event.findAll({
    include: [
      {model: Group, attributes: ['id', 'name', 'city', 'state']},
      {model: Venue, attributes: ['id', 'city', 'state']}],
    attributes: {
      exclude: ['description']
    }
  })

  res.json({Events: allEvents})
})

// Get details of an Event specified by its id
router.get('/:eventId', async(req, res, next)=>{
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'private', 'city', 'state'],
      },
      {
        model: User,
        attributes: ['id'],
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: Venue,
        attributes: {
          exclude: ['groupId', 'createdAt', 'updatedAt']
        }
      },
    ],
  })

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const { id, groupId, venueId, name, description, type, capacity, price, startDate, endDate } = event
  const eventRes = { id, groupId, venueId, name, description, type, capacity, price, startDate, endDate }
  eventRes.numAttending = event.Users.length
  eventRes.Group = event.Group
  eventRes.Venue = event.Venue
  eventRes.EventImages = event.EventImages

  res.json(eventRes)
});

// Add an Image to an Event based on the Event's id
router.post('/:eventId/images', requireAuth, async(req, res, next)=>{
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Group,
        attributes: ['id', 'organizerId'],
      },
      {
        model: User,
        attributes: ['id'],
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: Venue,
        attributes: {
          exclude: ['groupId', 'createdAt', 'updatedAt']
        }
      },
    ],
  });

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id
    }
  })
  const attendee = await Attendance.findOne({
    where: {
      eventId: event.id,
      userId: req.user.id
    }
  })

  // Authorazation: Current User must be an attendee, host, or co-host of the event
  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !member && !attendee){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (member){
    if (member.status !== 'co-host'){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
    }
  } else if (attendee){
    if (attendee.status !== 'Going'){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
    }
  }

  const newEventImage = await event.createEventImage(req.body);
  const { id, url, preview } = newEventImage;
  res.json({
    id,
    url,
    preview
  })
});

// Edit an Event specified by its id
router.put('/:eventId', requireAuth, async(req, res, next)=>{

  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Group,
        attributes: ['organizerId']
      }
    ]
  })

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id
    }
  })

  //Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !member){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (member){
    if (member.status !== 'co-host'){
      const err = new Error("Forbidden")
      err.status = 403
      return next(err)
    }
  }

  if(!await Venue.findByPk(50)){
    err = new Error("Venue couldn't be found")
    err.status = 404
    return next(err)
  }

  for (let key in req.body){
    event[key] = req.body[key]
  }

  await event.save()

  const { id, groupId, venueId, name, type, capacity, price, description, startDate, endDate } = event
  const eventRes = { id, groupId, venueId, name, type, capacity, price, description, startDate, endDate }
res.json(eventRes)
});

router.delete('/:eventId', requireAuth, async(req, res, next)=>{
  const event = await Event.findByPk(req.params.eventId, {
    include: {model: Group, attributes: ['organizerId']}
  })

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

const member = await Membership.findOne({
  where: {
    groupId: event.groupId,
    userId: req.user.id
  }
})

  //Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !member){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (member){
    if (member.status !== 'co-host'){
      const err = new Error("Forbidden")
      err.status = 403
      return next(err)
    }
  }

  console.log('before', event.id)

  await Event.destroy({
    where: {
      id: event.id
    }
  })

  console.log('after', event.id)
  res.json({"message": "Successfully deleted"})
})

module.exports = router;

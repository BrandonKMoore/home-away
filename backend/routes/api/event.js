const express = require('express');
const {  requireAuth, authenticationCheck } = require('../../utils/auth');
const { Op, json } = require('sequelize');
const { check, query } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation')

const { Event, Group, Venue, User, EventImage, Membership, Attendance } = require('../../db/models');
const attendance = require('../../db/models/attendance');

const router = express.Router();

const validateEventsQuery = [
  query('page', "Page must be greater than or equal to 1").optional().isInt({gt:0}),
  query('size', "Size must be greater than or equal to 1").optional().isInt({gt:0}),
  query('name', "Name must be a string").optional().isString(),
  query('type', "Type must be 'Online' or 'In person'").optional().isString().isIn(['Online', 'In person']),
  query('startDate', "Start date must be a valid datetime").optional().isString().isISO8601('yyyy-mm-dd'),
  handleValidationErrors
]

// Get all Events
router.get('/', validateEventsQuery, async(req, res, next)=>{
  let { page, size, name, type, startDate } = req.query;
  const queries = { name, type, startDate }

  if(!page || page < 1 || page > 10) page = 1;
  if(!size || size < 1 || size > 20) size = 20;

  const pagination = {
      limit: size,
      offset: size * (page - 1)
  }

  if (queries.name || queries.type || queries.startDate){
    pagination.where = {}
    for(let query in queries){
      if(queries[query]) pagination.where[query] = {[Op.substring]: queries[query]}
    }
  }

  if(page = 0 || size == 0 || isNaN(size) || isNaN(page)){
    delete pagination.limit;
    delete pagination.offset;
  }

  let allEvents = await Event.findAll({
    include: [
      {model: Group, attributes: ['id', 'name', 'city', 'state']},
      {model: Venue, attributes: ['id', 'city', 'state']},
      {model: User, attributes: ['id'], through: {attributes: []}},
      {model: EventImage, attributes: ['url', 'preview']}],
    attributes: {
      exclude: ['description', 'capacity', 'price']
    },
    ...pagination,
  })

  const resEvents = []

  for (let event of allEvents){
    const { id, groupId, venueId, name, type, startDate, endDate, Group, Venue } = event;
    const numAttending = event.Users.length
    const previewImage = event.EventImages[0].url
    const newStructureEvent = { id, groupId, venueId, name, type, startDate, endDate, numAttending, previewImage, Group, Venue }
    resEvents.push(newStructureEvent)
  }

  res.json({Events: resEvents})
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

  const isCoHost = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const attendee = await Attendance.findOne({
    where: {
      eventId: event.id,
      userId: req.user.id
    }
  })

  // Authorazation: Current User must be an attendee, host, or co-host of the event
  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !isCoHost && !attendee){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (attendee){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
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

  if(!await Venue.findByPk(req.body.venueId)){
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
});

// Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async(req, res, next)=>{
  const eventId = req.params.eventId;
  const allAttendees = await Event.findByPk(eventId, {
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName'],
      through: {
        attributes: ['status']
      }
    },
    {
      model: Group,
      attributes: ['id', 'organizerId']
    }],
    attributes: []
  })

  if(!allAttendees) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const coHostOfGroup = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: allAttendees.Group.id,
      status: 'co-host'
    }
  })

  if(!authenticationCheck(req.user.id, allAttendees.Group.organizerId) && !coHostOfGroup){
    const attendeesLimited = []

    for (let attendee of allAttendees.Users){
      if(attendee.Attendance.status !== 'pending') attendeesLimited.push(attendee)
    }

    return res.json({Attendees: attendeesLimited})
  }

  res.json({Attendees: allAttendees.Users})
})

// Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async(req, res, next)=>{
  const eventId = req.params.eventId
  const userId = req.user.id

  const event = await Event.findByPk(eventId)

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId
    }
  })

  if(!member){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  const attendee = await Attendance.findOne({
    where: {
      userId,
      eventId
    }
  })

  if(attendee){
    const err = new Error("Attendee already in attendance")
    if(attendee.status === 'pending') err.message = "Attendance has already been requested"
    if(attendee.status === 'attending') err.message = "User is already an attendee of the event"
    err.status = 400
    return next(err)
  }

  const status = 'pending'

  try{
    const newAttendee = await Attendance.create({
      userId,
      eventId,
      status
    })
  } catch(err){
    next(err)
  }
  res.json({ userId, status })
});

// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req, res, next)=>{
  const eventId = req.params.eventId;
  const { userId, status } = req.body;

  const event = await Event.findByPk(eventId,{
    include: [{model: Group, attributes: ['organizerId']}]
  })

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  const coHostOfGroup = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: event.groupId,
      status: 'co-host'
    }
  })

  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !coHostOfGroup){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  if(status === 'pending'){
    const err = new Error("Bad Request")
    err.errors = { status: "Cannot change an attendance status to pending" }
    err.status = 400
    return next(err)
  }

  //Couldn't find a User with the specified userId
  const user = await User.findByPk(userId)
  if(!user){
    const err = new Error("User couldn't be found")
    err.status = 404
    return next(err)
  }



  const attendee = await Attendance.findOne({ where: { userId, eventId }, attributes: {include:  ['id']}})

  if(!attendee) {
    const err = new Error("Attendance between the user and the event does not exist")
    err.status = 404
    return next(err)
  }

  attendee.status = status
  await attendee.save()



  res.json({
    id: attendee.id,
    eventId: attendee.eventId,
    userId: attendee.userId,
    status: attendee.status,
  })
});

// Delete attendance to an event specified by id
router.delete('/:eventId/attendance/:userId', requireAuth, async(req, res, next)=>{
  const { eventId, userId } = req.params

  const event = await Event.findByPk(eventId,{
    include: [{model: Group, attributes: ['organizerId']}]
  })

  if(!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
  }

  //Couldn't find a User with the specified userId
  const user = await User.findByPk(userId)
  if(!user){
    const err = new Error("User couldn't be found")
    err.status = 404
    return next(err)
  }

  console.log(userId, userId == req.user.id, req.user.id)

  if(!authenticationCheck(req.user.id, event.Group.organizerId) && !(userId == req.user.id)){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  const attendant = await Attendance.findOne({ where: { eventId, userId }})
  if(!attendant){
    const err = new Error("Attendance does not exist for this User")
    err.status = 404
    return next(err)
  }


  await Attendance.destroy({ where: { eventId, userId }})

  res.json({ message: "Successfully deleted attendance from event" })
})

module.exports = router;

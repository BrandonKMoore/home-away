const express = require('express');
const {  requireAuth, authenticationCheck } = require('../../utils/auth');
const { Op } = require('sequelize');

const { Event, Group, Venue, User, EventImage } = require('../../db/models');

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





module.exports = router;

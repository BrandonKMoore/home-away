const express = require('express');
const {  requireAuth, authenticationCheck } = require('../../utils/auth');
const { Op } = require('sequelize');

const { Event, Group, Venue } = require('../../db/models');

const router = express.Router();

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







module.exports = router;

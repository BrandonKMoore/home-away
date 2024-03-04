const express = require('express')
const {  requireAuth, authenticationCheck } = require('../../utils/auth')
const { Op } = require('sequelize')

const { Venue, Group, Membership } = require('../../db/models')

const router = express.Router()

router.put('/:venueId', requireAuth, async(req, res, next)=>{
  const venueId = req.params.venueId

  const venue = await Venue.findByPk(venueId, {
    include: [{model: Group, attributes: ['id', 'organizerId']}]
  })

  if(!venue) {
    const err = new Error("Venue couldn't be found")
    err.status = 404
    return next(err)
  }

  const isCoHost = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: venue.Group.id,
      status: 'co-host'
    }
  })

if(!authenticationCheck(req.user.id, venue.Group.organizerId) && !isCoHost){
  const err = new Error("Forbidden")
  err.status = 403
  return next(err)
}


try{
  for (let key in req.body){
    venue[key] = req.body[key]
  }

    await venue.save()

    const { id, groupId, address, city, state, lat, lng } = venue
    res.json({
      id,
      groupId,
      address,
      city,
      state,
      lat,
      lng
    })
  } catch(err) {
    return next(err)
  }
})

module.exports = router;

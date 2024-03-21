const express = require('express')
const {  requireAuth, authenticationCheck } = require('../../utils/auth')
const { Op } = require('sequelize')

const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require('../../db/models')

const router = express.Router()

// Get all Groups
router.get('/', async (req, res)=>{
  const groups = []
  const allGroups = await Group.scope().findAll({
     include: [
      {model: Membership, attributes: ['id']},
      {model: GroupImage, attributes: ['url', 'preview']},
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: Event, include: [{model: EventImage}, {model: Venue}]},
    ]
  })

  allGroups.forEach(ele => {
    const { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Memberships, Events, GroupImages, User } = ele
    const group = { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Events, GroupImages, User}
    group.numMembers = Memberships.length
    group.numEvents = Events.length

    for(let image of GroupImages){
      if(image.preview === true) group.previewImage = image.url
    }

    for(let key in group){
      if(group[key] === null) delete group[key]
    }

    groups.push(group)
  });

  res.json({
    groups
  })
});

// Get all groups joined or organized by the Current User
router.get('/current', requireAuth, async(req, res)=> {
  const groups = []

  const associatedGroups = await Group.scope().findAll({
    include: [
      {model: Membership, attributes: ['userId']},
      {model: GroupImage, attributes: ['url']}
    ],
    where: {
      [Op.or]: {
        organizerId: req.user.id,
        '$Memberships.userId$': req.user.id,
      }
    }
 });

 associatedGroups.forEach(ele => {
  const { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Memberships, GroupImages } = ele
  const group = { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt}
  group.numMembers = Memberships.length
  group.previewImage = GroupImages[0].url

  for(let key in group){
    if(group[key] === null) delete group[key]
  }

  groups.push(group)
  });

  res.json(groups)
});

// Get details of a Group from an id
router.get('/:groupId', async(req, res, next)=>{
  let group = await Group.scope().findByPk(req.params.groupId, {
    include: [
      {model: Event, attributes: ['id']},
      {model: Membership, attributes: ['id']},
      {model: GroupImage, attributes: ['id', 'url', 'preview']},
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: Venue},
    ]
  })

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

   const { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Events, Memberships, GroupImages, Venues } = group
   const altGroup = { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt}
   altGroup.numMembers = Memberships.length
   altGroup.GroupImages = GroupImages
   altGroup.Organizer = group.User
   altGroup.Venues = Venues
   altGroup.numEvents = Events.length

   for(let key in altGroup){
     if(altGroup[key] === null) delete altGroup[key]
   }

  res.json(altGroup)
})

// Create a Group
router.post('/', requireAuth, async(req, res, next)=>{
  const { name, about, type, private, city, state } = req.body
  const organizerId = req.user.id
  let newGroup;
  try{
    newGroup = await Group.scope().create({
      organizerId,
      name,
      about,
      type,
      private,
      city,
      state
    });

  } catch (err){
    err.status = 400
    return next(err)
  }

  res.status(201)
  res.json(newGroup)
})

// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req, res, next)=>{
  const { url, preview } = req.body
  const { groupId } = req.params

  const group = await Group.findByPk(groupId);

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  if(!authenticationCheck(req.user.id, group.organizerId)){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  const newImage = await group.createGroupImage({
    groupId,
    url,
    preview
  })

  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  })
});

// Edit a Group
router.put('/:groupId', requireAuth, async(req, res, next)=>{
  const groupId = req.params.groupId
  const group = await Group.scope().findByPk(groupId);

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  if(!authenticationCheck(req.user.id, group.organizerId)){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  for (let key in req.body){
    group[key] = req.body[key]
  }

  await group.save()

  res.json(group)
})

router.delete('/:groupId', requireAuth, async(req, res, next)=>{
  const groupId = req.params.groupId
  const group = await Group.findByPk(groupId)

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  if(!authenticationCheck(req.user.id, group.organizerId)){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  await Group.destroy({
    where: {
      id: group.id
    }
  })

  return res.json({message: "Successfully deleted"})
});

// Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async (req, res, next)=>{
  const groupId = req.params.groupId

  const group = await Group.findByPk(groupId, {
    include: [
      {model: Venue}
    ],
    attributes: ['id', 'organizerId'],
  })

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const isCoHost = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: group.id,
      status: 'co-host'
    }
  })

  if(!authenticationCheck(req.user.id, group.organizerId) && !isCoHost){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  res.json({
    Venues: group.Venues
  })
})

// Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async (req, res, next)=>{
  const groupId = req.params.groupId
  const newVenue = {}

  const group = await Group.findByPk(groupId)

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const isCoHost = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId,
      status: 'co-host'
    }
  })

  if(!authenticationCheck(req.user.id, group.organizerId) && !isCoHost){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  for (let key in req.body){
    newVenue[key] = req.body[key]
  }

  try{
    const venue = await group.createVenue(newVenue)
    const { address, city, state, lat, lng } = venue

    res.json({
      id: venue.id,
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    })
  } catch (err){
    return next(err)
  }
});

// Get all Events of a Group specified by its id
router.get('/:groupId/events', async(req, res, next)=>{
  const group = await Group.findByPk(req.params.groupId, {
    attributes: ['id']
  })

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const events = await Event.findAll({
    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'city', 'state'],
        where: {id: req.params.groupId}
      },
      {
        model: User,
        attributes: ['id'],
      },
      {
        model: EventImage,
        attributes: ['url', 'preview']
      },
      {
        model: Venue,
        attributes: ['id', 'city', 'state']
      },
    ],
    where: {
      groupId: req.params.groupId
    },
    attributes: {
      exclude: ['description', 'capacity', 'price']
    }
  })

  const eventsOfGroup = []

  events.forEach(ele => {
    const { id, groupId, venueId, name, type, startDate, endDate } = ele
    const event = { id, groupId, venueId, name, type, startDate, endDate }
    event.numAttending = ele.Users.length
    // If preview is true then show image in message
    // for(let num in ele.EventImages){
    //   if (ele.EventImages[num].preview === true){
    //     event.previewImage = ele.EventImages[num].url || null
    //   }
    // }
    event.previewImage = ele.EventImages[0].url || null
    event.Group = ele.Group
    event.Venue = ele.Venue

    eventsOfGroup.push(event)
  });

  res.json({Events: eventsOfGroup})
});

// Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async(req, res, next)=>{
  const newEvent = {}
  const groupId = req.params.groupId

  for (let key in req.body){
    newEvent[key] = req.body[key]
  }

  if (!await Venue.findByPk(req.body.venueId)){
    const err = new Error("Venue couldn't be found")
    err.status = 404
    return next(err)
  }

  const group = await Group.findByPk(req.params.groupId, {
    include: [{ model: Membership }],
    attributes: ['id', 'organizerId']
  })

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const isCoHost = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId,
      status: 'co-host'
    }
  })

  if(!authenticationCheck(req.user.id, group.organizerId) && !isCoHost){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  try{
    const createdEvent = await group.createEvent(newEvent)
    newEvent.id = createdEvent.id

  } catch (err){
    return next(err)
  }
  res.json(newEvent)
});

// Get all Members of a Group specified by its id
router.get('/:groupId/members', async(req, res, next)=>{
  const members = await User.findAll({
    include: [
      {
        model: Membership,
        where: {
          groupId: req.params.groupId
        }
      },
    ],
    attributes: ['id', 'firstName', 'lastName'],
  });

  if(!members) {
    const err = new Error("No members in selected group")
    err.status = 404
    return next(err)
  }

  const organizerId = await Group.findByPk(req.params.groupId, {
    attributes: ['organizerId']
  })

  if(!organizerId) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const coHostOfGroup = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: req.params.groupId,
      status: 'co-host'
    }
  })

  const resMembers = []

  if(authenticationCheck(req.user.id, organizerId) || coHostOfGroup){
    for(let entry of members){
      const { id, firstName, lastName } = entry
      const member = { id, firstName, lastName }
      member.Membership = {status: entry.Memberships[0].status}

      resMembers.push(member)
    }
  } else {
    for(let entry of members){
      if(entry.Memberships[0].status === 'member' || entry.Memberships[0].status === 'co-host'){
        const { id, firstName, lastName } = entry
        const member = { id, firstName, lastName }
        member.Membership = {status: entry.Memberships[0].status}

        resMembers.push(member)
      }
    }
  }

  res.json({Members: resMembers})
})

// Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async(req, res, next)=>{
  const groupId = req.params.groupId
  const userId = req.user.id
  const status = 'pending'

  const group = await Group.findByPk(groupId, {attributes: ['id']})

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const allReadyMember = await Membership.findOne({where: {userId, groupId}})

  if(allReadyMember){
    if(allReadyMember.status === 'pending'){
      const err = new Error("Membership has already been requested")
      err.status = 400
      return next(err)
    } else {
      const err = new Error("User is already a member of the group")
      err.status = 400
      return next(err)
    }
  }

  const newMemberRequest = await group.createMembership({userId, status})

  res.json({
    userId: newMemberRequest.userId,
    status: newMemberRequest.status
  })
});

// Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async(req, res, next)=>{
  const groupId = req.params.groupId
  const { memberId, status } = req.body

  const group = await Group.findByPk(groupId)

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const isCoHost = await Membership.findOne({where:{userId: req.user.id, groupId, status: "co-host"}})

  if(!authenticationCheck(req.user.id, group.organizerId) && !isCoHost){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (isCoHost && status === 'co-host'){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  }

  const user = await User.findByPk(memberId)

  if(!user){
    const err = new Error("User couldn't be found")
    err.status = 404
    return next(err)
  }

  if(status === 'pending'){
    const err = new Error('Bad Request')
    err.status = 400
    err.errors = {status:"Cannot change a membership status to pending"}
    return next(err)
  }

  const member = await Membership.findOne({
    where: {
      groupId,
      userId: memberId,
    }
  })

  if(!member){
    const err = new Error("Membership between the user and the group does not exist")
    err.status = 404
    return next(err)
  }

  member.status = status

try{
  await member.save()
} catch(err){
  return next(err)
}

  res.json(member)
});

// Delete membership to a group specified by id
router.delete('/:groupId/membership/:memberId', requireAuth, async(req, res, next)=>{
  const { groupId, memberId } = req.params

  const user = await User.findByPk(memberId)

  if(!user){
    const err = new Error("User couldn't be found")
    err.status = 404
    return next(err)
  }
  const group = await Group.findByPk(groupId)

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

  const member = await Membership.findOne({
    where: {
      groupId,
      userId: memberId,
    }
  })

  if(!member){
    const err = new Error("Membership between the user and the group does not exist")
    err.status = 404
    return next(err)
  }

    // Check: Current User must be the host of the group, or the user whose membership is being deleted
  if(!authenticationCheck(req.user.id, group.organizerId) && !member){
    const err = new Error("Forbidden")
    err.status = 403
    return next(err)
  } else if (member){
    if (member.userId !== req.user.id){
      const err = new Error("Forbidden")
      err.status = 403
      return next(err)
    }
  }

  try{
    await Membership.destroy({
      where: {
        groupId,
        userId: memberId,
      }
    })
  } catch(err){
    return next(err)
  }

  res.json({ message: "Successfully deleted membership from group" })
});

module.exports = router

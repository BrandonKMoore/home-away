const express = require('express')
const {  requireAuth, authenticationCheck } = require('../../utils/auth')
const { Op } = require('sequelize')

const { Group, GroupImage, Membership, Venue, User } = require('../../db/models')

const router = express.Router()

// Get all Groups
router.get('/', async (req, res)=>{
  const groups = []
  const allGroups = await Group.scope().findAll({
     include: [
      {model: Membership, attributes: ['id']},
      {model: GroupImage, attributes: ['url']}
    ]
  })

  allGroups.forEach(ele => {
    const { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Memberships, GroupImages } = ele
    const group = { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt}
    group.numMembers = Memberships.length
    group.previewImage = GroupImages[0].url

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
      {model: Membership, attributes: ['id']},
      {model: GroupImage, attributes: ['id', 'url', 'preview']},
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: Venue}
    ]
  })

  if(!group) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
  }

   const { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt, Memberships, GroupImages, Venues } = group
   const altGroup = { id, organizerId, name, about,type, private, city, state, createdAt, updatedAt}
   altGroup.numMembers = Memberships.length
   altGroup.GroupImages = GroupImages
   altGroup.Organizer = group.User
   altGroup.Venues = Venues

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

  const member = await group.getMemberships({
    where: {
      userId: req.user.id
    }
  })

  if(!authenticationCheck(req.user.id, group.organizerId) && member[0].status !== 'co-host'){
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

  const member = await group.getMemberships({
    where: {
      userId: req.user.id
    }
  })

  if(!authenticationCheck(req.user.id, group.organizerId) && member[0].status !== 'co-host'){
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

module.exports = router

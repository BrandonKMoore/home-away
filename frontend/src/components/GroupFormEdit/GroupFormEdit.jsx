import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { editCurrGroup } from '../../store/groups'
import './GroupFormEdit.css'

export default function GroupFormEdit(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {groupId} = useParams()
  const sessionUser = useSelector(state => state.session.user);
  const group = useSelector(state => state.groups[groupId])
  const [errors, setErrors] = useState({})
  const [location, setLocation] = useState(`${group.city}, ${group.state}`)
  const [name, setName] = useState(group.name)
  const [about, setAbout] = useState(group.about)
  const [type, setType] = useState(group.type)
  const [isPrivate, setIsPrivate] = useState(group.private)
  const [imageUrl, setImageUrl] = useState(group.previewImage)

  // function stateReset(){
  //   setLocation('')
  //   setName('')
  //   setAbout('')
  //   setType('')
  //   setIsPrivate('')
  //   setImageUrl('')
  // }


  const handleSubmit = async(e) =>  {
    e.preventDefault()
    const loadedErrors = {}


    if(!location || location.length < 3 || !location.includes(',')) loadedErrors.location = "Location is required"
    if(!name || name.length < 3 ) loadedErrors.name = "Name is required"
    if(!about || about.length < 50) loadedErrors.about = "Description must be at least 50 characters long"
    if(!type) loadedErrors.type = "Group Type is required"
    if(isPrivate || isPrivate !== false) loadedErrors.isPrivate = "Visibility Type is required"
    // if(!imageUrl.endsWith('.png') && !imageUrl.endsWith('.jpeg') && !imageUrl.endsWith('.jpg')) loadedErrors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg"

    setErrors(loadedErrors);

    if(!Object.entries(loadedErrors).length){
      const [city, state] = location.split(',')
      const data = {
        organizerId: sessionUser.id,
        name,
        about,
        type,
        private: isPrivate,
        city,
        state,
        imageUrl,
        id: group.id
      }

      await dispatch(editCurrGroup(data))
      await navigate(`/groups/${group.id}`)
      // stateReset()
    }
  }

  useEffect(()=>{
    if(sessionUser.id !== group.organizerId) {
      navigate('/')
      alert('Sign in to create new group')
    }
  }, [sessionUser, navigate, group.organizerId])

  return (
    <div className='small-page-container'>
      <span>Update your Group</span>
      <h3>We&apos;ll walk you through a few steps to build your local community</h3>
      <form onSubmit={handleSubmit}>
        <div className="line-break"></div>
        <h3>First, set your group&apos;s location.</h3>
        <p>SocialEyes groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online</p>
        <input
          type="text"
          placeholder="City, state"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        { errors.location ? <span className='new-group-error'>{errors.location}</span>: null }
        <div className="line-break"></div>
        <h3>What will your group&apos;s name be?</h3>
        <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
        <input
          type="text"
          placeholder="What is your group name?"
          value={name}
          onChange={(e)=> setName(e.target.value)}
        />
        { errors.name ? <span className='new-group-error'>{errors.name}</span>: null }
        <div className="line-break"></div>
        <h3>Now describe what your group will be about</h3>
        <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
        <ol id='about-list'>
          <li>What&apos;s the purpose of the group?</li>
          <li>Who should join?</li>
          <li>What will you do at your events?</li>
        </ol>
        <textarea
          type="text-area"
          cols={50}
          placeholder="Please write at least 50 characters"
          value={about}
          onChange={(e)=> setAbout(e.target.value)}
        />
        { errors.about ? <span className='new-group-error'>{errors.about}</span>: null }
        <div className="line-break"></div>
        <h3>Final steps...</h3>
        <div>
          <label htmlFor="group-type">Is this an in person or online group?</label>
          <select
            name="group-type"
            id="group-type"
            value={type}
            onChange={(e)=> setType(e.target.value)}
            >
            <option value='' disabled={true}>(select one)</option>
            <option value="In-Person">In person</option>
            <option value="Online">Online</option>
          </select>
          { errors.type ? <span className='new-group-error'>{errors.type}</span>: null }
        </div>
        <div>
          <label htmlFor="group-avail">Is this group private or public?</label>
          <select
            name="group-avail"
            id="group-avail"
            value={isPrivate}
            onChange={(e)=> setIsPrivate(e.target.value)}
            >
            <option value='' disabled={true}>(select one)</option>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
          { errors.isPrivate ? <span className='new-group-error'>{errors.isPrivate}</span>: null }
        </div>
        <div>
          <label htmlFor="group-image">Please add an image url to your group below:</label>
          <input
            name='group-image'
            id='group-image'
            type="text"
            placeholder='Image Url'
            value={imageUrl}
            onChange={(e)=> setImageUrl(e.target.value)}
            />
            { errors.imageUrl ? <span className='new-group-error'>{errors.imageUrl}</span>: null }
        </div>
        <div className="line-break"></div>
        <button type="submit">Update Group</button>
      </form>
    </div>
  )
}

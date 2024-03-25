import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createNewEvent } from '../../store/events'
import './EventFormNew.css'

export default function EventFormNew() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [isPrivate, setIsPrivate] = useState('')
  const [price, setPrice] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  let { groupId } = useParams()
  groupId = Number(groupId)
  let group = useSelector(state => state.groups[groupId])
  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser || !group) return navigate(`/groups/${groupId}`)

  const handleSubmit = async(e) => {
    e.preventDefault()
    const loadedErrors = {}

    !name ? loadedErrors.name = 'Name is required' : null
    !type ? loadedErrors.type = 'Event Type is required' : null
    !isPrivate ? loadedErrors.isPrivate = 'Visibility is required' : null
    !price ? loadedErrors.price = 'Price is required' : null
    !startDate ? loadedErrors.startDate = 'Event start is required' : null
    !endDate ? loadedErrors.endDate = 'Event end is required' : null
    !imageUrl.endsWith('.png') && !imageUrl.endsWith('.jpeg') && !imageUrl.endsWith('.jpg') ? loadedErrors.imageUrl = 'Image URL must end in .png, .jpg, or .jpeg' : null
    description.length < 30 ? loadedErrors.description = 'Description must be at least 30 characters long' : null


    setErrors(loadedErrors)

    if(!Object.entries(loadedErrors).length) {
      const data = {
        groupId,
        name,
        description,
        type,
        price,
        startDate,
        endDate,
        imageUrl,
        isPrivate,
      }
      let response = await dispatch(createNewEvent(data))
      navigate(`/events/${response.id}`)
    }
  }

  function changeTypeToDate(e){
    const type = document.getElementById(e.target.id)
    type.setAttribute('type', 'datetime-local')
  }

  return (
    <div className='small-page-container create-edit-forms' id='create-edit-forms'>
      <h2>Create an event for {group.name}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="event-name-input">What is the name of your event?</label>
        <input
          type="text"
          id='event-name-input'
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        { errors.name ? <span className='new-event-error'>{errors.name}</span>: null }
        <div className="line-break"></div>
        <div>
          <label htmlFor="event-type">Is this an in person or online event?</label>
          <select
            id="event-type"
            value={type}
            onChange={(e)=> setType(e.target.value)}
            >
            <option value='' disabled={true}>(select one)</option>
            <option value="In-Person">In person</option>
            <option value="Online">Online</option>
          </select>
        </div>
        { errors.type ? <span className='new-event-error'>{errors.type}</span>: null }
        {/* doesn't ask for visibility on scorecard */}
        <div>
          <label htmlFor="visibility">Is this event private or public?</label>
            <select
              id="visibility"
              value={isPrivate}
              onChange={(e)=> setIsPrivate(e.target.value)}
              >
              <option value='' disabled={true}>(select one)</option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
        </div>
        { errors.isPrivate ? <span className='new-event-error'>{errors.isPrivate}</span>: null }
        <div>
          <label htmlFor="event-price-input">What is the price for your event?</label>
          <input
            type="number"
            id='event-price-input'
            placeholder='0'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        { errors.price ? <span className='new-event-error'>{errors.price}</span>: null }
        <div className="line-break"></div>
        <div>
          <label htmlFor="event-startDate-input">When does your event start?</label>
          <input
            type="text"
            id='event-startDate-input'
            placeholder="MM/DD/YYYY, HH:mm AM"
            onFocus={changeTypeToDate}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        { errors.startDate ? <span className='new-event-error'>{errors.startDate}</span>: null }
        <div>
          <label htmlFor="event-endDate-input">When does your event end?</label>
          <input
            type="text"
            id='event-endDate-input'
            placeholder="MM/DD/YYYY, HH:mm AM"
            onFocus={changeTypeToDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        { errors.endDate ? <span className='new-event-error'>{errors.name}</span>: null }

        <div className="line-break"></div>
        <div>
          <label htmlFor="event-imageUrl-input">Please add an image url for your event below:</label>
          <input
            type="text"
            id='event-imageUrl-input'
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        { errors.imageUrl ? <span className='new-event-error'>{errors.imageUrl}</span>: null }
        <div className="line-break"></div>
        <div>
        <label htmlFor="event-description-input">Please describe your event:</label>
          <textarea
            id='event-description-input'
            type="text-area"
            placeholder="Please include at least 30 characters"
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
          />
        </div>
        { errors.description ? <span className='new-event-error'>{errors.description}</span>: null }

        <button type="submit">Create Event</button>
      </form>

    </div>
  )
}

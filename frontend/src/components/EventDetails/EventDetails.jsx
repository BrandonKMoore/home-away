import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './EventDetails.css'
import { useEffect } from 'react'
import { getAllEvents } from '../../store/events'
import imagePlaceHolder from '/image.jpeg'
import OpenModalButton from '../OpenModalButton'
import { LuClock5 } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { FaMapPin } from "react-icons/fa";
import DeleteEventModal from '../DeleteEventModal'

export default function EventDetails(){
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const events = useSelector(state => state.events)
  const sessionUser = useSelector(state => state.session.user);

  useEffect(()=>{
    if(Object.entries(events).length < 2) dispatch(getAllEvents())

  }, [events, dispatch])

  if(!events[eventId]) return null
  const event = events[eventId]

  function normalizeTime(UTC){
    const localDateTime = new Date(UTC)
    return localDateTime.toLocaleTimeString('en-US')
  }


  function normalizeDate(UTC){
    const localDateTime = new Date(UTC)
    return localDateTime.toLocaleDateString("en-US")
  }

  function handleUpdateButton(){
    if(!sessionUser) {
      alert("You have to be signed in join a group")
    } else {
      alert("Feature Coming Soon...")
    }
  }

  return (
    <div className="small-page-container">
      <div>
        <div className='event-title-area'>
        <Link className='breadcrumb' to="/events">{'< '}<span>{`Events`}</span></Link>
          <h2>{event.name}</h2>
          <span className='faint smallest'>Hosted by {event.Group.User.firstName} {event.Group.User.lastName}</span>
        </div>
        <div className='event-details-hero'>
          <div className='event-details-image-container'>
            {!event.previewImage ? <img src={imagePlaceHolder} alt="" /> : <img src={event.previewImage} alt="" />}
          </div>
          <div className="event-hero-right">
            <div className="event-group-info">
              {!event.Group.GroupImages.length ? <img src={imagePlaceHolder} alt="" /> : <img src={event.Group.GroupImages[0].url} alt="" />}
              <div>
                <div className='groupTitle'>{event.Group.name}</div>
                <div className='faint smallest'>{event.Group.private ? 'Private' : 'Public'}</div>
              </div>
            </div>
            <div className="event-quick-details">
              <div className='event-time'>
                <div className='icon faint'>{LuClock5()}</div>
                <div className='details'>

                  <div className='time'><span className='faint small'>Start </span>{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</div>
                  <div className='time'><span className='faint small'>End </span>{normalizeDate(event.endDate)} • {normalizeTime(event.endDate)}</div>
                </div>
              </div>
              <div className='event-cost'>
                <div className='icon faint'>{CiDollar()} </div>
                <div className='price'>{event.price ? `$${event.price}` : <span className='faint small'>Free</span>}</div>
              </div>
              <div className='event-attend-type'>
                <div>
                  <div className='icon faint'>{FaMapPin()}</div>
                  <div className='type faint small'>{} {event.type}</div>
                </div>
                { sessionUser ?
                  <div className='auth-manage-buttons'>
                    <Link onClick={handleUpdateButton}>Update</Link>
                    <OpenModalButton buttonText="Delete" modalComponent={<DeleteEventModal event={event}/>} />
                  </div> : null
                }
              </div>
            </div>
          </div>
        </div>
          <div>
            <h2>Details</h2>
            <p>{event.description} </p>
          </div>
      </div>
    </div>
  )
}

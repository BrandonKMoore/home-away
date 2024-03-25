import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './EventDetails.css'
import { useEffect } from 'react'
import { getAllEvents } from '../../store/events'
import OpenModalButton from '../OpenModalButton'
import { LuClock5 } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { FaMapPin } from "react-icons/fa";
import DeleteEventModal from '../DeleteEventModal'
import examplePic from "/example-pic.jpg"

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

  function displayDefaultImg(e){
    e.target.src = examplePic
  }

  return (
    <div className="small-page-container" id='event-details-page'>
      <div className='event-title-area'>
        <Link className='breadcrumb' to="/events">{'< '}<span>{`Events`}</span></Link>
        <h2>{event.name}</h2>
        <p className='faint smallest'>Hosted by {event.Group.User.firstName} {event.Group.User.lastName}</p>
      </div>
      <div className='event-details-hero'>
        <div className='event-details-image-container'>
          {!event.previewImage ? <img src={examplePic} alt="" /> : <img onError={displayDefaultImg} src={event.previewImage} alt="" />}
        </div>
        <div className="event-hero-right">
          <div className="event-group-info">
            {!event.Group.GroupImages.length ? <img src={examplePic} alt="" /> : <img onError={displayDefaultImg} src={event.Group.GroupImages[0].url} alt="" />}
            <div>
              <div className='groupTitle'>{event.Group.name}</div>
              <p className='faint'>{event.Group.private ? 'Private' : 'Public'}</p>
            </div>
          </div>
          <div className="event-quick-details">
            <div className='event-time'>
              <div className='icon faint'>{LuClock5()}</div>
              <div className='details'>
                <p className='time'><span className='faint'>Start </span>{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</p>
                <p className='time'><span className='faint'>End </span>{normalizeDate(event.endDate)} • {normalizeTime(event.endDate)}</p>
              </div>
            </div>
            <div className='event-cost'>
              <div className='icon faint'>{CiDollar()} </div>
              <p className='price'>{event.price ? `$${event.price}` : <span className='faint small'>Free</span>}</p>
            </div>
            <div className='event-details-bottom-right-hero'>
              <div className='event-attend-type'>
                <div className='icon faint'>{FaMapPin()}</div>
                <p className='type faint small'>{} {event.type}</p>
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
        <div className='event-details-body'>
          <h2>Details</h2>
          <p>{event.description} </p>
        </div>
    </div>
  )
}

import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useEffect } from "react"

import { getAllGroups } from '../../store/groups'
import OpenModalButton from '../OpenModalButton'
import DeleteGroupModal from '../DeleteGroupModal'

import imagePlaceHolder from '/example-pic.jpg'
import examplePic from "/example-pic.jpg"
import './GroupDetails.css'


export default function GroupDetails(){
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const groups = useSelector(state => state.groups)
  const sessionUser = useSelector(state => state.session.user);
  let isAuthorized;
  let isMember;

  // if (Object.entries(groups).length < 1) {
  //   dispatch(getAllGroups())
  //   return null
  // }

  function handleJoinButton(){
    if(!sessionUser) {
      alert("You have to be signed in join a group")
    } else {
      alert("Feature Coming Soon...")
    }
  }

  useEffect(()=> {
      dispatch(getAllGroups())
    }, [dispatch])

    function normalizeTime(UTC){
      const localDateTime = new Date(UTC)
      return localDateTime.toLocaleTimeString('en-US')
    }

    function normalizeDate(UTC){
      const localDateTime = new Date(UTC)
      const year = localDateTime.getFullYear()
      const month = localDateTime.getMonth()
      const date = localDateTime.getDate()
      return `${year}-${month}-${date}`
    }

    function displayDefaultImg(e){
      e.target.src = examplePic
    }

    try{
      let group = Object.values(groups).find(group => group.id === Number(groupId))
      const upcomingEvents = []
      const pastEvents = []
      if(sessionUser){
        isAuthorized = group.User.id === sessionUser.id;
        isMember = group.Memberships.find((member) => member.id === sessionUser.id);
      }
      const eventsByGroup = group.Events.toSorted((a, b)=> Date.parse(a.startDate) - Date.parse(b.startDate))
      eventsByGroup.map((event)=> new Date(event.startDate) > new Date() ? upcomingEvents.push(event): pastEvents.push(event))

    return (
      <div className="small-page-container" id='group-details-page'>
        <Link className='breadcrumb' to="/groups">{'< '}<span>{`Groups`}</span></Link>
        <div className='group-details-hero'>
          <div className='group-details-image-container'>
          {!group.GroupImages.length ? <img src={examplePic} alt="" /> : <img onError={displayDefaultImg} src={group.GroupImages[0].url} alt="" />}
          </div>
          <div className="group-quick-details">
            <div className="group-quick-details-top">
              <h2>{group.name}</h2>
              <p className='faint'>{group.city}, {group.state}</p>
              <span className='faint'>{group.numEvents} {group.numEvents === 1 ? 'event' : 'events'} • {group.private ? 'private' : 'public'}</span>
              <p className='faint'>Organized by {group.User.firstName} {group.User.lastName}</p>
            </div>
            {isMember || isAuthorized || !sessionUser ? null : <Link onClick={handleJoinButton}>Join this group</Link>}
            {isAuthorized ? <div className='group-organizer-options'>
              <Link to='events/new'>Create event</Link>
              <Link to={`edit`}>Update</Link>
              <OpenModalButton buttonText="Delete" modalComponent={<DeleteGroupModal group={group}/>} />
            </div> : null}
          </div>
        </div>
        <div className="group-details-body">
          <div className='header'>
            <h3>Organizer</h3>
            <p className='faint'>{group.User.firstName} {group.User.lastName}</p>
          </div>
          <div className="about">
            <h3>What we&apos;re about</h3>
            <p>{group.about}</p>
          </div>
          {upcomingEvents.length > 0 ? <div className="upcomingEvents">
            <h3>Upcoming Events ({upcomingEvents.length})</h3>
            {upcomingEvents.map((event)=> <div key={event.id} className='group-event-card'><Link to={`/events/${event.id}`}>
              <div className='top'>
                <img onError={displayDefaultImg} src={event.EventImages.find((image)=> image.preview === true).url || examplePic} alt="Event Preview Image" />
                <div className='group-event-quick-details'>
                  <div className="event-start-date">{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</div>
                  <h4 className="event-title">{event.name}</h4>
                  <p className="event-location faint">{event.Venue ? event.Venue.city : group.city}, {event.Venue ? event.Venue.state : group.state}</p>
                </div>
              </div>
            <div className="group-event-description">{event.description}</div>
            </Link></div>)}</div> :
          <div><h3>No Upcoming Events</h3></div>}
          {pastEvents.length > 0 ? <div className="pastEvents">
            <h3>Past Events ({pastEvents.length})</h3>
            {pastEvents.map((event)=> <div key={event.id} className='group-event-card'><Link to={`/events/${event.id}`}>
              <div className='top'>
                <img src={event.EventImages.find((image)=> image.preview === true).url || imagePlaceHolder} alt="Event Preview Image" />
                <div className='group-event-quick-details'>
                  <div className="event-start-date">{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</div>
                  <h4 className="event-title">{event.name}</h4>
                  <p className="event-location faint">{event.Venue ? event.Venue.city : group.city}, {event.Venue ? event.Venue.state : group.state}</p>
                </div>
              </div>
            <div className="group-event-description">{event.description}</div>
            </Link></div>)}</div> :
          <div><h3>No Past Events</h3></div>}
        </div>
      </div>
    )
  } catch {
    return null
  }
}

import { useSelector, useDispatch } from 'react-redux'
import { getAllGroups } from '../../store/groups'
import { useParams } from 'react-router-dom'
import imagePlaceHolder from '/favicon.ico'
import { useEffect } from "react"
import './GroupDetails.css'



export default function GroupDetails(){
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const groups = useSelector(state => state.groups)

  if (!Object.entries(groups).length) {
    dispatch(getAllGroups())
  }



  // useEffect(()=> {
    //   dispatch(getAllGroups())
    // }, [dispatch])



    try{
      let group = Object.values(groups).find(group => group.id === Number(groupId))
      const upcomingEvents = []
      const pastEvents = []
      let eventsByGroup = group.Events
      eventsByGroup.map((event)=> new Date(eventsByGroup[0].startDate) > new Date() ? upcomingEvents.push(event): pastEvents.push(event))

      console.log(upcomingEvents)
    return (
      <div className="small-page-container">
        <div className='group-details-hero'>
          <div className='group-details-image-container'>
          {group.GroupImages.length ? <img src={group.GroupImages[0].url} alt="" /> : <img src={imagePlaceHolder} alt="" />}
          </div>
          <div className="group-quick-details">
            <div className="group-quick-details-top">
              <h2>{group.name}</h2>
              <p>{group.city}, {group.state}</p>
              <span>{group.numEvents} {group.numEvents === 1 ? 'event' : 'events'} * {group.private ? 'private' : 'public'}</span>
              <p>Organized by {group.User.firstName} {group.User.lastName}</p>
            </div>
            <a>Join this group</a>
          </div>
        </div>
        <div className="group-details-body">
          <div className='header'>
            <h3>Organizer</h3>
            <p>{group.User.firstName} {group.User.lastName}</p>
          </div>
          <div className="about">
            <h3>What we're about</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
            {upcomingEvents.length > 0 ? <div className="upcomingEvents">
            <h3>Upcoming Events ({group.numEvents})</h3>
            {upcomingEvents.map((event)=> <div className='group-event-card'>
              <div className='top'>
                <img src={event.EventImages.find((image)=> image.preview === true).url} alt="Event Preview Image" />
                <div className='group-event-quickdetails'>
                  <div className="event-start-date">{event.startDate}</div>
                  <div className="event-title">{event.name}</div>
                  <div className="event-location">{event.Venue.city}, {event.Venue.state}</div>
                </div>
              </div>
              <div className="group-event-description">{event.description}</div>
            </div>)}
          </div> : null }
          {pastEvents.length > 0 ? <div className="pastEvents">
            <h3>Past Events ({group.numEvents})</h3>
            {pastEvents.map((event)=> <div className='group-event-card'>
              <div className='top'>
                <img src={event.EventImages.find((image)=> image.preview === true).url} alt="Event Preview Image" />
                <div className='group-event-quickdetails'>
                  <div className="event-start-date">{event.startDate}</div>
                  <div className="event-title">{event.name}</div>
                  <div className="event-location">{event.Venue.city}, {event.Venue.state}</div>
                </div>
              </div>
              <p className="group-event-description">{event.description}</p>
            </div>)}
          </div> : null }
        </div>
      </div>
    )
  } catch {
    return null
  }
}

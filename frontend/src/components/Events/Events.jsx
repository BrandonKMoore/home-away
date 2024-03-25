import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import GroupEventHeader from "../GroupEventHeader";
import { getAllEvents } from "../../store/events";
import placeholder from '/favicon.ico'
import './Events.css'
import { Link } from "react-router-dom";

export default function Events (){
  const dispatch = useDispatch();
  const eventsList = useSelector(state => state.events)

  useEffect(()=> {
    dispatch(getAllEvents())
  }, [dispatch])

  const upcomingEvents = []
  const pastEvents = []
  const sortedEventList = Object.values(eventsList).toSorted((a, b)=> Date.parse(a.startDate) - Date.parse(b.startDate))
  sortedEventList.map((event)=> new Date(event.startDate) > new Date() ? upcomingEvents.push(event): pastEvents.push(event))


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

  function eventCardGenerator(events){
    return events.map((event)=> (<>
      <div className="line-break"></div>
      <Link to={`${event.id}`} className="eventCard" key={event.id}>
        <div className="topEventCard">
          <div className="eventListImage">
            <img src={event.previewImage ? event.previewImage : placeholder} alt="" />
          </div>
          <div className="eventListDetails">
            <span className="event-startDate">{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</span>
            <h3>{event.name}</h3>
            <h4>{event.Venue ? event.Venue.city : event.Group.city}, {event.Venue ? event.Venue.state : event.Group.state}</h4>
          </div>
        </div>
        <p>{event.description}</p>
      </Link>
    </>
    ))
  }

  return (
    <>
      <GroupEventHeader />
      <div className="small-page-container" id="event-page">
        <div className="line-break"></div>
          <h2>Upcoming events</h2>
          {eventCardGenerator(upcomingEvents)}
          <div className="line-break"></div>
          <h2>Past events</h2>
          {eventCardGenerator(pastEvents)}
      </div>
    </>
  )
}

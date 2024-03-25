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
    return localDateTime.toLocaleDateString("en-US")
  }

  function eventCardGenerator(events){
    return events.map((event)=> (
      <Link to={`${event.id}`} className="eventCard" key={event.id}>
        <div className="topEventCard">
          <div className="eventListImage">
            <img src={event.previewImage ? event.previewImage : placeholder} alt="" />
          </div>
          <div className="eventListDetails">
            <p>{normalizeDate(event.startDate)} • {normalizeTime(event.startDate)}</p>
            <h3>{event.name}</h3>
            <p>{event.Venue ? event.Venue.city : event.Group.city}, {event.Venue ? event.Venue.state : event.Group.state}</p>
          </div>
        </div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      </Link>
    ))
  }

  return (
    <>
      <GroupEventHeader />
      <div className="small-page-container">
        <h2>Upcoming events</h2>
        {eventCardGenerator(upcomingEvents)}
        <h2>Past events</h2>
        {eventCardGenerator(pastEvents)}
      </div>
    </>
  )
}

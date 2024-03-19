import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import GroupEventHeader from "../GroupEventHeader";
import { getAllEvents } from "../../store/events";
import placeholder from '/favicon.ico'
import './Events.css'

export default function Events (){
  const dispatch = useDispatch();
  const eventsList = useSelector(state => state.events)

  useEffect(()=> {
    dispatch(getAllEvents())
  }, [dispatch])

  return (
    <>
      <GroupEventHeader />
      <div>
        {Object.values(eventsList).map((event)=> (
          <div className="eventCard" key={event.id}>
            <div className="topEventCard">
              <div className="eventListImage">
                <img src={placeholder} alt="" />
              </div>
              <div className="eventListDetails">
                <p>{event.startDate}</p>
                <h3>{event.name}</h3>
                <p>{event.Venue.city}, {event.Venue.state}</p>
              </div>
            </div>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          </div>
        ))}
      </div>
    </>
  )
}

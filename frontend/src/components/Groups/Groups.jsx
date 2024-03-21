import { useDispatch, useSelector } from "react-redux"
import GroupEventHeader from "../GroupEventHeader";
import { getAllGroups } from "../../store/groups";
import { Link } from "react-router-dom";
import placeholder from '/favicon.ico'
import { useEffect } from "react"
import './Groups.css'



export default function Groups (){
  const dispatch = useDispatch();

  const groupsList = useSelector(state => state.groups)

  useEffect(()=> {
    dispatch(getAllGroups())
  }, [dispatch])

  return (
    <>
    <GroupEventHeader />
    <div className="small-page-container">
      {Object.values(groupsList).map((group)=> (
        <Link to={String(group.id)} key={group.id}>
          <div className="groupCard">
            <div className="groupListImage">
              <img src={placeholder} alt="" />
            </div>
            <div className="groupListDetails">
              <h3>{group.name}</h3>
              <p>{group.city}, {group.state}</p>
              <p>{group.about}</p>
              <span>{group.numEvents} {group.numEvents === 1 ? 'event' : 'events'} * {group.private ? 'private' : 'public'}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </>
  )
}

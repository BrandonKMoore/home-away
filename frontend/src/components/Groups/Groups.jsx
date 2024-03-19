import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getAllGroups } from "../../store/groups";
import placeholder from '/favicon.ico'
import './Groups.css'



export default function Groups (){
  const dispatch = useDispatch();

  const groupsList = useSelector(state => state.groups)

  useEffect(()=> {
    dispatch(getAllGroups())
  }, [dispatch])

  console.log(groupsList)

  return (
    <div>
      {Object.values(groupsList).map((group)=> (
        <div className="groupCard" key={group.id}>
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
      ))}
    </div>
  )
}

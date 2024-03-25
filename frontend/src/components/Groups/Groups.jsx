import { useDispatch, useSelector } from "react-redux"
import GroupEventHeader from "../GroupEventHeader";
import { getAllGroups } from "../../store/groups";
import { Link } from "react-router-dom";
import examplePic from "/example-pic.jpg"
import { useEffect } from "react"
import './Groups.css'



export default function Groups (){
  const dispatch = useDispatch();
  const groupsList = useSelector(state => state.groups)

  useEffect(()=> {
    dispatch(getAllGroups())
  }, [dispatch])


  function displayDefaultImg(e){
    e.target.src = examplePic
  }

  return (
    <>
    <GroupEventHeader />
    <div className="small-page-container group-page">
      {Object.values(groupsList).map((group)=> (<div key={group.id}>
        <div className="line-break"></div>
        <Link className="groupCard" to={String(group.id)}>
          <div className="groupListImage">
            {group.GroupImages.length ? <img onError={displayDefaultImg} src={group.GroupImages[0].url} alt="" /> : <img src={examplePic} alt="" />}
          </div>
          <div className="groupListDetails">
            <div>
              <h3>{group.name}</h3>
              <p>{group.city}, {group.state}</p>
            </div>
            <p>{group.about}</p>
            <span>{group.numEvents} {group.numEvents === 1 ? 'event' : 'events'} • {group.private ? 'private' : 'public'}</span>
          </div>
        </Link>
      </div>
      ))}
    </div>
    </>
  )
}

import { useSelector,useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from "react"
import { getAllGroups } from '../../store/groups'









export default function GroupDetails(){
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const groupsList = useSelector(state => state.groups)

console.log(groupsList)

useEffect(()=> {
  dispatch(getAllGroups())
}, [dispatch])

  return (
    <h2>Hi From GroupDetails</h2>
  )
}

import { useNavigate } from "react-router-dom"
import { useModal } from '../../context/Modal'
import { useDispatch } from "react-redux";
import { deleteCurrGroups } from "../../store/groups";

export default function DeleteModal({group}){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { closeModal } = useModal();

  function handleSubmit(){
    dispatch(deleteCurrGroups(group))
    closeModal()
    navigate('/groups')
  }


  return (
    <div>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this group?</p>
      <button onClick={handleSubmit}>Yes(Delete Group)</button>
      <button onClick={closeModal}>No(Keep Group)</button>
    </div>
  )
}

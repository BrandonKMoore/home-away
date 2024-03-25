import { useNavigate } from "react-router-dom"
import { useModal } from '../../context/Modal'
import { useDispatch } from "react-redux";
import { deleteCurrEvent } from "../../store/events";
import './DeleteEventModal.css'

export default function DeleteEventModal({event}){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { closeModal } = useModal();

  function handleSubmit(){
    dispatch(deleteCurrEvent(event))
    closeModal()
    navigate('/events')
  }


  return (
    <div>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this group?</p>
      <button className='delete-yes' onClick={handleSubmit}>Yes(Delete Group)</button>
      <button className='delete-no' onClick={closeModal}>No(Keep Group)</button>
    </div>
  )
}

import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventFormNew.css'

export default function EventFormNew() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  const sessionUser = useSelector(state => state.session.user);

  // Need name, type, price, startDate, endDate, Image, description,
  // need
  return (
    <h1>Hi from EventFormNew</h1>
  )
}

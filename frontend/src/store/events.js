import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = 'events/getAllEvents'
const CREATE_NEW_EVENT  = 'events/createNewEvent'
const DELETE_CURRENT_EVENT = 'events/deleteEvent'

const loadAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events
  }
}

const createEvent = (event) => {
  return {
    type: CREATE_NEW_EVENT,
    event
  }
}

const deleteEvent = (event) => {
  return {
    type: DELETE_CURRENT_EVENT,
    event
  }
}





export const getAllEvents = () => async dispatch => {
  const response = await csrfFetch("/api/events", {
    method: "GET"
  });
  const data = await response.json();
  dispatch(loadAllEvents(data.Events))
  return response;
}

export const getEventById = (id) => async dispatch => {
  const response = await csrfFetch(`/api/${id}`, {
    method: "GET"
  });
  const data = await response.json();
  dispatch(loadAllEvents(data.Events))
  return response;
}

export const deleteCurrEvent = (event) => async dispatch => {
  console.log()
  const response = await csrfFetch(`/api/events/${event.id}`, {
    method: "DELETE"
  });
  dispatch(deleteEvent(event))
  return await response.json()
}

export const createNewEvent = (eventData) => async dispatch => {
  const {groupId} = eventData
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify(eventData)
  });
  const data = await response.json();

  dispatch(createEvent(eventData))
  return data;
}



let initialState = {};
let allEventsObj = {}

function eventsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_EVENTS:
      allEventsObj = {}
      action.events.forEach(event => (allEventsObj[event.id] = event))
      return allEventsObj;
    case CREATE_NEW_EVENT:
      return {};
    case DELETE_CURRENT_EVENT:
      initialState = {...state}
      delete initialState[action.event.id]
      return {...initialState}
    default:
      return state;
  }
}

export default eventsReducer

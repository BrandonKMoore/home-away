import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = 'events/getAllEvents'

const loadAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events
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

const initialState = {};

function eventsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_EVENTS:
      const allEventsObj = {}
      action.events.forEach(event => (allEventsObj[event.id] = event))
      return allEventsObj
    default:
      return state;
  }
}

export default eventsReducer

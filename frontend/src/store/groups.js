import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups'

const loadAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups
  }
}

export const getAllGroups = () => async dispatch => {
  const response = await csrfFetch("/api/groups", {
    method: "GET"
  });
  const data = await response.json();
  dispatch(loadAllGroups(data.groups))
  return response;
}

const initialState = {};

function groupsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_GROUPS:
      const allGroupsObj = {}
      action.groups.forEach(group => (allGroupsObj[group.id] = group))
      return allGroupsObj
    default:
      return state;
  }
}

export default groupsReducer

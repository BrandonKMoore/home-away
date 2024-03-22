import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups'
const CREATE_NEW_GROUP = 'groups/createNewGroup'

const loadAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups
  }
}

const createGroup = (groupData) => {
  return {
    type: CREATE_NEW_GROUP,
    groupData
  }
}

export const createNewGroup = (groupData) => async dispatch => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(groupData)
  });
  const data = await response.json();
  groupData.id = data.id
  dispatch(createGroup(groupData))
  return response;
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
const allGroupsObj = {};

function groupsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_GROUPS:
      action.groups.forEach(group => (allGroupsObj[group.id] = group))
      return allGroupsObj
    case CREATE_NEW_GROUP:
      return {...state, ...action.groupData}
    default:
      return state;
  }
}

export default groupsReducer

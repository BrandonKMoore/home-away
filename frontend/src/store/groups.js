import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups'
const CREATE_NEW_GROUP = 'groups/createNewGroup'
const DELETE_GROUP = 'groups/deleteGroup'
const EDIT_GROUP = 'groups/editGroup'

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

const editGroup = (groupData) => {
  return {
    type: EDIT_GROUP,
    groupData
  }
}

const deleteGroup = (groupData) => {
  return {
    type: DELETE_GROUP,
    group: groupData
  }
}

// Create New Group
export const createNewGroup = (groupData) => async dispatch => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(groupData)
  });
  const data = await response.json();
  groupData.id = data.id
  dispatch(createGroup(groupData))
  return data;
}

// Get All Groups
export const getAllGroups = () => async dispatch => {
  const response = await csrfFetch("/api/groups", {
    method: "GET"
  });
  const data = await response.json();
  dispatch(loadAllGroups(data.groups))
  return response;
}

// Edit Current Group
export const editCurrGroup = (groupData) => async dispatch => {
  console.log(groupData)
  const response = await csrfFetch(`/api/groups/${groupData.id}`, {
    method: "PUT",
    body: JSON.stringify(groupData)
  });
  const data = await response.json();
  console.log(groupData)
  // groupData.id = data.id
  dispatch(editGroup(groupData))
  return data;
}

// Delete Current Group
export const deleteCurrGroups = (groupData) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupData.id}`, {
    method: "DELETE"
  });
  dispatch(deleteGroup(groupData))
  return await response.json()
}

let initialState = {};
let allGroupsObj = {}

function groupsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_GROUPS:
      allGroupsObj = {}
      action.groups.forEach(group => (allGroupsObj[group.id] = group))
      return allGroupsObj
    case EDIT_GROUP:
      return {}
      case DELETE_GROUP:
        const newState = {...state}
        delete newState[action.group.id]
      return {...newState}
    case CREATE_NEW_GROUP:
      return {...state, ...action.groupData}
    default:
      return state;
  }
}

export default groupsReducer

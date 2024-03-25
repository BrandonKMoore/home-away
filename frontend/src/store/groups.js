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
  const groupObj = {}
  data.groups.forEach(group => (groupObj[group.id] = group))
  dispatch(loadAllGroups(groupObj))
  return response;
}

// Edit Current Group
export const editCurrGroup = (groupData) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupData.id}`, {
    method: "PUT",
    body: JSON.stringify(groupData)
  });
  const data = await response.json();
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
// let allGroupsObj = {}

function groupsReducer(state = initialState, action){
  switch (action.type){
    case GET_ALL_GROUPS:
      // allGroupsObj = {}
      // action.groups.forEach(group => (allGroupsObj[group.id] = group))
      // return allGroupsObj
      return {...action.groups}
    case EDIT_GROUP:
      return {...state}
      case DELETE_GROUP:
        initialState = {...state}
        delete initialState[action.group.id]
      return {...initialState}
    case CREATE_NEW_GROUP:
      initialState = {}
      initialState[action.groupData.id] = {...action.groupData}
      return {}
    default:
      return state;
  }
}

export default groupsReducer

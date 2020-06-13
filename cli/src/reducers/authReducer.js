import { SET_TOKEN, SET_AUTH, SET_MEMBER_ID } from '../actions/types';

const initialState = {
    token: '',
    isAuth:false,
    memberID: '',
}

export default function(state = initialState, action ) {
  switch(action.type) {
      case SET_TOKEN:
          return {
              ...state,
              token: action.payload.token,
          }
      case SET_AUTH:
          return {
              ...state,
              isAuth: action.payload.isAuth,
          }
      case SET_MEMBER_ID:
        return {
            ...state,
            memberID: action.payload.memberID,
        }
      default:
          return state;
  }
}


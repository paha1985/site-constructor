import { UserState } from "../../types";

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

type UserAction = 
  | { type: 'UPDATE_USER_REQUEST' }
  | { type: 'UPDATE_USER_SUCCESS'; payload: any }
  | { type: 'UPDATE_USER_FAILURE'; payload: string }
  | { type: 'LOAD_USER_PROFILE_REQUEST' }
  | { type: 'LOAD_USER_PROFILE_SUCCESS'; payload: any }
  | { type: 'LOAD_USER_PROFILE_FAILURE'; payload: string }
  | { type: 'CLEAR_USER_ERROR' };

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case "UPDATE_USER_REQUEST":
    case "LOAD_USER_PROFILE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };

    case "LOAD_USER_PROFILE_SUCCESS":
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };

    case "UPDATE_USER_FAILURE":
    case "LOAD_USER_PROFILE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_USER_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;
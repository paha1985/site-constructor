import { Action, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import siteReducer from "./reducers/siteReducer";
import userReducer from "./reducers/userReducer";
import constructorReducer from "./reducers/constructorReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  sites: siteReducer,
  constructor: constructorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;


export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
})

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
import { ComponentType } from "@/types";
import { createComponent } from "../../utils/createComponent";
import { AppDispatch, RootState } from "../index";
import {AppThunk} from "../index"

export const addComponent = (type: ComponentType): AppThunk => (dispatch, getState) => {
  const newComponent = createComponent(type);
  dispatch({
    type: "ADD_COMPONENT",
    payload: newComponent,
  });  
};

export const selectComponent = (id: string | null) => ({
  type: 'SELECT_COMPONENT',
  payload: id,
});
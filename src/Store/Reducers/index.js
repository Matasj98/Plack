import { combineReducers } from "redux";
import { user } from "./user";
import { channel } from "./channel";

const appReducer = combineReducers({
  user,
  channel
});

export const allReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return appReducer(state, action);
};

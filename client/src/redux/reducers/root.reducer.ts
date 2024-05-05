import { combineReducers } from "@reduxjs/toolkit";
import formReducer from "./form.reducer";

const rootReducer = combineReducers({
  formReducer: formReducer,
});

export default rootReducer;

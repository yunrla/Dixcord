import { combineReducers } from "redux";
import statesReducer from "./states";

const rootReducer = combineReducers({
    statesReducer,
});

export default rootReducer;
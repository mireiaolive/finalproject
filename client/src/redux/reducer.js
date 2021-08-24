import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends/slice";
import { messagesReducer } from "./messages/slice.js";

const rootReducer = combineReducers({
    friends: friendsAndWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;

//messagesReducer
export function messagesReducer(state = [], action) {
    if (action.type === "messages/recent") {
        state = action.payload.messages;
    }
    if (action.type === "messages/add") {
        state = [action.payload.message, ...state];
    }

    return state;
}

//Action Creators
//you should need 2 of them: one to initially populate the state with the 10 most recent messages and one to add any incoming messages to the list
//The action creators will be called in socket.js.
export function chatMessagesReceived(messages) {
    return {
        type: "messages/recent",
        payload: messages,
    };
}
export function chatMessageReceived(messages) {
    return {
        type: "messages/add",
        payload: messages,
    };
}

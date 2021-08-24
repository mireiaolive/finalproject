//friends reducer
//receives the current state and an action object
export default function friendsAndWannabeesReducer(state = [], action) {
    //state to be the array of friends and wannabees
    console.log("see action here: ", action);
    if (action.type == "friends/received") {
        state = action.payload.friendsAndWannabees;
    }

    //one of users in the existing array of friends and wannabees should have accepted property set to true
    if (action.type == "friends/accepted") {
        console.log("see action friends accepted: ", action);
        state = state.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: true };
            }
        });
    }
    //one should be removed
    if (action.type == "friends/unfriended") {
        state = state.filter((friend) => {
            if (friend.id === action.payload.id) {
                return {
                    ...friend,
                    accepted: false,
                };
            } else {
                return friend;
            }
        });
    }
    return state;
}

//Action creators
//3 action creators that we can declare in friends/slice.js
//creates an action to populate the state with the current list of friends and wannabees
//An action object can have other fields with additional information about what happened, we put that information in a field called payload
export function receiveFriendsAndWannabees(data) {
    return {
        type: "friends/received",
        payload: data,
    };
}

//creates an action to accept a wannabee as a friend, the id should be in the payload
export function acceptFriendRequest(id) {
    return {
        type: "friends/accepted",
        payload: id,
    };
}

//creates an action to end a friendship, the id should be in the payload
export function unfriend(id) {
    return {
        type: "friends/unfriended",
        payload: id,
    };
}

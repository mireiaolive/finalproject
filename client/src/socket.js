//This file contains a function to initialize the socket connection in a way that ensures there can be only one.
//It also listens for all the events that are expected to happen and makes sure the appropriate Redux actions are
//dispatched when they do. It also makes the socket object available to be imported in other files so they can emit events to the server.
import { io } from "socket.io-client";
export let socket;
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "./redux/messages/slice.js";

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (data) =>
            store.dispatch(chatMessagesReceived(data))
        );

        socket.on("chatMessage", (data) => {
            console.log("see data: ", data);
            store.dispatch(chatMessageReceived(data));
        });
    }
};

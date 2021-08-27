import { useSelector } from "react-redux";
import { socket } from "./socket";
import Audio from "./audio";
import Moment from "react-moment";

export function Chat() {
    const messages = useSelector((state) => state.messages);

    const handleKey = (event) => {
        console.log(socket);
        console.log(event.target.value);
        if (event.key === "Enter") {
            event.preventDefault();
            socket.emit("newmessage", event.target.value);
            event.target.value = "";
        }
    };

    console.log("messages: ", messages);

    return (
        <section>
            <div className="message-container">
                <div className="audio-file">
                    <Audio />
                </div>
                <div className="messages-display">
                    {messages &&
                        messages.map((message) => {
                            return (
                                <div
                                    className="container-user"
                                    key={message.id}
                                >
                                    <img src={message.imageurl} />
                                    <div className="container-user-flex">
                                        <p className="color">
                                            {message.first} {message.last}
                                        </p>
                                        <div className="text">
                                            <div>{message.text}</div>
                                            <Moment toNow className="time">
                                                {message.created_at}
                                            </Moment>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="message-write">
                    <textarea
                        className="textarea"
                        placeholder="Write a comment.."
                        onKeyPress={handleKey}
                    ></textarea>
                </div>
            </div>
        </section>
    );
}

import { useSelector } from "react-redux";
import { socket } from "./socket";

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
                <h1>Chat</h1>
                <div className="message-write">
                    <textarea
                        className="textarea"
                        placeholder="Write a comment"
                        onKeyPress={handleKey}
                    ></textarea>
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
                                    <p>
                                        {message.first} {message.last}
                                    </p>

                                    <div>said.. {message.text}</div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}

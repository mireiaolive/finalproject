import { useSelector } from "react-redux";
import { socket } from "./socket";

export function Chat() {
    const messages = useSelector((state) => state.messages);

    const handleKey = (event) => {
        console.log(socket);
        console.log(event.target.value);
        if (event.key === "Enter") {
            event.preventDefault();
            socket.emit("new-message", event.target.value);
            event.target.value = "";
        }
    };

    return (
        <section>
            <div className="message-container">
                <h1>Chat</h1>
                <div className="messages">
                    {messages &&
                        messages.map((message) => {
                            <div key={message.id}>
                                <div className="container-user">
                                    <img src={message.imageUrl} />
                                    <p>
                                        {message.first} {message.last}
                                    </p>
                                    <div>{message.text}</div>
                                </div>
                            </div>;
                        })}
                </div>
                <div className="message-write">
                    <textarea
                        className="textarea"
                        placeholder="Write a comment"
                        onKeyPress={handleKey}
                    ></textarea>
                </div>
            </div>
        </section>
    );
}

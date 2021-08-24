import { useState, useEffect } from "react";
import axios from "axios";
//you need to have access to the id of the otheruser
export default function FriendButton({ otherId }) {
    console.log("see other user id: ", otherId);
    //const [friendId, setFriendId] = useState();
    const [buttonText, setButtonText] = useState("");
    //what the button actually says

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/checkFriendStatus/${otherId}`);
            //setFriendId(data.id);
            setButtonText(data.buttonText);
            console.log("we see data: ", data, otherId);
        })();
    }, []);

    const handleSubmit = async () => {
        console.log("button clicked");
        const { data } = await axios.post("/friend", {
            otherId: otherId,
            //friendId: friendId,
            buttonText: buttonText,
        });
        setButtonText(data.buttonText);
        console.log("we see data: ", data);
    };

    return (
        <div className="center-button">
            <button className="btn" onClick={handleSubmit}>
                {buttonText}
            </button>
        </div>
    );
}

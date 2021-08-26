import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
//friends action creators
import {
    receiveFriendsAndWannabees,
    acceptFriendRequest,
    unfriend,
} from "./redux/friends/slice";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/friends-and-wannabees");
            console.log("data: ", data);
            dispatch(receiveFriendsAndWannabees(data));
        })();
    }, []);

    //Retrive to types of information from the state with the useSelector() hook:
    const wannabees = useSelector((state) => {
        return (
            state.friends && state.friends.filter(({ accepted }) => !accepted)
        );
    });

    const friends = useSelector((state) => {
        return (
            state.friends && state.friends.filter(({ accepted }) => accepted)
        );
    });
    console.log("friends: ", friends);
    console.log("wannabees: ", wannabees);

    //dispatch actions when the friendship buttons are clicked
    const end = (ar) => {
        const id = ar;
        axios
            .post("/friend/end", { otherId: id })
            .then(({ data }) => {
                console.log("unfriend button : ", data);
            })
            .catch((err) => {
                console.log("err axios clicked end friend: ", err);
            });
    };

    const add = (ar) => {
        const id = ar;
        axios
            .post("/friend/add", { otherId: id })
            .then(({ data }) => {
                console.log("unfriend button : ", data);
            })
            .catch((err) => {
                console.log("err axios clicked accept friend: ", err);
            });
    };

    return (
        <div className="friends-wannabees">
            <p>Your friends</p>
            <section className="friends">
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div key={friend.id} className="friends-direction">
                                <Link to={`/user/${friend.id}`}>
                                    <img
                                        className="profile-pic"
                                        src={friend.imageurl}
                                    />
                                </Link>
                                <div className="friends-data">
                                    {friend.first} {friend.last}
                                    <button
                                        onClick={() => {
                                            dispatch(unfriend(friend.id));
                                            end(friend.id);
                                        }}
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </section>
            <p>Friends request</p>
            <section className="friends">
                {wannabees &&
                    wannabees.map((wannabee) => (
                        <div key={wannabee.id} className="friends-direction">
                            <Link to={`/user/${wannabee.id}`}>
                                <img
                                    className="profile-pic"
                                    src={wannabee.imageurl}
                                />
                            </Link>
                            <div className="friends-data">
                                {wannabee.first} {wannabee.last}
                                <button
                                    onClick={() => {
                                        dispatch(
                                            acceptFriendRequest(wannabee.id)
                                        );
                                        add(wannabee.id);
                                    }}
                                >
                                    Add Friend
                                </button>
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    );
}

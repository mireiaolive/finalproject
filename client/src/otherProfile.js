//here we show the profile information of a user other than the logged in user
import { Component } from "react";
import axios from "axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
        };
    }
    componentDidMount() {
        //match contains info about how React Router interpreted the url
        //match object will have a property named params
        //to access the id you will put into your ajax req as this.props.match.params.id.
        let otherId = this.props.match.params.id;
        console.log("other profile component is mounted:", otherId);
        axios
            .get(`/api/user/${otherId}`)
            .then(({ data }) => {
                console.log("data user:", data);
                //if no data, redirect user away using the history prop
                if (!data.object) {
                    return this.props.history.push("/");
                } else {
                    this.setState({
                        id: this.props.match.params.id,
                        first: data.object.first,
                        last: data.object.last,
                        imageUrl: data.object.imageurl,
                        bio: data.object.bio,
                    });
                }
            })
            .catch((err) => {
                console.log("here an error in axios get request user/:id", err);
            });
    }

    render() {
        return (
            <div className="profile-big">
                <div className="profile-pic">
                    <img className="profile-pic" src={this.state.imageUrl} />
                    <FriendButton otherId={this.props.match.params.id} />
                </div>
                <div className="profile-bio">
                    <p>
                        {this.state.first} {this.state.last}
                    </p>
                    <p>{this.state.bio}</p>
                </div>
            </div>
        );
    }
}

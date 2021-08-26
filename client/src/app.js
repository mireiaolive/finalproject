import { BrowserRouter, Link, Route } from "react-router-dom";
import { Component } from "react";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import axios from "axios";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import { Chat } from "./chat";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
            uploaderShow: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.methodInApp = this.methodInApp.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        //console.log("app component is mounted");
        axios
            .get("/user", this.state)
            .then(({ data }) => {
                const { first, last, imageUrl, bio } = data;
                //console.log("result :", result);
                this.setState({
                    first,
                    last,
                    imageUrl,
                    bio,
                });
                //console.log("we see the state:", this.state);
            })
            .catch((err) => {
                console.log("err in axios user get request", err);
                this.setState({ error: true });
            });
    }

    toggleModal() {
        //console.log("is running here");
        this.setState({ uploaderShow: !this.state.uploaderShow });
    }

    methodInApp(imageUrl) {
        //console.log("argument passed: ", imageUrl);
        this.setState({ imageUrl: imageUrl });
        this.toggleModal();
    }

    setBio(draftBio) {
        //console.log("draftbio passed: ", draftBio);
        this.setState({ bio: draftBio });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div className="header">
                        <div className="img-logo-app">
                            <Logo />
                        </div>

                        <div className="findpeople">
                            <Link to="/chat">Upload</Link>
                            <Link to="/findpeople">Search</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/logout">Sign Out</Link>
                        </div>
                        <div className="profile-pic-app">
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                            />
                        </div>
                    </div>

                    <div className="profile-box">
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    onClick={this.showUploader}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                    </div>
                    <h2
                        className="modal"
                        onClick={() => this.toggleModal()}
                    ></h2>

                    {this.state.uploaderShow && (
                        <Uploader toggleModal={this.toggleModal} />
                    )}

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/findpeople"
                        render={(props) => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/friends"
                        render={(props) => (
                            <Friends
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/chat"
                        render={(props) => (
                            <Chat
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

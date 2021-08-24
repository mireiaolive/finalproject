import { Component } from "react";
import axios from "axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorVis: false,
            draftBio: props.bio || "",
        };

        //console.log("draftBio: ", this.draftBio);
        //console.log("we see here props bio: ", this.props.bio);
        this.textareaToggle = this.textareaToggle.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    textareaToggle() {
        this.setState({
            //to change the visibility
            editorVis: !this.state.editorVis,
            draftBio: this.props.bio,
        });
    }

    updateBio() {
        // Once successful, you can call a function passed down from App
        // to update the value in App
        // update the value of the bio in the DB with the new one.
        axios
            .post("/profile/bio", { bio: this.state.draftBio })
            .then(({ data }) => {
                console.log("results in data: ", data);
                this.props.setBio(data.bio);
                this.setState({ editorVis: false });
            })
            .catch((err) => {
                console.log("error update bio data:", err);
            });
    }

    handleChange({ target }) {
        //console.log("which user changes runs?: ", target.name);
        //console.log("value whats typed: ", target.value);
        // here we are updating the state
        this.setState(
            { draftBio: target.value }
            //console.log("here this.state in bio: ", this.state)
        );
    }

    render() {
        //console.log("this.props.bio: ", this.props.bio);
        //console.log("this state", this.state);
        return (
            <div className="bio-container">
                {/* BIO EDITOR */}
                {/* //3 scenario */}
                {this.props.bio && !this.state.editorVis && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button onClick={this.textareaToggle}>edit</button>
                    </div>
                )}
                {/* //2 scenario */}
                {this.state.editorVis && (
                    <div className="edit-bio">
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={this.handleChange}
                        />
                        <button onClick={this.updateBio}>save</button>
                    </div>
                )}
                {/* //1 scenario */}
                {!this.props.bio && !this.state.editorVis && (
                    <p className="add-bio" onClick={this.textareaToggle}>
                        Add your bio now
                    </p>
                )}
            </div>
        );
    }
}

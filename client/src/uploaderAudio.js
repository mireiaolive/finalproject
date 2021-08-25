import { Component } from "react";
import axios from "axios";

//uploader needs to be a class component as it will have state
export default class UploaderAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.methodInUploader = this.methodInUploader.bind(this);
        this.fileSelection = this.fileSelection.bind(this);
        //console.log("props: ", props);
    }

    componentDidMount() {
        console.log("uplader picture profile mounted");
    }

    methodInUploader() {
        // this is where you'll be doing formdata to send your image to the server
        // send the image up to app - you can do so by calling the method in App
        // this method in App was passed down to uploader
        var file = this.file;
        console.log("here our file", file);

        var formData = new FormData();
        formData.append("file", file);
        axios
            .post("/upload", formData)
            .then((result) => {
                console.log(result.data.imageUrl);
                //this.props.(result.data.imageUrl);
            })
            .catch((err) => {
                console.log("here an err", err);
            });
    }

    fileSelection(e) {
        this.file = e.target.files[0];
    }

    render() {
        return (
            <div className="uploader-audio">
                <h2>Upload audio here</h2>
                <input
                    className="select-input"
                    type="file"
                    onChange={this.fileSelection}
                />
                <button onClick={() => this.methodInUploader()}>Upload</button>
            </div>
        );
    }
}

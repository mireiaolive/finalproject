import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errorMessage: "",
            view: 1,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange({ target }) {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.view === 1) {
            console.log("view one");
            return axios
                .post("/reset/start", this.state)
                .then((resp) => {
                    console.log("response: ", resp);
                    this.setState({
                        view: 2,
                    });
                })
                .catch((err) => {
                    console.log(
                        "something went wrong in axios post register",
                        err
                    );
                    this.setState({
                        error: true,
                        errorMessage: "Ops! Something went wrong",
                    });
                });
        } else if (this.state.view == 2) {
            console.log("view two");
            return axios
                .post("/reset/verify", this.state)
                .then((resp) => {
                    console.log("response: ", resp);
                    this.setState({ view: 3 });
                })
                .catch((err) => {
                    console.log(
                        "something went wrong in axios post register",
                        err
                    );
                    this.setState({
                        error: true,
                        errorMessage: "Ops! Something went wrong",
                    });
                });
        }
    }

    componentDidMount() {
        console.log("Reset mounted");
    }

    viewToRender() {
        if (this.state.view === 1) {
            return (
                <section>
                    <div>
                        <h1>Reset Password</h1>
                        <h1>
                            Please enter the email address with which you
                            registered
                        </h1>
                        {this.state.error && (
                            <h2 style={{ color: "red" }}>
                                {this.state.errorMessage}
                            </h2>
                        )}
                    </div>
                    <form>
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={this.handleChange}
                        />
                        <button onClick={(e) => this.handleSubmit(e)}>
                            Submit
                        </button>
                    </form>
                </section>
            );
        } else if (this.state.view === 2) {
            return (
                <section>
                    <div>
                        <h1>Reset Password</h1>
                        <h1>Please enter the code you received</h1>
                        {this.state.error && (
                            <h2 style={{ color: "red" }}>
                                {this.state.errorMessage}
                            </h2>
                        )}
                    </div>
                    <form>
                        <input
                            name="code"
                            placeholder="code"
                            onChange={this.handleChange}
                        />
                        <h1>Please enter a new password</h1>
                        <input
                            name="newpassword"
                            placeholder="newpassword"
                            onChange={this.handleChange}
                        />
                        <button onClick={(e) => this.handleSubmit(e)}>
                            Submit
                        </button>
                    </form>
                </section>
            );
        } else if (this.state.view === 3) {
            return (
                <section>
                    <div>
                        <h1>Reset Password</h1>
                        <h1>Success!</h1>
                    </div>
                    <form>
                        <Link className="link" to="/login">
                            You can now log in with your new password
                        </Link>
                    </form>
                </section>
            );
        }
    }

    render() {
        return (
            <section>
                <div>{this.viewToRender()}</div>
            </section>
        );
    }
}

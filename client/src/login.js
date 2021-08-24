import { Link } from "react-router-dom";
import { Component } from "react";
import axios from "axios";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errorMessage: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange({ target }) {
        //console.log("which user changes runs?: ", target.name);
        //console.log("value whats typed: ", target.value);
        this.setState(
            { [target.name]: target.value }
            //console.log("here this.state in registration: ", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault();
        //console.log("the user clicked the register button");
        //console.log("this.state in register", this.state);
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp: ", resp);
                if (resp.data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                        errorMessage: resp.data.errorMessage,
                    });
                }
            })
            .catch((err) => {
                console.log("something went wrong in axios post register", err);
                this.setState({
                    error: true,
                    errorMessage: "Ops! Something went wrong",
                });
            });
    }
    componentDidMount() {
        console.log("Registration mounted");
    }
    render() {
        return (
            <section className="registration">
                {this.state.error && (
                    <h2 className="error" style={{ color: "red" }}>
                        {this.state.errorMessage}
                    </h2>
                )}
                <form>
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                    />
                    <button onClick={(e) => this.handleSubmit(e)}>
                        Log in
                    </button>
                    <Link className="link" to="/reset">
                        Don’t know your password?
                    </Link>
                </form>
            </section>
        );
    }
}

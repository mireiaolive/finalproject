import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export class Registration extends Component {
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
        // here we are updating the state
        this.setState(
            { [target.name]: target.value }
            //console.log("here this.state in registration: ", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault(); //prevents from provoke a refresh
        //console.log("the user clicked the register button");
        //here went button clicked we want an axios request  sending value of state
        //console.log("this.state in register", this.state);
        axios
            .post("/register", this.state)
            .then((resp) => {
                if (resp.data.success) {
                    location.reload();
                    //registration worked well
                } else {
                    //render an error
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
                    <h2 style={{ color: "red" }}>{this.state.errorMessage}</h2>
                )}
                <form>
                    <input
                        name="first"
                        placeholder="First Name"
                        onChange={this.handleChange}
                    />
                    <input
                        name="last"
                        placeholder="Last Name"
                        onChange={this.handleChange}
                    />
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
                        Register
                    </button>
                    <Link className="link" to="/login">
                        You already have an account?
                    </Link>
                </form>
            </section>
        );
    }
}

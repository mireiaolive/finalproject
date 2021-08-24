import { HashRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import Login from "./login";
import Logo from "./logo";
import Reset from "./reset";

export default function Welcome() {
    return (
        <>
            <Logo />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </div>
            </HashRouter>
        </>
    );
}
